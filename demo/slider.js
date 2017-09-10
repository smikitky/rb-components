import React from 'react';
import Slider from '../lib/Slider';
import RangeSlider from '../lib/RangeSlider';
import ValuePreview from './value-preview';

const Sliders = props => (
	<div>
		<Slider min={10} max={90} step={2} {...props} />
		<Slider block min={10} max={90} step={2} {...props} />
	</div>
);

export const SliderDemo = () => {
	return <div>
		<h3>Slider</h3>
		<ValuePreview initialValue={50} canDisable>
			<Sliders />
		</ValuePreview>
		<h3>Range</h3>
		<ValuePreview initialValue={[10, 90]} canDisable>
			<RangeSlider min={0} max={100} step={1} />
		</ValuePreview>
	</div>;
};

export default SliderDemo;
