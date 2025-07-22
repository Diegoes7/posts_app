import { Avatar, Box, Button, Flex, Link, Tooltip } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { capitalizeFirstLetter } from '../utils/firstLetterCapitalized';
import { useApolloClient } from '@apollo/client';
import AuditLogViewer from './audit_log';
import { AddIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { Span } from 'next/dist/trace';

const Navbar = () => {
	const [imageSrc, setImageSrc] = React.useState<string>('');
	const { data, loading } = useMeQuery({
		skip: isServer(),
	});
	const [logout, { loading: logoutFetching }] = useLogoutMutation();
	const apolloClient = useApolloClient();

	async function handleLogout() {
		await logout({});
		await apolloClient.resetStore();
	}
	let body = null;
	if (loading) {
		body = null;
	} else if (!data?.me) {
		body = (
			<Flex
				display='flex'
				alignItems='center'
				flexWrap='wrap'
				flexDirection={{ base: 'column', sm: 'row' }}
				rowGap={{ base: 4, sm: 0 }}
				// columnGap={4}
			>
				<NextLink href='/login' passHref>
					<Tooltip fontSize='small' label='Login to your account'>
						<Box
							mr='4'
							fontSize={16}
							borderRadius={'.5em'}
							fontWeight={600}
							bg='#2C5282'
							color='#fff'
							_hover={{ color: '#2C5282', bg: '#fff' }}
							p={2}
						>
							{<UnlockIcon mr={2} />}
							Login
						</Box>
					</Tooltip>
				</NextLink>
				<NextLink href='/register' passHref>
					<Tooltip fontSize='small' label='Create a new account'>
						<Box
							borderRadius={'.5em'}
							fontWeight={600}
							fontSize={16}
							bg='#18a4bc'
							color='#fff'
							_hover={{ color: '#18a4bc', bg: '#fff' }}
							p={2}
						>
							{<AddIcon mr={2} />}
							Register
						</Box>
					</Tooltip>
				</NextLink>
			</Flex>
		);
	} else {
		body = (
			<Flex
				display='flex'
				alignItems='center'
				flexDirection={{ base: 'column', sm: 'row' }}
				rowGap={{ base: 4, sm: 0 }}
			>
				<NextLink href='/update_user' passHref>
					<Tooltip
						fontSize='small'
						label={capitalizeFirstLetter(data.me.username)}
					>
						<Avatar
							mr={{ base: 0, sm: 4 }}
							size='md'
							border={'2px solid #fff'}
							src={imageSrc}
							name={data.me.username}
							// title={capitalizeFirstLetter(data.me.username)}
						/>
					</Tooltip>
				</NextLink>
				{/* <Box mr='2'>{capitalizeFirstLetter(data.me.username)}</Box> */}
				<Tooltip fontSize='small' label='Exit the account'>
					<Button
						bg='#822727'
						color='#fff'
						_hover={{ color: '#822727', bg: '#fff' }}
						p={2}
						isLoading={logoutFetching}
						variant='link'
						onClick={handleLogout}
						leftIcon={<LockIcon />}
					>
						logout
					</Button>
				</Tooltip>
			</Flex>
		);
	}

	return (
		<Flex
			zIndex={1}
			position={'sticky'}
			top={0}
			bg='#FC8181'
			py='4'
			px={{ base: 4, sm: 8 }}
			alignItems='center'
			boxShadow='0 2px 8px rgba(0, 0, 0, 0.15)'
		>
			<NextLink href={'/'} title='Home' passHref>
				<Tooltip fontSize='small' label='Go to Home page' my={2}>
					{/* <Link color={'white'} my={2}> */}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						height='36px'
						viewBox='0 0 24 24'
						width='36px'
						fill='#FFFFFF'
					>
						<path d='M0 0h24v24H0V0z' fill='none' />
						<path d='M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z' />
					</svg>
					{/* </Link> */}
				</Tooltip>
			</NextLink>
			<Box ml='auto' mr='4'>
				<AuditLogViewer user={data?.me && data?.me} />
			</Box>
			<Box color={'white'} ml='auto'>
				{body}
			</Box>
		</Flex>
	);
};

export default Navbar;
