import React from 'react';
import ShrinkSelect from '../lib/ShrinkSelect';
import MultiSelect from '../lib/MultiSelect';
import ValuePreview from './value-preview';

const options = ['Apple', 'Banana', 'Grape', 'Lemon', 'Melon', 'Orange'];

export const ShrinkSelectDemo = () => {
	return <div>
		<h3>ShrinkSelect</h3>
		<ValuePreview initialValue={options[0]}>
			<ShrinkSelect options={options} />
		</ValuePreview>
		<h3>MultiSelect</h3>
		<ValuePreview valueProp='selected' initialValue={[]}>
			<MultiSelect options={options} />
		</ValuePreview>
	</div>;
};

export default ShrinkSelectDemo;
