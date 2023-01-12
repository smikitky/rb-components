import React, { Fragment } from 'react';

import Calendar from '../lib/Calendar';
import DropdownDatePicker from '../lib/DropdownDatePicker';
import RelativeDatePicker from '../lib/RelativeDatePicker';
import DateRangePicker, { dateRangeToMongoQuery } from '../lib/DateRangePicker';
import ValuePreview from './value-preview';

const DropdownDatePickerDemo = props => (
  <div>
    <h4>Default</h4>
    <DropdownDatePicker {...props} />
    <h4>Blocked</h4>
    <DropdownDatePicker {...props} block bsSize="xs" bsStyle="primary" />
  </div>
);

const RangePreviewer = props => {
  const { value } = props;
  return (
    <Fragment>
      {JSON.stringify(value)}
      <div>
        <b>Mongo Query:</b>
        {JSON.stringify(dateRangeToMongoQuery(value, 'createdAt'))}
      </div>
    </Fragment>
  );
};

const CalendarDemo = () => {
  return (
    <div>
      <h3>Clickable Calendar</h3>
      <ValuePreview initialValue="2017-01-01" canDisable>
        <Calendar />
      </ValuePreview>
      <h3>Dropdown Date Picker</h3>
      <ValuePreview initialValue="2017-01-01" canDisable>
        <DropdownDatePickerDemo />
      </ValuePreview>
      <h3>Relative Date Picker</h3>
      <ValuePreview initialValue={null} canDisable>
        <RelativeDatePicker />
      </ValuePreview>
      <h3>Date Range Picker</h3>
      <ValuePreview
        initialValue={{ from: null, to: null }}
        canDisable
        previewer={RangePreviewer}
      >
        <DateRangePicker />
      </ValuePreview>
      <h3>Custom Date Format</h3>
      <ValuePreview initialValue={'31 Aug 1980'}>
        <DropdownDatePicker format="DD MMM YYYY" />
      </ValuePreview>
    </div>
  );
};

export default CalendarDemo;
