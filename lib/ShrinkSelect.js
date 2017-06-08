import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export default function ShrinkSelect(props) {
	let { options = [], defaultSelect = null, onChange = () => {} } = props;

	if (Array.isArray(props.options)) {
		const tmp = {};
		props.options.forEach(k => tmp[k] = k);
		options = tmp;
	}

	const title = props.value in options ?
		options[props.value] :
		(defaultSelect !== null ? options[defaultSelect] : '');

	const style = props.bsStyle ? props.bsStyle : 'default';
	const size = 'size' in props ? props.size : null;

	return <DropdownButton title={title} bsStyle={style} bsSize={size} id='shrink-select-dropdown'>
		{Object.keys(options).map(key => (
			<MenuItem key={key} onClick={() => onChange(key)}>
				{options[key]}
			</MenuItem>
		))}
	</DropdownButton>;
}
