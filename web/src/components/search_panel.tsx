import {
	Box,
	Button,
	Flex,
	Input,
	Spinner,
	Stack,
	Text,
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

	const { data, loading, refetch } = usePostsQuery({
		variables: {
			limit: 20,
			cursor: null,
			search: undefined,
			creatorId: undefined,
		},
		notifyOnNetworkStatusChange: true,
	});

	const handleSearch = () => {
		refetch({
			limit: 20,
			cursor: null,
			search: searchTerm || undefined,
			creatorId: showMyPosts ? userId : undefined,
		});
	};

	const handleToggleMyPosts = () => {
		const newShowMyPosts = !showMyPosts;
		setShowMyPosts(newShowMyPosts);

		refetch({
			limit: 20,
			cursor: null,
			search: searchTerm || undefined,
			creatorId: newShowMyPosts ? userId : undefined,
		});
	};

	if (!data && loading) return <Spinner />;

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
		</Box>
	);
};
