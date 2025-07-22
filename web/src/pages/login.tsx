import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Divider, Flex, Heading, Link } from '@chakra-ui/react';
import InputField from '../components/inputField';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';
import { ArrowBackIcon, UnlockIcon } from '@chakra-ui/icons';
import Wrapper from '../components/wrapper';
import { useSmartBack } from '../utils/use_smart_back';

function Login() {
	const router = useRouter();
	const [login] = useLoginMutation();
 const navigateBack = useSmartBack('/');

	return (
		<Wrapper variant='small'>
			<Box mb={6}>
				<Heading size='lg'>Log into Account</Heading>
				<Divider borderColor='gray.600' />
			</Box>
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					// const response = await login(variables: { usernameOrEmail: values.usernameOrEmail, password: values.password });
					const response = await login({
						variables: values,
						update: (cache, { data }) => {
							cache.writeQuery<MeQuery>({
								query: MeDocument,
								data: {
									__typename: 'Query',
									me: data?.login.user,
								},
							});
							cache.evict({ fieldName: 'post:{}' });
						},
					});
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						if (typeof router.query.next === 'string') {
							router.push(router.query.next);
						} else {
							router.push('/');
						}
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form style={{ display: 'flex', flexDirection: 'column' }}>
						<InputField
							label='Username or Email'
							name='usernameOrEmail'
							placeholder='username or email'
						/>
						<Box mt='8'>
							<InputField
								label='Password'
								name='password'
								placeholder='password'
								type='password'
							/>
						</Box>
						<Flex mt='6' justifyContent='flex-end'>
							<NextLink href='/forgot_password' passHref>
								<Box
									fontSize='sm'
									color='blue.500'
									_hover={{ textDecoration: 'underline', color: 'blue.600' }}
								>
									Forgot password?
								</Box>
							</NextLink>
						</Flex>
						<Box mt='10' display='flex' justifyContent='space-between'>
							<Button
								leftIcon={<ArrowBackIcon />}
								variant='outline'
								colorScheme='teal'
								onClick={navigateBack}
							>
								Back
							</Button>
							<Button
								type='submit'
								isLoading={isSubmitting}
								colorScheme='teal'
								sx={{ alignSelf: 'flex-end' }}
								leftIcon={<UnlockIcon />}
							>
								Login
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
}

export default withApollo({ ssr: false })(Login);

//! Automatically make a file a Route,
//* whatever is the name of the file its a route
