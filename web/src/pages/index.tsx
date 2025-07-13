import {
	Post,
	// PostsQuery,
	useMeQuery,
	usePostsQuery,
} from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import {
	Flex,
	Link as ChakraLink,
	Stack,
	Heading,
	Button,
} from '@chakra-ui/react';
import React from 'react';
import { Card } from '../components/card_post';
// import AvatarUploader from '../components/avatar';
import { withApollo } from '../utils/withApollo';

const Index = () => {
	const { data: user } = useMeQuery();
	const { data, error, loading, fetchMore, variables } = usePostsQuery({
		variables: {
			limit: 10,
			cursor: null,
		},
		notifyOnNetworkStatusChange: true, // loading actually seen, this tell loading is true
	});

	const userID = user?.me?.id;

	if (!loading && !data) {
		return (
			<div>
				<h1>You got query failed for this reason: {error?.name}</h1>
				<p>{error?.message}</p>
			</div>
		);
	}

	function handlePagination() {
		if (!data) return;
		const cursor1 = data.posts.posts[data.posts.posts.length - 1].createdAt;
		const element = data.posts.posts[data.posts.posts.length - 1];
		console.log('element: ', element);
		fetchMore({
			variables: {
				limit: variables!.limit,
				cursor: cursor1,
			},
			// updateQuery: (previousValue, { fetchMoreResult }): PostsQuery => {
			// 	if (!fetchMoreResult) {
			// 		return previousValue;
			// 	}

			// 	return {
			// 		__typename: 'Query',
			// 		posts: {
			// 			__typename: 'PaginatedPosts',
			// 			hasMore: fetchMoreResult.posts.hasMore,
			// 			posts: [
			// 				...previousValue.posts.posts,
			// 				...fetchMoreResult.posts.posts,
			// 			],
			// 		},
			// 	};
			// },
		});
	}

	return (
		<Layout variant='regular'>
			{/* <AvatarUploader /> */}
			<Flex
				align='center'
				justifyContent='space-between'
				borderBottom='.2em solid black'
			>
				<Heading>Posts</Heading>
				<NextLink href='/create_post'>
					<Button as={ChakraLink} colorScheme='teal'>
						Create Post
					</Button>
				</NextLink>
			</Flex>
			<br />
			{!data && loading ? (
				<Stack>Loading...</Stack>
			) : (
				RenderPosts(data!.posts.posts, userID)
			)}
			{data && data.posts.hasMore ? (
				<Flex justifyContent='flex-end'>
					<Button onClick={handlePagination} isLoading={loading} mb='6'>
						Load more
					</Button>
				</Flex>
			) : null}
		</Layout>
	);
};

function RenderPosts(posts: Post[], userID: number | undefined) {
	return (
		<Stack mb='4'>
			<Stack spacing={8}>
				{posts
					// .filter((p) => p.creatorId === userID)
					.map((p) => (!p ? null : <Card key={p.id} {...p} />))}
			</Stack>
			{!userID && 'Have no user'}
		</Stack>
	);
}

export default withApollo({ ssr: true })(Index);
