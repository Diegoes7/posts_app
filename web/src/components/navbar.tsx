import { Avatar, Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { capitalizeFirstLetter } from '../utils/firstLetterCapitalized';
import { useApolloClient } from '@apollo/client';

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
			<Flex display='flex' alignItems='center'>
				<NextLink href='/login' passHref>
					<Link mr='4' fontSize={20}>
						Login
					</Link>
				</NextLink>
				<NextLink href='/register' passHref>
					<Link fontSize={20}>
						Register
					</Link>
				</NextLink>
			</Flex>
		);
	} else {
		body = (
			<Flex display='flex' alignItems='center'>
				<Avatar mr={2} size='sm' src={imageSrc} />
				<Box mr='2'>{capitalizeFirstLetter(data.me.username)}</Box>
				<Button
					isLoading={logoutFetching}
					variant='link'
					color={'black'}
					onClick={handleLogout}
				>
					logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex zIndex={1} position={'sticky'} top={0} bg='#FC8181' py='4' px='8'>
			<NextLink href={'/'} title='Home' passHref>
				<Link color={'white'}>
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
				</Link>
			</NextLink>
			<Box color={'white'} ml='auto'>
				{body}
			</Box>
		</Flex>
	);
};

export default Navbar;
