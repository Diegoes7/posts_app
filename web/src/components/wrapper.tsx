import { Box } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariantType = 'small' | 'regular';

type WrapperProps = {
	children: React.ReactNode;
	variant?: WrapperVariantType;
};

function Wrapper({ children, variant = 'regular' }: WrapperProps) {
	return (
		<Box
			mt='10'
			mx='auto'
			w='100%' // full width by default
			maxW={
				variant === 'regular'
					? { base: '100%', sm: '90%', md: '800px' }
					: { base: '90%', sm: '90%', md: '500px' }
			}
			p={
				variant === 'small'
					? { base: '1em', md: '1.5em' }
					: { base: '0.5em', md: '1em' }
			}
			borderRadius='.25em'
			border={variant === 'small' ? '1px solid #83b1c3' : 'none'}
			padding={variant === 'small' ? '1em' : '2em'}
		>
			{children}
		</Box>
	);
}

export default Wrapper;

