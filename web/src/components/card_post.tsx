import {
	Box,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { useMeQuery, useDeletePostMutation, User } from '../generated/graphql';
import { capitalizeFirstLetter } from '../utils/firstLetterCapitalized';
import { Vote } from './vote';
import NextLink from 'next/link';
import { ArrowForwardIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React from 'react';

type PostCardProps = {
	post: {
		createdAt: string;
		creator?: User | null;
		creatorId: number;
		id: number;
		points: number;
		text: string;
		textSnippet?: string | null;
		title: string;
		updatedAt: string;
		voteStatus?: number | null;
		popularityPts?: number | null;
	};
	variant?: 'preview' | 'full';
};

export function Card({ post, variant = 'preview' }: PostCardProps) {
	const { data } = useMeQuery();
	const userID = data?.me?.id;
	const [deletePost] = useDeletePostMutation();

	const handleDeletePost = React.useCallback(async () => {
		if (
			confirm(
				'Are you sure you want to delete this post? This cannot be undone.'
			)
		) {
			await deletePost({
				variables: { id: post.id },
				update: (cache) => {
					// Remove from cache by ID (if normalized)
					cache.evict({ id: `Post:${post.id}` });

					// Also remove it from the posts list
					cache.modify({
						fields: {
							posts(existing: any) {
								if (!existing || !existing.posts) return;
								return {
									...existing,
									posts: existing.posts.filter((p: any) => p.id !== post.id),
								};
							},
						},
					});

					cache.gc();
				},
			});
		}
	}, [post.id, deletePost]);

	return (
		<Box p={5} borderRadius={10} shadow='md' borderWidth='1px'>
			<Flex>
				<Vote post={post} />
				<Stack flex={1} w='80%'>
					{variant === 'preview' ? (
						<NextLink href='/post/[id]' as={`/post/${post.id}`} passHref>
							<Box
								fontSize='sm'
								_hover={{ textDecoration: 'underline', color: 'blue.600' }}
							>
								<Heading fontSize='xl'>
									{post.title} <ArrowForwardIcon />
								</Heading>
							</Box>
						</NextLink>
					) : (
						<Heading fontSize='xl'>{post.title}</Heading>
					)}

					<Text
						mt={4}
						{...(variant === 'preview'
							? {
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									width: '85%',
							  }
							: {})}
					>
						<span style={{ marginRight: '0.2em' }}>Content:</span>
						{variant === 'preview'
							? post.textSnippet +
							  (post.textSnippet && post.textSnippet.length < 50 ? '' : '...')
							: post.text}
					</Text>

					<Text mt={4}>
						<span style={{ marginRight: '0.2em' }}>Likes:</span> {post.points}
					</Text>

					<Text mt={4}>
						<span style={{ marginRight: '0.2em' }}>Author:</span>{' '}
						{post.creator && capitalizeFirstLetter(post.creator.username)}
					</Text>
				</Stack>

				{userID === post.creatorId && (
					<NextLink
						href='/post/edit/[id]'
						as={`/post/edit/${post.id}`}
						passHref
					>
						<Tooltip fontSize='small' label='Edit post'>
							<EditIcon
								boxSize='21'
								aria-label='Edit post'
								_hover={{
									backgroundColor: 'green',
									color: 'white',
									padding: '0.2rem',
									borderRadius: '0.3rem',
								}}
							/>
						</Tooltip>
					</NextLink>
				)}
			</Flex>

			{userID === post.creatorId && (
				<Flex justifyContent='flex-end'>
					<Tooltip fontSize='small' label='Delete'>
						<DeleteIcon
							color='#ca244c'
							boxSize='21'
							aria-label='Delete Post'
							_hover={{
								backgroundColor: '#ca244c',
								color: 'white',
								padding: '0.2rem',
								borderRadius: '0.3rem',
							}}
							onClick={handleDeletePost}
						/>
					</Tooltip>
				</Flex>
			)}
		</Box>
	);
}
