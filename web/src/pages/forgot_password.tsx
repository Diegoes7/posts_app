import React, { useState } from 'react';
import Wrapper from '../components/wrapper';
import { Form, Formik } from 'formik';
import InputField from '../components/inputField';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
// import NextLink from 'next/link';
// import { withUrqlClient } from 'next-urql';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

function ForgotPassword() {
	const [complete, setComplete] = useState(false);
	const [forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values, { setErrors }) => {
					await forgotPassword({
						variables: {
							email: values.email,
						},
					});
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box color='green'>
							If an account with that email exists, we send you a email. Check
							your mailbox.
						</Box>
					) : (
						<Form>
							<InputField
								label='Email'
								name='email'
								placeholder='email'
								type='email'
							/>
							<Button
								mt='4'
								type='submit'
								isLoading={isSubmitting}
								colorScheme='teal'
							>
								Enter Email Address
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
}

export default withApollo({ ssr: false })(ForgotPassword);
