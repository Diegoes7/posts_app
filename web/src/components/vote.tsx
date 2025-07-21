import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';
import {
	PostFragment,
	useVoteMutation,
	VoteMutation,
} from '../generated/graphql';
import { ApolloCache, gql } from '@apollo/client';

type VoteProps = {
	post: PostFragment;
};

const updateAfterVote = (
	value: number,
	postId: number,
	cache: ApolloCache<VoteMutation>
) => {
	const data = cache.readFragment<{
		id: number;
		points: number;
		voteStatus: number | null;
	}>({
		id: 'Post:' + postId,
		fragment: gql`
			fragment _ on Post {
				id
				points
				voteStatus
			}
		`,
	});

	if (!data) return;

	let newPoints = data.points;
	let newVoteStatus = data.voteStatus;

	if (data.voteStatus === value) {
		// Undo vote
		newPoints -= value;
		newVoteStatus = null;
	} else if (data.voteStatus === null) {
		// New vote
		newPoints += value;
		newVoteStatus = value;
	} else {
		// Switching vote
		newPoints += 2 * value;
		newVoteStatus = value;
	}

	cache.writeFragment({
		id: 'Post:' + postId,
		fragment: gql`
			fragment __ on Post {
				points
				voteStatus
			}
		`,
		data: {
			points: newPoints,
			voteStatus: newVoteStatus,
		},
	});
};

export function Vote({ post }: VoteProps) {
	const [loadingState, setLoadingState] = React.useState<
		'upvote-loading' | 'downvote-loading' | 'not-loading'
	>('not-loading');

	const [vote] = useVoteMutation();

	const handleVote = async (value: 1 | -1) => {
		const voteType = value === 1 ? 'upvote-loading' : 'downvote-loading';
		setLoadingState(voteType);
		try {
			await vote({
				variables: {
					postID: post.id,
					value,
				},
				update: (cache) => updateAfterVote(value, post.id, cache),
			});
		} catch (error) {
			console.error('Vote error:', error);
		}
		setLoadingState('not-loading');
	};

	return (
		<Flex direction='column' alignItems='center' mr={7}>
			{loadingState === 'upvote-loading' ? (
				<Spinner size='sm' />
			) : (
				<TriangleUpIcon
					aria-label='upvote post'
					onClick={() => handleVote(1)}
					boxSize={5}
					cursor='pointer'
					color={post.voteStatus === 1 ? 'green.400' : 'gray.400'}
					_hover={{
						backgroundColor: 'green.100',
						borderRadius: 'full',
					}}
				/>
			)}
			<strong>{post.points}</strong>
			{loadingState === 'downvote-loading' ? (
				<Spinner size='sm' />
			) : (
				<TriangleDownIcon
					aria-label='downvote post'
					onClick={() => handleVote(-1)}
					boxSize={5}
					cursor='pointer'
					color={post.voteStatus === -1 ? 'red.400' : 'gray.400'}
					_hover={{
						backgroundColor: 'red.100',
						borderRadius: 'full',
					}}
				/>
			)}
		</Flex>
	);
}
