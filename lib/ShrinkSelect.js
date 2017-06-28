import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

export default function ShrinkSelect(props) {
	let {
		options = [],
		defaultSelect = null,
		onChange = () => {},
		bsSize = undefined,
		bsStyle = 'default'
	} = props;

	if (Array.isArray(props.options)) {
		const tmp = {};
		props.options.forEach(k => tmp[k] = k);
		options = tmp;
	}

	const title = props.value in options ?
		options[props.value] :
		(defaultSelect !== null ? options[defaultSelect] : '');

	return <DropdownButton
		title={title}
		bsStyle={bsStyle}
		bsSize={bsSize}
		id='shrink-select-dropdown'
	>
		{Object.keys(options).map(key => (
			<MenuItem key={key} onClick={() => onChange(key)}>
				{options[key]}
			</MenuItem>
		))}
	</DropdownButton>;
}
