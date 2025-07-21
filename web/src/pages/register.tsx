import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Divider, Heading } from '@chakra-ui/react';
import InputField from '../components/inputField';
import Wrapper from '../components/wrapper';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';

function Register() {
	const router = useRouter();
	const [register] = useRegisterMutation();
	return (
			<Wrapper variant='small'>
				<Box mb={6}>
					<Heading size='lg'>Create Account</Heading>
					<Divider borderColor='gray.600' />
				</Box>
				<Formik
					initialValues={{ email: '', username: '', password: '' }}
					onSubmit={async (values, { setErrors }) => {
						const response = await register({
							variables: {
								options: values,
							},
							update: (cache, { data }) => {
								cache.writeQuery<MeQuery>({
									query: MeDocument,
									data: {
										__typename: 'Query',
										me: data?.register.user,
									},
								});
							},
						});
						if (response.data?.register.errors) {
							setErrors(toErrorMap(response.data.register.errors));
						} else if (response.data?.register.user) {
							//! worked, redirect to home route
							router.push('/');
						}
					}}
				>
					{({ handleChange, isSubmitting }) => (
						<Form style={{ display: 'flex', flexDirection: 'column' }}>
							<InputField
								label='Username'
								name='username'
								placeholder='username'
							/>
							<Box mt='8'>
								<InputField
									label='Email'
									name='email'
									placeholder='email'
									type='email'
								/>
							</Box>
							<Box mt='8'>
								<InputField
									label='Password'
									name='password'
									placeholder='password'
									type='password'
								/>
							</Box>
							<Box mt='10' display='flex' justifyContent='space-between'>
								<Button
									leftIcon={<ArrowBackIcon />}
									variant='outline'
									colorScheme='teal'
									onClick={() => router.push('/')}
								>
									Back to Home
								</Button>
								<Button
									type='submit'
									isLoading={isSubmitting}
									colorScheme='teal'
									sx={{ alignSelf: 'flex-end' }}
									leftIcon={<AddIcon />}
								>
									Register
								</Button>
							</Box>
						</Form>
					)}
				</Formik>
			</Wrapper>
	);
}

export default withApollo({ ssr: false })(Register);

//! Automatically make a file a Route,
//* whatever is the name of the file its a route
