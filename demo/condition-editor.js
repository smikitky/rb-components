import React from 'react';

import ConditionEditor from '../lib/ConditionEditor';

const keys = {
	age: { caption: 'age', type: 'number' },
	firstName: { caption: 'first name', type: 'text' },
	familyName: { caption: 'family name', type: 'text' },
	sex: {
		caption: 'sex', type: 'select',
		spec: { options: ['M', 'F', 'O']}
	}
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
			<div className='value'>
				{JSON.stringify(this.state.value)}
			</div>
		</div>;
	}
}
