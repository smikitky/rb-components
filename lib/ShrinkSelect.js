import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import classnames from 'classnames';
import normalizeOptions from './utils/normalizeOptions';

export default function ShrinkSelect(props) {
	const {
		defaultSelect = null,
		onChange = () => {},
		bsSize = undefined,
		bsStyle = 'default',
		block = false,
		disabled,
		className
	} = props;

	const options = normalizeOptions(props.options);

	const title = props.value in options ?
		options[props.value].caption :
		(defaultSelect !== null ? options[defaultSelect].caption : ' ');

	return <Dropdown
		id='shrink-select-dropdown'
		className={classnames('shrink-select', { 'dropdown-block': block }, className)}
		disabled={disabled}
	>
		<Dropdown.Toggle bsStyle={bsStyle} bsSize={bsSize} block={block}>
			{title}
		</Dropdown.Toggle>
		<Dropdown.Menu>
			{Object.keys(options).map(key => (
				<MenuItem key={key} onClick={() => onChange(key)}>
					{options[key].caption}
				</MenuItem>
			))}
		</Dropdown.Menu>
	</Dropdown>;
}
