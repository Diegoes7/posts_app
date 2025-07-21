import React from 'react';
import Layout from '../../components/Layout';
import { Box, Spinner } from '@chakra-ui/react';
import useGetPostFromUrl from '../../utils/useGetPostFromUrl';
import { Card } from '../../components/card_post';
import { withApollo } from '../../utils/withApollo';

function Post() {
	const { data, loading, error } = useGetPostFromUrl();

	console.log(data?.post);

	if (error) {
		return <Layout variant='small'>{error.message}</Layout>;
	}

	if (!data?.post) {
		return (
			<Layout variant='small'>
				<Box>Could not find post</Box>
			</Layout>
		);
	}

	if (loading) {
		return (
			<Layout variant='small'>
				<Spinner />
			</Layout>
		);
	}

	return (
		<Layout variant='regular'>
			<Card post={data.post} variant='full' />
		</Layout>
	);
}

export default withApollo({ ssr: true })(Post);
