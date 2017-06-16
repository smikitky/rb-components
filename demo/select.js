import React from 'react';

import ShrinkSelect from '../lib/ShrinkSelect';
import MultiSelect from '../lib/MultiSelect';

const options = ['Apple', 'Banana', 'Grape', 'Lemon', 'Melon', 'Orange'];

export default class ShrinkSelectDemo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { shrinkValue: options[0], multiValue: [] };
		this.shrinkChanged = this.changed.bind(this, 'shrinkValue');
		this.multiChanged = this.changed.bind(this, 'multiValue');
	}

	changed(key, value) {
		this.setState({ [key]: value });
	}

	render() {
		const { shrinkValue, multiValue } = this.state;
		return <div>
			<h3>ShrinkSelect</h3>
			<ShrinkSelect
				options={options}
				value={shrinkValue}
				onChange={this.shrinkChanged}
			/>
			<div className='value'>
				{JSON.stringify(shrinkValue)}
			</div>
			<h3>MultiSelect</h3>
			<MultiSelect
				options={options}
				selected={multiValue}
				onChange={this.multiChanged}
			/>
			<div className='value'>
				{JSON.stringify(multiValue)}
			</div>
		</div>;
	}
}
