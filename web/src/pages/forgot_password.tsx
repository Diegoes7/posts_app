import React, { useState } from 'react';
import Wrapper from '../components/wrapper';
import { Form, Formik } from 'formik';
import InputField from '../components/inputField';
import { Box, Button, Text, Link, Tooltip, Flex } from '@chakra-ui/react';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { ArrowBackIcon, EmailIcon } from '@chakra-ui/icons';
import { useSmartBack } from '../utils/use_smart_back';

function ForgotPassword() {
	const [complete, setComplete] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [forgotPassword] = useForgotPasswordMutation();
	const navigateBack = useSmartBack('/');

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values, { setErrors }) => {
					const res = await forgotPassword({
						variables: {
							email: values.email,
						},
					});
					if (res.data?.forgotPassword.success) {
						setComplete(true);
						setPreviewUrl(res.data.forgotPassword.previewUrl ?? null);
					}
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Flex flexDirection='column' gap='2em'>
							<Box color='green'>
								If an account with that email exists, we sent you an email.
								Check your mailbox.
							</Box>
							<Box>
								{' '}
								{previewUrl && (
									<Box mt={4} color='#c72daf'>
										<Text>
											This functionality is demonstrated here for testing
											purposes only, allowing interaction without requiring a
											real email address
										</Text>
										<Tooltip label='Preview email in Ethereal'>
											<Link href={previewUrl} color='blue.500' isExternal>
												🔗 View Preview Email
											</Link>
										</Tooltip>
									</Box>
								)}
							</Box>
						</Flex>
					) : (
						<Form>
							<InputField
								label='Email'
								name='email'
								placeholder='email'
								type='email'
							/>
							<Box mt='10' display='flex' justifyContent='space-between'>
								<Button
									leftIcon={<ArrowBackIcon />}
									variant='outline'
									colorScheme='teal'
									onClick={navigateBack}
								>
									Back
								</Button>
								<Tooltip
									fontSize='small'
									label='Enter email address to receive the token'
								>
									<Button
										type='submit'
										isLoading={isSubmitting}
										colorScheme='teal'
										leftIcon={<EmailIcon />}
									>
										Enter Email Address
									</Button>
								</Tooltip>
							</Box>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
}

export default withApollo({ ssr: false })(ForgotPassword);
