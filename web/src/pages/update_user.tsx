import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Divider, Heading, Spinner, Text } from '@chakra-ui/react';
import InputField from '../components/inputField';
import Wrapper from '../components/wrapper';
import {
	MeDocument,
	MeQuery,
	useDeleteUserMutation,
	useMeQuery,
	useUpdateUserMutation,
} from '../generated/graphql';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Layout from '../components/Layout';
import { useApolloClient } from '@apollo/client';

const UpdateUser = () => {
	const router = useRouter();
	const client = useApolloClient();
	const { data, loading, error } = useMeQuery();

	const [updateUser, { loading: updating }] = useUpdateUserMutation();
	const [deleteUser] = useDeleteUserMutation();

	const handleDelete = React.useCallback(async () => {
		if (
			confirm(
				'Are you sure you want to delete your account? This cannot be undone.'
			)
		) {
			try {
				const response = await deleteUser();
				if (response.data?.deleteUser) {
					// Clear Apollo Client cache to remove all user-related data
					await client.clearStore();
					// Redirect to home or login page
					router.push('/');
				}
			} catch (error) {
				console.error('Account deletion failed:', error);
			}
		}
	}, [deleteUser, client, router]);

	React.useEffect(() => {
		if (!loading && !data?.me) {
			router.replace('/'); 
		}
	}, [loading, data, router]);

	if (loading) {
		return (
			<Wrapper variant='small'>
				<Spinner />
			</Wrapper>
		);
	}

	if (error || !data?.me) {
		return (
			<Wrapper variant='small'>
				<Text color='red.500'>Failed to load user data. Please try again.</Text>
			</Wrapper>
		);
	}

	const updatedAtStr = data.me.updatedAt;
	let formattedUpdatedAt = '';

	if (updatedAtStr) {
		const timestamp = Number(updatedAtStr);
		const dateObj = new Date(timestamp);

		if (!isNaN(dateObj.getTime())) {
			formattedUpdatedAt = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
		}
	}

	return (
		<Layout variant='small'>
			<Box mb={6}>
				<Heading size='lg'>Update User</Heading>
				<Divider borderColor='gray.600' />
			</Box>
			<Formik
				initialValues={{
					username: data.me.username,
					email: data.me.email,
					updatedAt: formattedUpdatedAt || '',
					ratingPts: data.me.ratingPts,
				}}
				onSubmit={async (values, { setErrors }) => {
					try {
						const response = await updateUser({
							variables: {
								data: {
									username: values.username,
									email: values.email,
									ratingPts: values.ratingPts,
									// updatedAt should NOT be sent to mutation because it's read-only server-side
								},
							},
							update: (cache, { data }) => {
								if (data?.updateUser) {
									cache.writeQuery<MeQuery>({
										query: MeDocument,
										data: {
											__typename: 'Query',
											me: data.updateUser as any, // update cache with new user data
										},
									});
								}
							},
						});

						if (!response.data?.updateUser) {
							setErrors({ username: 'Update failed' }); // basic error feedback
						} else {
							router.push('/'); // redirect to home or profile page on success
						}
					} catch (err) {
						setErrors({ username: 'Server error occurred' }); // or parse detailed errors
					}
				}}
			>
				{({ isSubmitting, handleChange, values }) => (
					<Form style={{ display: 'flex', flexDirection: 'column' }}>
						<InputField
							label='Username'
							name='username'
							placeholder='Username'
							value={values.username}
							onChange={handleChange}
						/>
						<Box mt={8}>
							<InputField
								label='Email'
								name='email'
								placeholder='Email'
								type='email'
								value={values.email}
								onChange={handleChange}
							/>
						</Box>
						<Box mt={8}>
							<InputField
								label='Last Updated'
								name='updatedAt'
								placeholder='Last Updated'
								type='text'
								value={values.updatedAt}
								// isReadOnly
							/>
						</Box>
						<Box mt={8}>
							<InputField
								label='Rating Points'
								name='updatedAt'
								placeholder='Last Updated'
								type='text'
								value={values.ratingPts + ''}
								// readOnly
								disabled
							/>
						</Box>
						<Button
							mt={10}
							type='submit'
							isLoading={isSubmitting || updating}
							colorScheme='teal'
							sx={{ alignSelf: 'flex-end' }}
							leftIcon={<EditIcon />}
						>
							Update
						</Button>
					</Form>
				)}
			</Formik>
			<Button
				mt={6}
				colorScheme='red'
				bg='red.700'
				_hover={{ bg: 'red.800' }}
				_active={{ bg: 'red.900' }}
				color='white'
				variant='solid'
				onClick={handleDelete}
				leftIcon={<DeleteIcon />}
			>
				Delete Account
			</Button>
		</Layout>
	);
};

export default withApollo({ ssr: false })(UpdateUser);

//! need to add header for every page crete use, post & etc.
