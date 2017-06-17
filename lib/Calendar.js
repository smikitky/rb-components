import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';

export default class Calendar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			year: props.initialYear || moment().year(),
			month: props.initialMonth || (moment().month() + 1)
		};
		this.prevYear = this.nav.bind(this, -1, 'year');
		this.nextYear = this.nav.bind(this, +1, 'year');
		this.prevMonth = this.nav.bind(this, -1, 'month');
		this.nextMonth = this.nav.bind(this, +1, 'month');
	}

	nav(delta, unit) {
		const newDate =
			moment({ year: this.state.year, month: this.state.month - 1})
			.add(delta, unit);
		this.setState({ year: newDate.year(), month: newDate.month() + 1 });
	}

	render() {
		const { highlight, onDateClick } = this.props;
		return <div className='calendar'>
			<div className='calendar-nav'>
				<Button bsSize='xs' bsStyle='link' onClick={this.prevYear}>
					<Glyphicon glyph='backward' />
				</Button>
				<Button bsSize='xs' bsStyle='link' onClick={this.prevMonth}>
					<Glyphicon glyph='triangle-left' />
				</Button>
				{this.state.year} - {this.state.month}&ensp;
				<Button bsSize='xs' bsStyle='link' onClick={this.nextMonth}>
					<Glyphicon glyph='triangle-right' />
				</Button>
				<Button bsSize='xs' bsStyle='link' onClick={this.nextYear}>
					<Glyphicon glyph='forward' />
				</Button>
			</div>
			<CalendarTable
				onDateClick={onDateClick}
				highlight={highlight}
				year={this.state.year}
				month={this.state.month}
			/>
		</div>;
	}
}

function split(array, every) {
	let result = [];
	let i = 0;
	while (i < array.length) {
		result.push(array.slice(i, i + every));
		i += every;
	}
	return result;
}

export const CalendarTable = props => {
	const start = moment({
		year: props.year, month: props.month - 1, day: 1
	}).startOf('week');
	const last = moment({
		year: props.year, month: props.month - 1
	}).endOf('month').endOf('week').startOf('day');
	const lastTimestamp = last.unix();

	let days = [];
	let i = 0;
	for (;;) {
		const date = start.clone().add(i, 'day');
		days.push(date);
		if (date.unix() >= lastTimestamp) break;
		i++;
	}
	const weeks = split(days, 7);

	function handleClick(date) {
		typeof props.onDateClick === 'function' && props.onDateClick(date);
	}

	return <table className='calendar-table'>
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
		<tbody>
			{weeks.map(week => <tr key={week[0].dayOfYear()}>
				{week.map(date => <td key={date.dayOfYear()} onClick={() => handleClick(date)}>
					{date.date()}
				</td>)}
			</tr>)}
		</tbody>
	</table>
}
