import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = {
	label: string;
	placeholder: string;
	name: string;
} & InputHTMLAttributes<HTMLInputElement>;

function InputField({ label, size: _, ...props }: InputFieldProps) {
	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Input
				{...field}
				{...props}
				id={field.name}
				placeholder={props.placeholder}
			/>
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	);
}

export default InputField;
