import { Post } from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import {
	Flex,
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

	return (
		<Layout variant='regular'>
			{/* <AvatarUploader /> */}
			<Flex
				align='center'
				justifyContent='space-between'
				borderBottom='.2em solid black'
			>
				<Heading>Posts</Heading>
				<NextLink href='/create_post' passHref>
					<Tooltip fontSize='small' label='Make a new post'>
						<Button
							textDecoration={'none'}
							colorScheme='teal'
							leftIcon={<AddIcon />}
						>
							Create Post
						</Button>
					</Tooltip>
				</NextLink>
			</Flex>
			<br />
			<Stack>
				<PostSearchPanel />
				{/* <RenderPosts posts={data!.posts.posts} userID={userID} /> */}
			</Stack>
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
