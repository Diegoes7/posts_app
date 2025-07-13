import { MyContext } from 'src/types';
import { Post } from '../entities/Post';
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { AppDataSource } from '../typeorm_config';
import { Updoot } from '../entities/Updoot';
import { User } from '../entities/User';

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
	) {
		const isUpdoot = value !== -1;
		const realValue = isUpdoot ? 1 : -1;
		const userId = req.session.userID;

		// const upDoot = await Updoot.findOne({ where: { postId, userId } });

		async function voteTransaction(userId: number, postId: number, realValue: number) {
			const queryRunner = AppDataSource.createQueryRunner();

			await queryRunner.connect();
			await queryRunner.startTransaction();

			try {
				// Insert into updoots table
				await queryRunner.manager.save(Updoot, {
					userId,
					postId,
					value: realValue,
				});

				// Update points in the post table
				await queryRunner.manager.increment(Post, { id: postId }, 'points', realValue);

				await queryRunner.commitTransaction();
			} catch (err) {
				await queryRunner.rollbackTransaction();
				console.error('Transaction failed:', err);
			} finally {
				await queryRunner.release();
			}
		}
		// Call the function with appropriate arguments
		// voteTransaction(1, 2, 1)
		// 	.then(() => console.log('Transaction completed successfully'))
		// 	.catch((err) => console.error('Transaction failed:', err));

		await voteTransaction(userId, postId, realValue);

		//! the user vote on the same post before
		// if (upDoot && upDoot.value !== realValue) {
		// 	const newValue = realValue;
		// } else if (!upDoot) {
		// 	await voteTransaction(userID, postID, realValue);
		// }

		return true;
	}

	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null,
	): Promise<PaginatedPosts> {
		const realLimit = Math.min(50, limit); //! take the smaller of two values
		const realLimitPlusOne = realLimit + 1;

		const replacements: any[] = [realLimitPlusOne];

		if (cursor) {
			replacements.push(new Date(parseInt(cursor)));
		}

		const posts = await AppDataSource.query(
			`
   			select p.* 
   			from post p
   			inner join public.user u on u.id = p."creatorId"
   			${cursor ? `where p."createdAt" < $2` : ""}
   			order by p."createdAt" DESC
   			limit $1
    `,
			replacements
		);

		// const qb = AppDataSource
		// 	.getRepository(Post)
		// 	.createQueryBuilder("p")
		// 	.innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
		// 	.orderBy('"createdAt"', 'DESC')
		// 	.take(realLimitPlusOne);

		// if (cursor) {
		// 	const cursorDate = new Date(parseInt(cursor));
		// 	cursorDate.setMilliseconds(0); //! Ensure no milliseconds, the date was wrong NOT the query
		// 	cursorDate.setSeconds(cursorDate.getSeconds() + 1); //! Increment by one second
		// 	console.log(cursorDate);
		// 	qb.where('"createdAt" > :cursor', { cursor: cursorDate });
		// }

		// const posts = await qb.getMany();

		let hasMore = false;
		if (posts.length === realLimitPlusOne) {
			hasMore = true;
			posts.pop();
		}

		// console.log(posts);
		return { posts: posts.slice(0, realLimit), hasMore };
	}

	@Query(() => Post, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Post | null> {
		return Post.findOne({ where: { id } });
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(@Arg('input') input: PostInput,
		@Ctx() { req }: MyContext,
	): Promise<Post> {
		console.log(req.session.userID);

		const post = Post.create({
			...input,
			creatorId: req.session.userID,
		}).save();

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
		const result = await AppDataSource
			.createQueryBuilder()
			.update(Post)
			.set({ title, text })
			.where('id = :id and "creatorId" = :creatorId', { id, creatorId: req.session.userID })
			.returning('*')
			.execute();

		console.log("result: ", result);
		return result.raw[0];
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deletePost(
		@Arg('id', () => Int) id: number,
		@Ctx() { req }: MyContext
	): Promise<boolean> {
		//not cascade way
		// 	const post = await Post.findOne({ where: { id } });
		// 	if (!post) {
		// 		return false;
		// 	}

		// 	if (post.creatorId !== req.session.userID) {
		// 		throw new Error('Not authorized');
		// 	}

		// 	try {
		// 		await Updoot.delete({ postId: id });
		// 		await Post.delete(id);
		// 		return true;
		// 	} catch (err) {
		// 		console.log(err);
		// 		return false;
		// 	}
		// }

		await Post.delete({ id, creatorId: req.session.userID });
		return true;
	}
}
