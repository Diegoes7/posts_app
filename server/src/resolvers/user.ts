import { User } from '../entities/User'; //* need to be with ../ instead of src/ for some reason ??? 
import { MyContext } from 'src/types';
import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql';
import argon2 from 'argon2';
import { UserResponse } from '../entities/util_object_types';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { validateRegister } from '../utils/validateRegister';
// import { sendEmail } from '../utils/sendGrid_mailer';
import { v4 } from 'uuid';
import { AppDataSource } from '../typeorm_config';
import { capitalizeFirstLetter } from '../utils/firstLetterCapitalized';
import { sendEmailTest } from '../utils/sendMail';

//i use for arguments in the resolvers, when need
@InputType()
export class UsernamePasswordInput {
	@Field()
	email: string;

	@Field()
	username: string;

	@Field()
	password: string;
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

		return { user };
	}

	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: MyContext
	) {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			//* the email is not in the db
			return true;
		}
		const token = v4(); //* give a random string
		await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "EX", 1000 * 60 * 60 * 24 * 3);

		//! need to setup a real email provider, that's why leave localhost
		const link = `<a href="http://localhost:3000/change_password/${token}">reset password</a>`;
		await sendEmailTest(email, link);
		return true;
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
			// User.create({}).save()
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
			// console.log(user)
			// return user;
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

		//! store user id session, this will set a cookie after register 
		//! and keep the user logged in
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

		return { user };
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: MyContext) {
		return new Promise(result => req.session.destroy(err => {
			res.clearCookie(COOKIE_NAME);
			if (err) {
				console.log(err);
				result(false);
				return;
			}

			result(true);
		}));
	}
}
