import { User } from '../entities/User'; //* need to be with ../ instead of src/ for some reason ??? 
import { MyContext } from 'src/types';
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import argon2 from 'argon2';
import { UserResponse } from '../entities/util_object_types';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../utils/constants';
import { validateRegister } from '../utils/validateRegister';
import { v4 } from 'uuid';
import { AppDataSource } from '../db/typeorm_config';
import { capitalizeFirstLetter } from '../utils/firstLetterCapitalized';
import { sendPasswordResetEmail } from '../utils/sendMail';
import { logEvent } from '../kafka/logEvent';
import { isAuth } from '../middleware/isAuth';
import { IsEmail, IsOptional, Length } from 'class-validator';

//! use for arguments in the resolvers, when need
@InputType()
export class UsernamePasswordInput {
	@Field()
	email: string;

	@Field()
	username: string;

	@Field()
	password: string;
}

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	@IsOptional()
	@Length(3, 32)
	username?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsEmail()
	email?: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	ratingPts?: number;
}

@ObjectType()
class ForgotPasswordResponse {
	@Field()
	success: boolean;

	@Field({ nullable: true })
	previewUrl?: string;
}

@Resolver(User)
export class UserResolver {
	@FieldResolver(() => String)
	email(@Root() user: User, @Ctx() { req }: MyContext) {
		//! this is the current user & show own email in the UI
		if (req.session.userID === user.id) {
			return user.email;
		}
		//! can NOT see others users email
		return '';
	}

	@Query(() => User, { nullable: true })
	me(
		@Ctx() { req }: MyContext) {
		if (!req.session.userID) {
			return null;
		}

		return User.findOne({ where: { id: Number(req.session.userID) } });
	}

	@Mutation(() => UserResponse)
	async changePassword(
		@Arg('newPassword') newPassword: string,
		@Arg('token') token: string,
		@Ctx() { req, redis }: MyContext
	): Promise<UserResponse> {
		if (newPassword.length <= 3) {
			return {
				errors: [{
					field: 'newPassword',
					message: 'length must be greater than 3',
				}]
			};
		}

		const key = FORGET_PASSWORD_PREFIX + token;
		const userID = await redis.get(key);
		if (!userID) {
			return {
				errors: [{
					field: 'token',
					message: 'token expired.',
				}]
			};
		}

		const userIDNum = parseInt(userID);

		const user = await User.findOne({ where: { id: userIDNum } });
		if (!user) {
			return {
				errors: [{
					field: 'username',
					message: 'user no longer exists.',
				}]
			};
		}

		await User.update({ id: userIDNum },
			{ password: await argon2.hash(newPassword) });

		await redis.del(key);

		// log in user after change the password
		req.session.userID = user.id;

		try {
			await logEvent({
				event: "user.passwordchanged",
				actorId: user.id,
				timestamp: new Date().toISOString(),
				description: "User change password",
				payload: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			});
		} catch (err) {
			console.error('[logEvent] Failed to log event:', err);
		}

		return { user };
	}

