import React from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/inputField';
import Layout from './Layout';
import TextareaField from './textArea';
import { Box, Button, Spinner } from '@chakra-ui/react';
import useGetPostFromUrl, { useGetIntID } from '../utils/useGetPostFromUrl';
import { useUpdatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

export default function EditPost() {
	const router = useRouter();
	const intID = useGetIntID();
	const { data, loading } = useGetPostFromUrl();
	const [updatePost] = useUpdatePostMutation();

	if (loading) {
		return <Spinner />;
	}

	if (!data?.post) {
		return (
			<Layout variant='small'>
				<Box>Could not find post</Box>
			</Layout>
		);
	}

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ title: data.post.title, text: data.post.text }}
				onSubmit={async (values) => {
					await updatePost({
						variables: {
							id: intID,
							...values,
						},
					});
					router.push('/');

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
						>
							Update Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
}
