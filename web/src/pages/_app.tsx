import { ChakraProvider, theme } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null; // Or a loading spinner, placeholder, etc.
	}

	return (
		// <ApolloProvider client={client}>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		// </ApolloProvider>
	);
}

export default MyApp;
