import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import Calendar from './Calendar';
import classnames from 'classnames';

export default class DropdownDatePicker extends React.PureComponent {
	constructor(props) {
		super(props);
		this.dateClick = this.dateClick.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
	}

	triggerChange(value) {
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	dateClick(date) {
		this.triggerChange(date);
	}

	handleToggle(isOpen) {
		if (isOpen) {
			this.calendar.revealSelectedMonth();
		}
	}

	render() {
		const {
			value,
			disabled,
			bsSize = undefined,
			bsStyle = 'default',
			block = false,
			format
		} = this.props;

		return <Dropdown
			id='dropdown-date-picker-dropdown'
			className={classnames('dropdown-date-picker', { 'dropdown-block': block })}
			onToggle={this.handleToggle}
			disabled={disabled}
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
					ref={calendar => this.calendar = calendar}
					onChange={this.dateClick}
					format={format}
				/>
			</Dropdown.Menu>
		</Dropdown>;
	}
}
