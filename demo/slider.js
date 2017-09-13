import React from 'react';
import Slider from '../lib/Slider';
import RangeSlider from '../lib/RangeSlider';
import DropdownSlider from '../lib/DropdownSlider';
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
		<h3>Dropdown Slider</h3>
		<ValuePreview initialValue={50} canDisable>
			<DropdownSlider
				min={0} max={100} step={10}
				captionFunc={v => v + '%'}
			/>
		</ValuePreview>
	</div>;
};

export default SliderDemo;
