import React from 'react';

import Calendar from '../lib/Calendar';
import RelativeDatePicker from '../lib/RelativeDatePicker';
import DateRangePicker from '../lib/DateRangePicker';
import ValuePreview from './value-preview';

const CalendarDemo = () => {
	return <div>
		<h3>Static Calendar</h3>
		<Calendar />
		<h3>Relative Date Picker</h3>
		<ValuePreview initialValue={null}>
			<RelativeDatePicker />
		</ValuePreview>
		<h3>Date Range Picker</h3>
		<ValuePreview initialValue={{ from: null, to: null }}>
			<DateRangePicker />
		</ValuePreview>
	</div>;
};

export default CalendarDemo;
