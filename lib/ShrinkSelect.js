import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import classnames from 'classnames';

export default function ShrinkSelect(props) {
	let {
		options = [],
		defaultSelect = null,
		onChange = () => {},
		bsSize = undefined,
		bsStyle = 'default',
		block = false,
		className
	} = props;

	if (Array.isArray(props.options)) {
		const tmp = {};
		props.options.forEach(k => tmp[k] = k);
		options = tmp;
	}

	const title = props.value in options ?
		options[props.value] :
		(defaultSelect !== null ? options[defaultSelect] : '');

	return <Dropdown
		id='shrink-select-dropdown'
		className={classnames('shrink-select', { 'dropdown-block': block }, className)}
	>
		<Dropdown.Toggle bsStyle={bsStyle} bsSize={bsSize} block={block}>
			{title}
		</Dropdown.Toggle>
		<Dropdown.Menu>
			{Object.keys(options).map(key => (
				<MenuItem key={key} onClick={() => onChange(key)}>
					{options[key]}
				</MenuItem>
			))}
		</Dropdown.Menu>
	</Dropdown>;
}
