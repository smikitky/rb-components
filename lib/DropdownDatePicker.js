import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import Calendar from './Calendar';
import classnames from 'classnames';

export default class DropdownDatePicker extends React.PureComponent {
	constructor(props) {
		super(props);
		this.dateClick = this.dateClick.bind(this);
	}

	triggerChange(value) {
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	dateClick(date) {
		this.triggerChange(date);
	}

	render() {
		const {
			value,
			bsSize = undefined,
			bsStyle = 'default',
			block = false,
			format
		} = this.props;

		return <Dropdown
			id='dropdown-date-picker-dropdown'
			className={classnames('dropdown-date-picker', { 'dropdown-block': block })}
		>
			<Dropdown.Toggle
				bsSize={bsSize}
				bsStyle={bsStyle}
				block={block}
			>
				{value}
			</Dropdown.Toggle>
			<Dropdown.Menu className='dropdown-date-picker-menu'>
				<Calendar
					value={value}
					onChange={this.dateClick}
					format={format}
				/>
			</Dropdown.Menu>
		</Dropdown>;
	}
}