	@Mutation(() => ForgotPasswordResponse)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: MyContext
	): Promise<ForgotPasswordResponse | Boolean> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			//* the email is not in the db
			return true;
		}
		const token = v4(); //* give a random string
		await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "EX", 1000 * 60 * 60 * 24 * 3);

		//! need to setup a real email provider, that's why leave localhost
		const link = `<a href="http://localhost:3000/change_password/${token}">reset password</a>`;
		const rawPreviewUrl = await sendPasswordResetEmail(email, link);
		const previewUrl = typeof rawPreviewUrl === 'string' ? rawPreviewUrl : undefined;

		try {
			await logEvent({
				event: "user.forgotpassword",
				actorId: user.id,
				timestamp: new Date().toISOString(),
				description: "User forgot password and requested reset by email",
				payload: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			});
		} catch (err) {
			console.error('[logEvent] Failed to log event:', err);
		}

		return {
			success: true,
			previewUrl: previewUrl
		};
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { req }: MyContext
	): Promise<UserResponse> {
		const errors = validateRegister(options);

		if (errors) {
			return { errors };
		}

		const hashedPassword = await argon2.hash(options.password);
		let user;
		try {
			const result = await AppDataSource
				.createQueryBuilder()
				.insert()
				.into(User)
				.values({
					username: capitalizeFirstLetter(options.username),
					email: options.email,
					password: hashedPassword,
				})
				.returning("*")
				.execute();

			user = result.raw[0];

			//$ different approach to log the event
			// await publishEvent('user.registered-2', {
			// 	id: user.id,
			// 	username: user.username,
			// 	email: user.email,
			// }, user.id);

			try {
				await logEvent({
					event: "user.registered",
					actorId: user.id,
					timestamp: new Date().toISOString(),
					description: "New user registration",
					payload: {
						id: user.id,
						username: user.username,
						email: user.email,
					},
				});
			} catch (err) {
				console.error('[logEvent] Failed to log event:', err);
			}

		} catch (err) {
			//! duplicate username error
			if (err.code === '23505') {
				return {
					errors: [{
						field: 'username',
						message: 'username already been taken',
					}],
				};
			}
			console.log('message: ', err.message);
		}

		//! store user id session, this will set a cookie after register and keep the user logged In
		req.session.userID = user!.id;

		return { user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('usernameOrEmail') usernameOrEmail: string,
		@Arg('password') password: string,
		@Ctx() { req }: MyContext
	): Promise<UserResponse> {
		const user = await User.findOne(usernameOrEmail.includes('@') ?
			{ where: { email: usernameOrEmail } } :
			{ where: { username: usernameOrEmail } }
		);
		if (!user) {
			return {
				errors: [{
					field: 'usernameOrEmail',
					message: 'that user does not exists!',
				}],
			};
		}

		const valid = await argon2.verify(user.password, password);
		if (!valid) {
			return {
				errors: [{
					field: 'password',
					message: 'incorrect password!',
				}],
			};
		}
		req.session.userID = user.id;

		try {
			await logEvent({
				event: "user.loggedin",
				actorId: user.id,
				timestamp: new Date().toISOString(),
				description: "New user login",
				payload: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			});
		} catch (err) {
			console.error('[logEvent] Failed to log event:', err);
		}

		return { user };
	};

	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: MyContext) {
		return new Promise(async (result) => {
			//! Get user ID before destroying session
			const userId = req.session.userID;

			const user = await User.findOne({ where: { id: userId } });
			if (!user) {
				console.warn('User not found during logout:', userId);
				result(false);
				return;
			}

			//* Destroy the session and clear the cookie
			req.session.destroy(async (err) => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					console.error('Logout error:', err);
					result(false);
					return;
				}

				if (userId) {
					try {
						await logEvent({
							event: "user.loggedout",
							actorId: user.id,
							timestamp: new Date().toISOString(),
							description: "Auth User logout",
							payload: {
								id: user.id,
								username: user.username,
								email: user.email,
							},
						});
					} catch (err) {
						console.error('[logEvent] Failed to log event:', err);
					}
				}

				result(true);
			});
		});
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth) // Assumes user is authenticated via session
	async deleteUser(@Ctx() { req }: MyContext): Promise<boolean> {
		const userId = req.session.userID;

		const userRepo = AppDataSource.getRepository(User);
		const user = await userRepo.findOne({ where: { id: userId } });

		if (!user) {
			throw new Error("User not found");
		}

		await userRepo.remove(user); // or delete({ id: userId }) if you prefer

		// ✅ Optionally destroy session
		req.session.destroy((err) => {
			if (err) console.error("Session destruction failed:", err);
		});

		// ✅ Log event to DB and Kafka
		await logEvent({
			event: "user.deleted",
			actorId: userId,
			description: `User ${user.username} deleted their account`,
			timestamp: new Date().toISOString(),
			payload: {
				id: userId,
				username: user.username,
				email: user.email,
			},
		});

		return true;
	}

	@Mutation(() => User, { nullable: true })
	@UseMiddleware(isAuth) // Assumes user is authenticated via session
	async updateUser(
		@Arg('data') data: UpdateUserInput,
		@Ctx() { req }: MyContext
	): Promise<User | null> {
		const userId = req.session.userID;

		if (!userId) {
			throw new Error('Not authenticated');
		}

		const user = await User.findOne({ where: { id: userId } });

		if (!user) {
			throw new Error('User not found');
		}

		Object.assign(user, data);
		await user.save();

		await logEvent({
			event: "user.updated",
			actorId: userId,
			description: `User ${user.username} change some fields`,
			timestamp: new Date().toISOString(),
			payload: {
				id: userId,
				username: user.username,
				email: user.email,
			},
		});

		return user;
	}
}
