import React from 'react';
import Navbar from './navbar';
import Wrapper, { WrapperVariantType } from './wrapper';

type LayoutProps = {
	variant: WrapperVariantType;
	children: React.ReactNode;
};

function Layout({ children, variant }: LayoutProps) {
	return (
		<div>
			<Navbar />
			<Wrapper variant={variant}>{children}</Wrapper>
		</div>
	);
}

export default Layout;
