import 'reflect-metadata';
import { COOKIE_NAME, __production__ } from './constants';
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';
import cors from 'cors';
import RedisStore from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { AppDataSource } from './typeorm_config';
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';


const main = async () => {
	await AppDataSource.initialize()
		.then(() => {
			// console.log(AppDataSource.entityMetadatasMap);
		}).catch((error) => console.log(error));

	const redis = new Redis(process.env.REDIS_URL!);
	let redisStore = new RedisStore({
		client: redis,
		prefix: "myapp:",
	});

	const app: Application = express();
	const port = parseInt(process.env.PORT!) || 4000;

	const allowedOrigins = [
		process.env.CORS_ORIGIN,
		'http://localhost:3000',
		'https://studio.apollographql.com',
	];

	app.set("true proxy", 1);
	app.use(cors({
		origin: (origin, callback) => {
			// console.log(`Origin: ${origin}`);
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg = 'The CORS policy for this site does not allow access from the specified origin.';
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true
	}));


	//! Configure session middleware
	app.use(session({
		name: COOKIE_NAME,
		store: redisStore,
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET! || 'Diego',
		cookie: {
			secure: false, // Set to true if using HTTPS
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //! 10 years
			sameSite: 'lax',
			domain: __production__ ? '.kuejeriets.com' : undefined
		}
	}));


	// app.use((req, _, next) => {
	// 	console.log('Session:', req.session);
	// 	next();
	// });


	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }: MyContext) => ({
			req, res, redis,
			userLoader: createUserLoader(),
			updootLoader: createUpdootLoader()
		}),
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, cors: false } as any);

	app.get('/', (_, res) => {
		res.send('Hello');
	});

	app.listen(port, () => {
		console.log(`Server started on localhost:${port}`);
	});
};

main().catch((err) => {
	console.log(err);
});


