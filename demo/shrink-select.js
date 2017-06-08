import React from 'react';

import ShrinkSelect from '../lib/ShrinkSelect';

const options = ['Apple', 'Banana', 'Grape'];

export default class ShrinkSelectDemo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { value: options[0] };
		this.changed = this.changed.bind(this);
	}

	changed(value) {
		this.setState({ value });
	}

	render() {
		const { value } = this.state;
		return <div>
			<ShrinkSelect
				options={options}
				value={value}
				onChange={this.changed}
			/>
		</div>;
	}
}
