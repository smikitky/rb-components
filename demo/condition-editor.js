import React from 'react';

import ConditionEditor from '../lib/ConditionEditor';

const keys = {
	age: { caption: 'age', type: 'number' },
	firstName: { caption: 'first name', type: 'text' },
	familyName: { caption: 'family name', type: 'text' }
};

export default class ConditionEditorDemo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			value: {
				'$and': [
					{ keyName: 'age', op: '==', value: 30 }
				]
			}
		};
		this.change = this.change.bind(this);
	}

	change(value) {
		this.setState({ value });
	}

	render() {
		return <div>
			<ConditionEditor
				keys={keys}
				onChange={this.change}
				value={this.state.value}
			/>
			<div>
				{JSON.stringify(this.state.value)}
			</div>
		</div>;
	}
}
