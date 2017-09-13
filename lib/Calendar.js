import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';

export const defaultDateFormat = 'YYYY-MM-DD';

export default class Calendar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			year: props.defaultYear || moment().year(),
			month: props.defaultMonth || (moment().month() + 1)
		};
		this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
	}
	
	handleYearMonthChange({ year, month }) {
		this.setState({ year, month });
		
	}
	
	render() {
		const { year, month, ...rest } = this.props;
		const theYear = year !== undefined ? year : this.state.year;
		const theMonth = month !== undefined ? month : this.state.month;
		return <ControlledCalendar
			year={theYear}
			month={theMonth}
			onYearMonthChange={this.handleYearMonthChange}
			{...rest}
		/>;
	}
	
	revealSelectedMonth() {
		const { value, format = defaultDateFormat } = this.props;
		if (!value) return;
		const date = moment(value, format);
		if (!date.isValid()) return;
		this.setState({ year: date.year(), month: date.month() + 1 });
	}
}

Calendar.propTypes = {
	defaultYear: PropTypes.number,
	defaultMonth: PropTypes.number,
	year: PropTypes.number,
	month: PropTypes.number,
	format: PropTypes.string,
	onChange: PropTypes.func,
	onYearMonthChange: PropTypes.func
};

class ControlledCalendar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.handleWheel = this.handleWheel.bind(this);
		this.prevYear = this.nav.bind(this, -1, 'year');
		this.nextYear = this.nav.bind(this, +1, 'year');
		this.prevMonth = this.nav.bind(this, -1, 'month');
		this.nextMonth = this.nav.bind(this, +1, 'month');
	}

	nav(delta, unit) {
		const newDate =
			moment({ year: this.props.year, month: this.props.month - 1})
			.add(delta, unit);
		this.props.onYearMonthChange({ year: newDate.year(), month: newDate.month() + 1 });
	}

	handleWheel(ev) {
		ev.preventDefault();
		if (ev.deltaY > 0) this.nextMonth();
		if (ev.deltaY < 0) this.prevMonth();
	}

	render() {
		const { year, month, value, onChange, format, disabled } = this.props;
		return <div
			className={classnames('calendar', {'text-muted': disabled, disabled })}
			onWheel={this.handleWheel}
		>
			<div className='calendar-nav'>
				<Navicon glyph='backward' onClick={this.prevYear} disabled={disabled} />
				<Navicon glyph='triangle-left' onClick={this.prevMonth} disabled={disabled} />
				{year} - {month}
				<Navicon glyph='triangle-right' onClick={this.nextMonth} disabled={disabled} />
				<Navicon glyph='forward' onClick={this.nextYear} disabled={disabled} />
			</div>
			<CalendarTable
				year={year}
				month={month}
				format={format}
				onChange={onChange}
				value={value}
				disabled={disabled}
			/>
		</div>;
	}
}

const Navicon = ({ glyph, onClick, disabled }) => (
	<Button bsSize='xs' bsStyle='link' onClick={onClick} disabled={disabled} >
		<Glyphicon glyph={glyph} />
	</Button>
);

const split = (array, every) => {
	const result = [];
	let i = 0;
	while (i < array.length) {
		result.push(array.slice(i, i + every));
		i += every;
	}
	return result;
};

export class CalendarTable extends React.PureComponent {
	constructor(props) {
		super(props);
		this.handleDateSelect = this.handleDateSelect.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleTableFocus = this.handleTableFocus.bind(this);
		this.handleTableBlur = this.handleTableBlur.bind(this);
		this.state = { hasFocus: false };
	}

	handleDateSelect(ev) {
		const { disabled, onChange, format = defaultDateFormat } = this.props;
		const date = moment.unix(ev.target.dataset.date);
		if (disabled) return;
		if (typeof onChange === 'function') {
			onChange(date.format(format));
		}
	}

	focusRelative(ev, delta) {
		const children = Array.from(this.tbody.querySelectorAll('td'));
		const fromDate = moment.unix(ev.target.dataset.date);
		const toDate = fromDate.add(delta, 'day').unix();
		const nextNode = children.find(el => el.dataset.date == toDate);
		if (nextNode) {
			nextNode.focus();
			ev.preventDefault();
			ev.stopPropagation();
		}
	}

	handleTableFocus(ev) {
		const { value, format } = this.props;
		const children = Array.from(this.tbody.querySelectorAll('td'));
		if (ev.target === this.table) {
			const valueMoment = value !== undefined ? moment(value, format).unix() : undefined;
			const selected = children.find(el => el.dataset.date == valueMoment);
			if (selected) selected.focus();
			else this.tbody.querySelector('td').focus();
		}
		this.setState({ hasFocus: true });
	}
	
	handleTableBlur() {
		this.setState({ hasFocus: false });
	}
	
	handleKeyDown(ev) {
		const key = keycode(ev);
		switch (key) {
			case 'enter':
			case 'space':
				this.handleDateSelect(ev);
				ev.preventDefault();
				break;
			case 'right':
				this.focusRelative(ev, 1);
				break;
			case 'left':
				this.focusRelative(ev, -1);
				break;
			case 'up':
				this.focusRelative(ev, -7);
				break;
			case 'down':
				this.focusRelative(ev, 7);
				break;
		}
	}

	
	render() {
		const { year, month, value, disabled, format } = this.props;
	
		const start = moment({
			year, month: month - 1, day: 1
		}).startOf('week');
		const last = moment({
			year, month: month - 1
		}).endOf('month').endOf('week').startOf('day');
		const lastTimestamp = last.unix();
	
		const valueMoment = value !== undefined ? moment(value, format) : undefined;
	
		const days = [];
		let i = 0;
		for (;;) {
			const date = start.clone().add(i, 'day');
			days.push(date);
			if (date.unix() >= lastTimestamp) break;
			i++;
		}
		const weeks = split(days, 7);

		const day = (date) => {
			const classNames = classnames({
				selected: valueMoment && date.isSame(valueMoment, 'day'),
				'not-this-month': date.month() !== month - 1
			});
			return <td
				key={date.dayOfYear()}
				tabIndex={disabled ? undefined : -1}
				data-date={date.unix()}
				onClick={this.handleDateSelect}
				onKeyDown={this.handleKeyDown}
				className={classNames}
			>
				{date.date()}
			</td>;
		};
	
		const classNames = classnames('calendar-table', { 'text-muted': disabled, disabled });

		return <table
			className={classNames}
			tabIndex={disabled ? undefined : (this.state.hasFocus ? -1 : 0)}
			onFocus={this.handleTableFocus}
			onBlur={this.handleTableBlur}
			ref={el => this.table = el}
		>
			<thead>
				<tr>
					<th>Su</th>
					<th>Mo</th>
					<th>Tu</th>
					<th>We</th>
					<th>Th</th>
					<th>Fr</th>
					<th>Sa</th>
				</tr>
			</thead>
			<tbody ref={el => this.tbody = el}>
				{weeks.map(week => (
					<tr key={week[0].dayOfYear()}>
						{week.map(date => day(date))}
					</tr>
				))}
			</tbody>
		</table>;
	}
}

CalendarTable.defaultProps = {
	format: defaultDateFormat
};