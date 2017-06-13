import React from 'react';

import Calendar from '../lib/Calendar';
import RelativeDatePicker from '../lib/RelativeDatePicker';

export default class CalendarDemo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { relativeValue: null };
		this.relativeChange = this.relativeChange.bind(this);
	}

	relativeChange(value) {
		this.setState({ relativeValue: value });
	}

	render() {
		return <div>
			<Calendar />
			<RelativeDatePicker
				value={this.state.relativeValue}
				onChange={this.relativeChange}
			/>
		</div>;
	}
}
