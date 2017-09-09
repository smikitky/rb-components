import React from 'react';
import Slider, { Range } from '../lib/Slider';
import ValuePreview from './value-preview';

export const SliderDemo = () => {
	return <div>
		<h3>Slider</h3>
		<ValuePreview initialValue={50} canDisable>
			<Slider min={10} max={90} step={2} />
		</ValuePreview>
		<h3>Range</h3>
		<ValuePreview initialValue={[10, 90]} canDisable>
			<Range min={0} max={100} step={1} />
		</ValuePreview>
	</div>;
};

export default SliderDemo;
