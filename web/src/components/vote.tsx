import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';
import {
	Post,
	PostFragment,
	useVoteMutation,
	VoteMutation,
} from '../generated/graphql';
import { ApolloCache, gql } from '@apollo/client';

type VoteProps = {
	// point: number;
	// post: PostsQuery['posts']['posts'][0]
	post: PostFragment;
};

const hoverIcon = (nev: boolean) => {
	return {
		color: 'white',
		backgroundColor: nev ? 'green' : 'red',
		borderRadius: '2rem',
		padding: '0.2rem',
	};
};

const updateAfterVote = (
	value: number,
	postId: number,
	cache: ApolloCache<VoteMutation>
) => {
	const data = cache.readFragment<Post>({
		id: 'Post:' + postId,
		fragment: gql`
			fragment _ on Post {
				id
				points
				voteStatus
			}
		`,
	});
	console.log('data: ', data?.points);

	if (data) {
		if (data.voteStatus === value) {
			return;
		}

		const newPoints =
			(data.points as number) + (!data.voteStatus ? 1 : 2) * value;
		cache.writeFragment({
			id: 'Post:' + postId,
			fragment: gql`
				fragment __ on Post {
					points
					voteStatus
				}
			`,
			data: { points: newPoints, voteStatus: value },
		});
	}
};

export function Vote({ post }: VoteProps) {
	const [loadingState, setLoadingState] = React.useState<
		'updoot-loading' | 'downdoot-loading' | 'not-loading'
	>('not-loading');
	const [vote] = useVoteMutation();

	const upVote = React.useCallback(async () => {
		setLoadingState('updoot-loading');
		await vote({
			variables: {
				postID: post.id,
				value: 1,
			},
			update: (cache) => updateAfterVote(1, post.id, cache),
		}),
			setLoadingState('not-loading');
	}, [vote]);

	const downVote = React.useCallback(async () => {
		setLoadingState('downdoot-loading');
		await vote({
			variables: {
				postID: post.id,
				value: -1,
			},
			update: (cache) => updateAfterVote(-1, post.id, cache),
		});
		setLoadingState('not-loading');
	}, [vote]);

	return (
		<Flex direction='column' justifyContent='center' alignItems='center' mr={7}>
			{loadingState === 'updoot-loading' ? (
				<Spinner size='sm' />
			) : (
				<TriangleUpIcon
					_hover={hoverIcon(true)}
					area-label='updoot post'
					onClick={upVote}
					boxSize={5}
					color='green'
					// _disabled={post.voteStatus === 1 ? 'true' : ''}
					// bgColor='green'
				/>
			)}
			{post.points}
			{loadingState === 'downdoot-loading' ? (
				<Spinner size='sm' />
			) : (
				<TriangleDownIcon
					_hover={hoverIcon(false)}
					area-label='downdoot post'
					onClick={downVote}
					boxSize={5}
					color='red'
					// _disabled={post.voteStatus === -1 ? 'true' : ''}
				/>
			)}
		</Flex>
	);
}
