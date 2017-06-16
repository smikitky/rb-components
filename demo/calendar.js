import React from 'react';

import Calendar from '../lib/Calendar';
import RelativeDatePicker from '../lib/RelativeDatePicker';
import ValuePreview from './value-preview';

const CalendarDemo = () => {
	return <div>
		<h3>Static Calendar</h3>
		<Calendar />
		<h3>Relative Date Picker</h3>
		<ValuePreview
			component={RelativeDatePicker}
			initialValue={null}
		/>
	</div>;
};

export default CalendarDemo;
