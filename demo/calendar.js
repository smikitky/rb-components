import React from 'react';

import Calendar from '../lib/Calendar';
import RelativeDatePicker from '../lib/RelativeDatePicker';
import ValuePreview from './value-preview';

const CalendarDemo = () => {
	return <div>
		<h3>Static Calendar</h3>
		<Calendar />
		<h3>Relative Date Picker</h3>
		<ValuePreview initialValue={null}>
			<RelativeDatePicker />
		</ValuePreview>
	</div>;
};

export default CalendarDemo;
