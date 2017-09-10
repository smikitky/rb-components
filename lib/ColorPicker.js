import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import tinycolor from 'tinycolor2';
import classnames from 'classnames';

// Colors based on simple-color-picker released under the MIT License
// Copyright (c) 2010 Rachel Carvalho <rachel.carvalho@gmail.com>
const defaultColors = [
	'#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff',
	'#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
	'#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
	'#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd',
	'#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0',
	'#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79',
	'#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47',
	'#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4C1130'
];

const ColorPicker = props => {
	const {
		value,
		colors,
		showColorCode,
		bsSize = undefined,
		noCaret = false,
		onChange = () => {},
		bsStyle = 'default',
		block = false,
		boxPreview = false,
		className,
		disabled
	} = props;

	const tc = tinycolor(props.value || '#ffffff');
	const style = {
		backgroundColor: tc.toHexString(),
		color: tinycolor.mostReadable(tc, ['#000', '#fff']).toHexString()
	};
	const classNames = classnames(
		'color-picker',
		{
			'color-picker-with-color-code': showColorCode,
			'dropdown-block': block
		},
		className
	);

	return <Dropdown
		id='color-picker-dropdown'
		className={classNames}
		disabled={disabled}
	>
		<Dropdown.Toggle
			className='color-picker-toggle'
			style={boxPreview ? {} : style}
			bsSize={bsSize}
			bsStyle={bsStyle}
			block={block}
			noCaret={noCaret}
		>
			<span>
				{ boxPreview && <div className='color-picker-box-preview' style={style} /> }
				{ showColorCode ? tc.toHexString() : <span>&thinsp;</span> }
			</span>
		</Dropdown.Toggle>
		<Dropdown.Menu>
			<li role='presentation'>
				<ColorPalette
					colors={colors}
					value={value}
					onChange={onChange}
					itemTabIndex={-1}
				/>
			</li>
		</Dropdown.Menu>
	</Dropdown>;
};

ColorPicker.defaultProps = {
	colors: defaultColors
};

ColorPicker.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string),
	value: PropTypes.string,
	onChange: PropTypes.func
};

export default ColorPicker;

export const ColorPalette = props => {
	const {
		colors,
		value,
		onChange,
		itemTabIndex = 0
	} = props;

	function handleKeyDown(ev, color) {
		if (ev.keyCode === 13 || ev.keyCode === 32) { // Enter or Space
			onChange(color);
			ev.preventDefault();
		}
	}

	return <div className='color-picker-palette'>
		{colors.map((color, i) => (
			<div
				tabIndex={itemTabIndex}
				className={classnames('color-picker-palette-color', { selected: color === value })}
				style={{ backgroundColor: color }}
				onClick={() => onChange(color)}
				onKeyDown={ev => handleKeyDown(ev, color)}
				key={i}
			/>
		))}
	</div>;
};

ColorPalette.defaultProps = {
	colors: defaultColors
};

ColorPalette.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string),
	value: PropTypes.string,
	onChange: PropTypes.func
};
