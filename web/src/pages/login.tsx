import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import InputField from '../components/inputField';
import Wrapper from '../components/wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';
// import { useIsAuth } from '../utils/useIsAuth';

function Login() {
	const router = useRouter();
	const [login] = useLoginMutation();

	return (
		<Wrapper variant='small'>
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
							<NextLink href='/forgot_password'>
								<Link>forgot password?</Link>
							</NextLink>
						</Flex>
						<Button
							mt='10'
							type='submit'
							isLoading={isSubmitting}
							colorScheme='teal'
							sx={{ alignSelf: 'flex-end' }}
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
}

export default withApollo({ ssr: false })(Login);

//! Automatically make a file a Route,
//* whatever is the name of the file its a route
