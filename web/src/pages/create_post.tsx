import React from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/inputField';
import { Box, Button } from '@chakra-ui/react';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import TextareaField from '../components/textArea';
import { withApollo } from '../utils/withApollo';
import { AddIcon } from '@chakra-ui/icons';

function CreatePost() {
	const router = useRouter();
	const [createPost] = useCreatePostMutation();

	useIsAuth();

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ title: '', text: '' }}
				onSubmit={async (values) => {
					const response = await createPost({
						variables: { input: values },
						update: (cache, { data }) => {
							if (!data?.createPost) return;

							cache.modify({
								fields: {
									posts(existing) {
										if (!existing || !existing.posts) return;

										return {
											...existing,
											posts: [data.createPost, ...existing.posts],
										};
									},
								},
							});
						},
					});
					if (!response.errors) {
						router.push('/');
					}
					console.log(values);
				}}
			>
				{({ isSubmitting }) => (
					<Form style={{ display: 'flex', flexDirection: 'column' }}>
						<InputField label='Title' name='title' placeholder='Title' />
						<Box mt='8'>
							<TextareaField
								label='Content'
								name='text'
								placeholder='text...'
							/>
						</Box>
						<Button
							mt='10'
							type='submit'
							isLoading={isSubmitting}
							colorScheme='teal'
							sx={{ alignSelf: 'flex-end' }}
							leftIcon={<AddIcon />}
						>
							Create Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
}

export default withApollo({ ssr: false })(CreatePost);
