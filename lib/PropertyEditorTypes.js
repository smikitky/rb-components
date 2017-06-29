import React from 'react';

import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';

const formControl = (options, filter = v => v) => {
	return ({ onChange, value }) => <FormControl
		{...options}
		value={value}
		onChange={ev => onChange(filter(ev.target.value))}
	/>;
};

export const text = options => formControl({ ...options, type: 'text' });

export const password = options => formControl({ ...options, type: 'password' });

export const number = options => formControl({ ...options, type: 'number' }, parseFloat);

export const textarea = options => formControl({ ...options, componentClass: 'textarea' });

export const checkbox = options => {
	return ({ onChange, value }) => <span>
		<Checkbox
			checked={!!value}
			onChange={ev => onChange(ev.target.checked)}
		>
			{ options.label }
		</Checkbox>
	</span>;
};
