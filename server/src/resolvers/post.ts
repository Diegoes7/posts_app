import { MyContext } from 'src/types';
import { Post } from '../entities/Post';
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { AppDataSource } from '../db/typeorm_config';
import { Updoot } from '../entities/Updoot';
import { User } from '../entities/User';
import { logEvent } from '../kafka/logEvent';

@InputType()
class PostInput {
	@Field()
	title: string;

	@Field()
	text: string;
}

@ObjectType()
class PaginatedPosts {
	@Field(() => [Post])
	posts: Post[];
	@Field()
	hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String, { nullable: true })
	textSnippet(@Root() post: Post) {
		return post.text.slice(0, 50);
	}

	@FieldResolver(() => User)
	creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
		//* return User.findOne({ where: { id: post.creatorId } }); without optimizing
		return userLoader.load(post.creatorId);
	}

	@FieldResolver(() => Int, { nullable: true })
	async voteStatus(@Root() post: Post, @Ctx() { updootLoader, req }: MyContext) {
		if (!req.session.userID) {
			return null;
		}
		const updoot = await updootLoader.load({ postId: post.id, userId: req.session.userID });

		return updoot ? updoot.value : null;
	}


	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async vote(
		@Arg("postID", () => Int) postId: number,
		@Arg("value", () => Int) value: number,
		@Ctx() { req }: MyContext
	): Promise<boolean> {
		const isUpdoot = value !== -1;
		const realValue = isUpdoot ? 1 : -1;
		const userId = req.session.userID;
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			throw new Error("User not found, cannot update post");
		}
		const post = await Post.findOne({ where: { id: postId } });

		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const existingVote = await queryRunner.manager.findOne(Updoot, {
				where: { postId, userId },
			});

			if (!existingVote) {
				// No previous vote: create new vote and adjust points
				await queryRunner.manager.save(Updoot, {
					userId,
					postId,
					value: realValue,
				});
				await queryRunner.manager.increment(Post, { id: postId }, "points", realValue);
			} else if (existingVote.value === realValue) {
				// Same vote clicked again: remove vote and revert point
				await queryRunner.manager.delete(Updoot, {
					userId,
					postId,
				});
				await queryRunner.manager.increment(Post, { id: postId }, "points", -realValue);
			} else {
				// Vote flipped: update vote and adjust points accordingly
				await queryRunner.manager.update(
					Updoot,
					{ userId, postId },
					{ value: realValue }
				);
				// Flip from +1 to -1: total -2; from -1 to +1: total +2
				await queryRunner.manager.increment(Post, { id: postId }, "points", 2 * realValue);
			}

			await queryRunner.commitTransaction();

			//! log the vote event
			try {
				await logEvent({
					event: "user.voted",
					actorId: userId,
					description: `User ${user.username} voted ${realValue} on post ${post?.title}`,
					timestamp: new Date().toISOString(),
					payload: {
						userId,
						postId,
						username: user.username,
						email: user.email,
						value: realValue,
					},
				});
			} catch (err) {
				console.error('[logEvent] Failed to log event:', err);
			}
		} catch (err) {
			await queryRunner.rollbackTransaction();
			console.error("Transaction failed:", err);
			return false;
		} finally {
			await queryRunner.release();
		}

		return true;
	}

	// @Mutation(() => Boolean)
	// @UseMiddleware(isAuth)
	// async vote(
	// 	@Arg("postID", () => Int) postId: number,
	// 	@Arg("value", () => Int) value: number,
	// 	@Ctx() { req }: MyContext
	// ) {
	// 	const isUpdoot = value !== -1;
	// 	const realValue = isUpdoot ? 1 : -1;
	// 	const userId = req.session.userID;

	// 	// const upDoot = await Updoot.findOne({ where: { postId, userId } });

	// 	async function voteTransaction(userId: number, postId: number, realValue: number) {
	// 		const queryRunner = AppDataSource.createQueryRunner();

	// 		await queryRunner.connect();
	// 		await queryRunner.startTransaction();

	// 		try {
	// 			// Insert into updoots table
	// 			await queryRunner.manager.save(Updoot, {
	// 				userId,
	// 				postId,
	// 				value: realValue,
	// 			});

	// 			// Update points in the post table
	// 			await queryRunner.manager.increment(Post, { id: postId }, 'points', realValue);

	// 			await queryRunner.commitTransaction();

	// 			//!Log the vote event
	// 			try {
	// 				await logEvent({
	// 					event: "user.voted",
	// 					actorId: userId,
	// 					description: `User ${userId} voted on post ${postId}`,
	// 					timestamp: new Date().toISOString(),
	// 					payload: {
	// 						userId,
	// 						postId,
	// 						value: realValue,
	// 					},
	// 				});
	// 			} catch (err) {
	// 				console.error('[logEvent] Failed to log event:', err);
	// 			}
	// 		} catch (err) {
	// 			await queryRunner.rollbackTransaction();
	// 			console.error('Transaction failed:', err);
	// 		} finally {
	// 			await queryRunner.release();
	// 		}
	// 	}
	// 	// Call the function with appropriate arguments
	// 	// voteTransaction(1, 2, 1)
	// 	// 	.then(() => console.log('Transaction completed successfully'))
	// 	// 	.catch((err) => console.error('Transaction failed:', err));

	// 	await voteTransaction(userId, postId, realValue);

	// 	//! the user vote on the same post before
	// 	// if (upDoot && upDoot.value !== realValue) {
	// 	// 	const newValue = realValue;
	// 	// } else if (!upDoot) {
	// 	// 	await voteTransaction(userID, postID, realValue);
	// 	// }

	// 	return true;
	// }

	// @Query(() => PaginatedPosts)
	// async posts(
	// 	@Arg('limit', () => Int) limit: number,
	// 	@Arg('cursor', () => String, { nullable: true }) cursor: string | null,
	// ): Promise<PaginatedPosts> {
	// 	const realLimit = Math.min(50, limit); //! take the smaller of two values
	// 	const realLimitPlusOne = realLimit + 1;

	// 	const replacements: any[] = [realLimitPlusOne];

	// 	if (cursor) {
	// 		replacements.push(new Date(parseInt(cursor)));
	// 	}

	// 	const posts = await AppDataSource.query(
	// 		`
	//  			select p.* 
	//  			from post p
	//  			inner join public.user u on u.id = p."creatorId"
	//  			${cursor ? `where p."createdAt" < $2` : ""}
	//  			order by p."createdAt" DESC
	//  			limit $1
	//   `,
	// 		replacements
	// 	);


	// 	let hasMore = false;
	// 	if (posts.length === realLimitPlusOne) {
	// 		hasMore = true;
	// 		posts.pop();
	// 	}

	// 	// console.log(posts);
	// 	return { posts: posts.slice(0, realLimit), hasMore };
	// }

	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null,
		@Arg('search', () => String, { nullable: true }) search: string | null,
		@Arg('creatorId', () => Int, { nullable: true }) creatorId: number | null
	): Promise<PaginatedPosts> {
		const realLimit = Math.min(50, limit);
		const realLimitPlusOne = realLimit + 1;

		const values: any[] = [realLimitPlusOne];
		let paramIndex = 2;

		let whereClauses: string[] = [];

		if (cursor) {
			whereClauses.push(`p."createdAt" < $${paramIndex++}`);
			values.push(new Date(parseInt(cursor)));
		}

		if (search) {
			whereClauses.push(
				`(p.title ILIKE $${paramIndex} OR p.text ILIKE $${paramIndex})`
			);
			values.push(`%${search}%`);
			paramIndex++;
		}

		if (creatorId) {
			whereClauses.push(`p."creatorId" = $${paramIndex++}`);
			values.push(creatorId);
		}

		const whereClause =
			whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

		const posts = await AppDataSource.query(
			`
		SELECT p.*
		FROM post p
		${whereClause}
		ORDER BY p."createdAt" DESC
		LIMIT $1
		`,
			values
		);

		let hasMore = false;
		if (posts.length === realLimitPlusOne) {
			hasMore = true;
			posts.pop();
		}

		return {
			posts,
			hasMore,
		};
	}


	@Query(() => Post, { nullable: true })
	async post(@Arg('id', () => Int) id: number,
		@Ctx() { req }: MyContext
	): Promise<Post | null> {
		// return Post.findOne({ where: { id } });
		const postRepo = AppDataSource.getRepository(Post);
		const post = await postRepo.findOne({ where: { id } });

		if (!post) return null;

		// ✅ Increment post points by 1 (popularity tracking)
		await postRepo.increment({ id }, 'popularityPts', 1);

		// ✅ Log read event (if user is authenticated)
		const actorId = req.session.userID ?? undefined;

		await logEvent({
			event: 'post.read',
			actorId,
			timestamp: new Date().toISOString(),
			description: `Post ${post.title} was read`,
			payload: {
				postId: post.id,
				title: post.title,
				text: post.text,
				voteStatus: post.voteStatus,
			},
		});

		return post;
	};

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(@Arg('input') input: PostInput,
		@Ctx() { req }: MyContext,
	): Promise<Post> {
		//! Need to make a kafka producer to send the event
		const userId = req.session.userID;
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			throw new Error("User not found, cannot create post");
		}

		const post = await Post.create({
			...input,
			creatorId: req.session.userID,
		}).save();

		try {
			await logEvent({
				event: "post.created",
				actorId: user.id,
				timestamp: new Date().toISOString(),
				description: `${user.username} created a new post`,
				payload: {
					id: user.id,
					username: user.username,
					email: user.email,
					postId: post.id,
					title: post.title,
					createdAt: post.createdAt,
					text: post.text,
				},
			});
		} catch (err) {
			console.error('[logEvent] Failed to log event:', err);
		}

		return post;
	}

	@Mutation(() => Post, { nullable: true })
	@UseMiddleware(isAuth)
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg('title') title: string,
		@Arg('text') text: string,
		@Ctx() { req }: MyContext
	): Promise<Post | null> {
		//! Need to make a kafka producer to send the event
		const userId = req.session.userID;
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			throw new Error("User not found, cannot update post");
		}

		const result = await AppDataSource
			.createQueryBuilder()
			.update(Post)
			.set({ title, text })
			.where('id = :id and "creatorId" = :creatorId', { id, creatorId: req.session.userID })
			.returning('*')
			.execute();

		const updatedPost = result.raw[0];

		if (updatedPost) {
			try {
				await logEvent({
					event: "post.updated",
					actorId: user.id,
					timestamp: new Date().toISOString(),
					description: `${user.username} updated a post ${updatedPost.title}`,
					payload: {
						id: user.id,
						username: user.username,
						email: user.email,
						postId: updatedPost.id,
						title: updatedPost.title,
						createdAt: updatedPost.createdAt,
						text: updatedPost.text,
					},
				});
			} catch (err) {
				console.error('[logEvent] Failed to log event:', err);
			}
		}

		return updatedPost || null;
	};

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deletePost(
		@Arg('id', () => Int) id: number,
		@Ctx() { req }: MyContext
	): Promise<boolean> {
		const userId = req.session.userID;
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			throw new Error("User not found, cannot update post");
		}

		const post = await Post.findOne({ where: { id, creatorId: userId } });

		const { affected } = await Post.delete({ id, creatorId: req.session.userID });
		if (affected === 0) {
			return false; // Nothing deleted, unauthorized or non-existent
		}

		//! 🔁 Emit Kafka event for post deletion
		try {
			await logEvent({
				event: "post.deleted",
				actorId: user.id,
				timestamp: new Date().toISOString(),
				description: `${user.username} deleted a post ${post?.title}`,
				payload: {
					id: user.id,
					username: user.username,
					email: user.email,
					postId: post?.id,
					title: post?.title,
					createdAt: post?.createdAt,
					text: post?.text,
				},
			});
		} catch (err) {
			console.error('[logEvent] Failed to log event:', err);
		}

		return true;

		// await Post.delete({ id, creatorId: req.session.userID });
		// return true;
	}
}
