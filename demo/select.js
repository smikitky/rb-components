import React from 'react';
import ShrinkSelect from '../lib/ShrinkSelect';
import MultiSelect from '../lib/MultiSelect';
import ValuePreview from './value-preview';

const options = ['Apple', 'Banana', 'Grape', 'Lemon', 'Melon', 'Orange'];

const CustomRenderer = props => (
	<span style={{border: '1px solid silver', padding: '1px 3px'}}>
		{props.caption}
	</span>
);

export const ShrinkSelectDemo = () => {
	return <div>
		<h3>ShrinkSelect</h3>
		<ValuePreview initialValue={options[0]}>
			<ShrinkSelect options={options} />
		</ValuePreview>
		<h3>MultiSelect</h3>
		<ValuePreview initialValue={[]}>
			<MultiSelect options={options} />
		</ValuePreview>
		<h3>With Custom Renderer</h3>
		<ValuePreview initialValue={[]}>
			<MultiSelect options={options} renderer={CustomRenderer} />
		</ValuePreview>
		<h3>MultiSelect Checkbox Array</h3>
		<ValuePreview initialValue={[]}>
			<MultiSelect options={options} type='checkbox' />
		</ValuePreview>
	</div>;
};

export default ShrinkSelectDemo;
