import React from 'react';

import ColorPicker, { ColorPalette } from '../lib/ColorPicker';
import ValuePreview from './value-preview';

const ColorDemo = () => {
	return <div>
		<h3>Color Picker</h3>
		<ValuePreview initialValue={'#ff0000'} >
			<ColorPicker showColorCode={true} />
		</ValuePreview>
		<h3>Static Color Palette</h3>
		<ValuePreview initialValue={'#ff0000'}>
			<ColorPalette />
		</ValuePreview>
	</div>;
};

export default ColorDemo;
