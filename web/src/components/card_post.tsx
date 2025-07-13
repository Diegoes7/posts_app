import {
	Box,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { useDeletePostMutation, useMeQuery, User } from '../generated/graphql';
import { capitalizeFirstLetter } from '../utils/firstLetterCapitalized';
import { Vote } from './vote';
import NextLink from 'next/link';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React from 'react';

type CardModel = {
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
};

export function Card(post: CardModel) {
	const { data } = useMeQuery();
	const userID = data?.me?.id;
	const [deletePost] = useDeletePostMutation();

	const deletePost1 = React.useCallback(async () => {
		//! need to show some dialog to pop up
		await deletePost({
			variables: {
				id: post.id,
			},
			update: (cache) => {
				cache.evict({ id: 'Post:' + post.id });
			},
		});
	}, [post]);

	return (
		<Box key={post.id} p={5} borderRadius={10} shadow='md' borderWidth='1px'>
			<Flex>
				<Vote post={post} />
				<Stack flex={1} w='100%'>
					<NextLink href='/post/[id]' as={`/post/${post.id}`}>
						<Link>
							<Heading fontSize='xl'>{post.title}</Heading>
						</Link>
					</NextLink>
					<Text
						mt={4}
						style={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							width: '85%',
						}}
					>
						<span
							style={{
								marginRight: '0.2em',
							}}
						>
							Content:{' '}
						</span>
						{post.textSnippet}
						{post.textSnippet && post.textSnippet?.length < 50 ? '' : '...'}
					</Text>
					<Text mt={4}>
						<span style={{ marginRight: '0.2em' }}>Likes: </span>
						{post.points}
					</Text>
					<Text mt={4}>
						<span style={{ marginRight: '0.2em' }}>Author: </span>
						{post.creator && capitalizeFirstLetter(post.creator?.username)}
					</Text>
				</Stack>
				{userID !== post.creatorId ? null : (
					<NextLink href='/post/edit/[id]' as={`/post/edit/${post.id}`}>
						<Tooltip fontSize='small' label='Edit post'>
							<EditIcon
								boxSize={'21'}
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
			{userID !== post.creatorId ? null : (
				<Flex justifyContent={'flex-end'}>
					<Tooltip fontSize='small' label='Delete'>
						<DeleteIcon
							color={'#ca244c'}
							boxSize={'21'}
							aria-label='Delete Post'
							_hover={{
								backgroundColor: '#ca244c',
								color: 'white',
								padding: '0.2rem',
								borderRadius: '0.3rem',
							}}
							onClick={deletePost1}
						/>
					</Tooltip>
				</Flex>
			)}
		</Box>
	);
}
