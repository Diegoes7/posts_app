import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';

export default class Document extends NextDocument {
	render() {
		return (
			<Html>
				<Head>
					<link
						rel='icon'
						href='/icons/icons8-article-48.png'
						type='image/png'
					/>
					<link
						rel='apple-touch-icon'
						sizes='180x180'
						href='/apple-touch-icon.png'
					/>
					<link rel='shortcut icon' href='/icons/icons8-article-48.png' />
				</Head>
				<body>
					{/* Make Color mode to persists when you refresh the page. */}
					<ColorModeScript />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
