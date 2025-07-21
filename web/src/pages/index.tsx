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
	Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { Card } from '../components/card_post';
// import AvatarUploader from '../components/avatar';
import { withApollo } from '../utils/withApollo';
import { AddIcon } from '@chakra-ui/icons';
import { PostSearchPanel } from '../components/search_panel';

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
					<Tooltip fontSize='small' label='Make a new post'>
						<Button as={ChakraLink} colorScheme='teal' leftIcon={<AddIcon />}>
							Create Post
						</Button>
					</Tooltip>
				</NextLink>
			</Flex>
			<br />
			{!data && loading ? (
				<Stack>Loading...</Stack>
			) : (
				<Stack>
					<PostSearchPanel />
					{/* <RenderPosts posts={data!.posts.posts} userID={userID} /> */}
				</Stack>
			)}
			{data && data.posts.hasMore ? (
				<Flex justifyContent='flex-end'>
					<Tooltip fontSize='small' label='Get more posts'>
						<Button onClick={handlePagination} isLoading={loading} mb='6'>
							Load more...
						</Button>
					</Tooltip>
				</Flex>
			) : null}
		</Layout>
	);
};


//* Old way to show posts, new way is through the search panel component
type RenderPostsProps = {
	posts: Post[];
	userID: number | undefined;
};

function RenderPosts({ posts, userID }: RenderPostsProps) {
	return (
		<Stack mb='4'>
			<Stack spacing={8}>
				{posts
					// .filter((p) => p.creatorId === userID) //! can make button to show only you posts ot search by string
					.map((p) =>
						!p ? null : <Card key={p.id} post={p} variant='preview' />
					)}
			</Stack>
			{!userID && 'Have no user'}
		</Stack>
	);
}

export default withApollo({ ssr: true })(Index);
