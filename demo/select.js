import React from 'react';
import ShrinkSelect from '../lib/ShrinkSelect';
import MultiSelect from '../lib/MultiSelect';
import ValuePreview from './value-preview';

const options = ['Apple', 'Banana', 'Grape', 'Lemon', 'Melon', 'Orange'];

export const ShrinkSelectDemo = () => {
	return <div>
		<h3>ShrinkSelect</h3>
		<ValuePreview
			component={ShrinkSelect}
			options={options}
			initialValue={options[0]}
		/>
		<h3>MultiSelect</h3>
		<ValuePreview
			component={MultiSelect}
			options={options}
			valueProp='selected'
			initialValue={[]}
		/>
	</div>;
};

export default ShrinkSelectDemo;
