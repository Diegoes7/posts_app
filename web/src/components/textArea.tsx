import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Textarea,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { TextareaHTMLAttributes } from 'react';

type TextareaFieldProps = {
	label: string;
	placeholder: string;
	name: string;
	cols?: number;
	rows?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextareaField({
	cols = 10,
	rows = 7,
	label,
	...props
}: TextareaFieldProps) {
	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Textarea
				cols={cols}
        rows={rows}
				{...field}
				{...props}
				id={field.name}
				placeholder={props.placeholder}
			/>
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	);
}

export default TextareaField;
