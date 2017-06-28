import React from 'react';

import ColorPicker, { ColorPalette } from '../lib/ColorPicker';
import ValuePreview from './value-preview';

const ColorPickers = props => <div>
	<ColorPicker showColorCode {...props} />
	&ensp;
	<ColorPicker bsSize='xs' {...props} />
	&ensp;
	<ColorPicker noCaret {...props} />
	&ensp;
	<ColorPicker noCaret showColorCode {...props} />
	&ensp;
	<ColorPicker boxPreview showColorCode {...props} />
</div>;

const ColorDemo = () => {
	return <div>
		<h3>Dropdown Color Pickers</h3>
		<ValuePreview initialValue={'#ff0000'} >
			<ColorPickers />
		</ValuePreview>
		<h3>Static Color Palette</h3>
		<ValuePreview initialValue={'#ff0000'}>
			<ColorPalette />
		</ValuePreview>
	</div>;
};

export default ColorDemo;
