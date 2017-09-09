import React from 'react';
import Slider from '../lib/Slider';
import ValuePreview from './value-preview';

export const SliderDemo = () => {
	return <div>
		<h3>Slider</h3>
		<ValuePreview initialValue={50} canDisable>
			<Slider min={10} max={90} step={2} />
		</ValuePreview>
	</div>;
};

export default SliderDemo;
