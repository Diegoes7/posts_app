import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../../components/wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import InputField from '../../components/inputField';
import { Box, Button, Flex, Link, Tooltip } from '@chakra-ui/react';
import {
	MeDocument,
	MeQuery,
	useChangePasswordMutation,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../../utils/withApollo';
import { EditIcon } from '@chakra-ui/icons';

const ChangePassword = () => {
	const router = useRouter();
	console.log(router.query);
	const [changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState('');
	const token =
		typeof router.query.token === 'string' ? router.query.token : '';

	return (
		<div>
			<Wrapper variant='small'>
				<Formik
					initialValues={{ newPassword: '' }}
					onSubmit={async (values, { setErrors }) => {
						const response = await changePassword({
							variables: {
								newPassword: values.newPassword,
								token,
							},
							update: (cache, { data }) => {
								cache.writeQuery<MeQuery>({
									query: MeDocument,
									data: {
										__typename: 'Query',
										me: data?.changePassword.user,
									},
								});
								cache.evict({ fieldName: 'post:{}' });
							},
						});
						if (response.data?.changePassword.errors) {
							const errorMap = toErrorMap(response.data.changePassword.errors);
							if ('token' in errorMap) {
								setTokenError(errorMap.token);
							}
							setErrors(errorMap);
						} else if (response.data?.changePassword.user) {
							//! worked, redirect to home route
							router.push('/');
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								label='New Password'
								name='newPassword'
								placeholder='new password'
								type='password'
							/>
							{tokenError && (
								<Flex>
									<Box mr='2' color='red'>
										{tokenError}
									</Box>
									<NextLink href='/forgot_password' passHref>
										<Link> Go get a new token</Link>
									</NextLink>
								</Flex>
							)}
							<Tooltip fontSize='small' label='Type your new password'>
								<Button
									mt='4'
									type='submit'
									isLoading={isSubmitting}
									colorScheme='teal'
									leftIcon={<EditIcon />}
								>
									Change Password
								</Button>
							</Tooltip>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</div>
	);
};

export default withApollo({ ssr: false })(ChangePassword);
