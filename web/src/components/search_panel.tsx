import {
	Box,
	Button,
	Flex,
	Input,
	Spinner,
	Stack,
	Text,
	Tooltip,
	useToast,
} from '@chakra-ui/react';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import React, { useState } from 'react';
import { Card } from './card_post';

export const PostSearchPanel = () => {
	const { data: meData } = useMeQuery();
	const userId = meData?.me?.id;
	const toast = useToast();

	const [searchTerm, setSearchTerm] = useState('');
	const [showMyPosts, setShowMyPosts] = useState(false);

	const { data, loading, error, refetch, fetchMore, variables } = usePostsQuery(
		{
			variables: {
				limit: 10,
				cursor: null,
				search: undefined,
				creatorId: undefined,
			},
			notifyOnNetworkStatusChange: true,
		}
	);

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

	const handleSearch = () => {
		refetch({
			limit: 10,
			cursor: null,
			search: searchTerm || undefined,
			creatorId: showMyPosts ? userId : undefined,
		});
	};

	const handleToggleMyPosts = () => {
		const newShowMyPosts = !showMyPosts;
		setShowMyPosts(newShowMyPosts);

		refetch({
			limit: 10,
			cursor: null,
			search: searchTerm || undefined,
			creatorId: newShowMyPosts ? userId : undefined,
		});
	};

	React.useEffect(() => {
		if (!loading && data?.posts?.posts?.length === 0) {
			toast({
				title: 'No posts found.',
				description: 'Try a different keyword or remove filters.',
				status: 'info',
				duration: 5000,
				isClosable: true,
			});
		}
	}, [data, loading, toast]);

	if (!data && !loading) {
		return (
			<Stack alignItems='center' justifyContent='center' minH='25vh'>
				<Spinner
					thickness='0.25em'
					speed='0.65s'
					emptyColor='gray.200'
					color='blue.500'
					boxSize='3em' // sets width & height
				/>
			</Stack>
		);
	}

	if (!loading && !data) {
		return (
			<div>
				<h1>You got query failed for this reason: {error?.name}</h1>
				<p>{error?.message}</p>
			</div>
		);
	}

	return (
		<Box mt={6}>
			<Flex mb={4} gap={4} flexWrap='wrap'>
				<Input
					placeholder='Search posts...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSearch();
					}}
					maxW='300px'
				/>
				<Button onClick={handleSearch} colorScheme='blue'>
					Search
				</Button>

				{!!userId && (
					<Button
						onClick={handleToggleMyPosts}
						colorScheme={showMyPosts ? 'teal' : 'gray'}
					>
						{showMyPosts ? 'Showing My Posts' : 'Show Only My Posts'}
					</Button>
				)}
			</Flex>

			<Stack spacing={6}>
				{data?.posts?.posts?.length ? (
					data.posts.posts.map((post) => (
						<Card key={post.id} post={post} variant='preview' />
					))
				) : (
					<Text>No posts found.</Text>
				)}
			</Stack>
			{data && data.posts.hasMore ? (
				<Flex justifyContent='flex-end'>
					<Tooltip fontSize='small' label='Get more posts'>
						<Button onClick={handlePagination} isLoading={loading} my='6'>
							Load more...
						</Button>
					</Tooltip>
				</Flex>
			) : null}
		</Box>
	);
};
