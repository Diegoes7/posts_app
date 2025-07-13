//! this is ths author setup
import { fetchExchange } from '@urql/core';
import customCacheExchange from './user_update';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';
import { isServer } from './isServer';

const errorExchange: Exchange =
	({ forward }) =>
	(opt$) => {
		return pipe(
			forward(opt$),
			tap(({ error }) => {
				if (error?.message.includes('Not authenticated')) {
					Router.replace('/login');
				}
			})
		);
	};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = '';
	if (isServer()) {
		cookie = ctx?.req?.headers?.cookie || '';
	}
	return {
		url: process.env.NEXT_PUBLIC_API_URL as string,
		fetchOptions: {
			credentials: 'include' as const,
		},
		headers: cookie
			? {
					cookie,
			  }
			: undefined,
		exchanges: [customCacheExchange, errorExchange, ssrExchange, fetchExchange],
	};
};

//$ new setup in urql
// import { cacheExchange, createClient, fetchExchange } from '@urql/core';

// const createUrqlClient = (ssr: any) => {
// 	return createClient({
// 		url: 'http://localhost:4000/graphql',
// 		fetchOptions: {
// 			credentials: 'include',
// 		},
// 		exchanges: [customCacheExchange, ssr, fetchExchange],
// 	});
// };

// export default createUrqlClient;

//! server side rendering is needed only for dynamic data

// import {
// 	UrqlProvider,
// 	createClient,
// 	fetchExchange,
// 	ssrExchange,
// } from '@urql/next';
// import { useMemo } from 'react';
// import customCacheExchange from './user_update';
// import Index from '../pages';

// export default function CreateUrqlClient() {
// 	const [client, ssr] = useMemo(() => {
// 		const ssr = ssrExchange({
// 			isClient: typeof window !== 'undefined',
// 		});

// 		const client = createClient({
// 			url: 'http://localhost:4000/graphql',
// 			fetchOptions: {
// 				credentials: 'include',
// 			},
// 			exchanges: [customCacheExchange, fetchExchange],
// 		});

// 		return [client, ssr];
// 	}, []);

// 	return (
// 		<UrqlProvider client={client} ssr={ssr}>
// 			<Index />
//? may be here need to pass the component MyApp, need to test if i am right
//? will try it later
// 		</UrqlProvider>
// 	);
//}
