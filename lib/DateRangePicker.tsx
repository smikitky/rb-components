import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import RelativeDatePicker, {
  normalizeRelative,
  RelativeDate
} from './RelativeDatePicker';
import { Sizes } from 'react-bootstrap';
import { defaultDateFormat } from './Calendar';

const today: RelativeDate = [0, 'day'];

const presets: {
  [key: string]: {
    caption: string;
    from?: RelativeDate;
    to?: RelativeDate;
  };
} = {
  today: { caption: 'Today', from: today, to: today },
  yesterday: { caption: 'Yesterday', from: [-1, 'day'], to: [-1, 'day'] },
  last2days: { caption: 'Last 2 days', from: [-1, 'day'], to: today },
  last1week: { caption: 'Last 1 Week', from: [-6, 'day'], to: today },
  last1month: { caption: 'Last 1 month', from: [-1, 'month'], to: today },
  last6months: { caption: 'Last 3 months', from: [-3, 'month'], to: today },
  last1year: { caption: 'Last 1 year', from: [-1, 'year'], to: today },
  all: { caption: 'All', from: null, to: null }
};

export interface DateRange {
  from: RelativeDate;
  to: RelativeDate;
}

const DateRangePicker: React.FC<{
  value: DateRange;
  onChange: (value: DateRange) => void;
  id: string;
  format: string;
  bsSize?: Sizes;
  disabled?: boolean;
}> = props => {
  const {
    value: { from = null, to = null } = {},
    onChange,
    format = defaultDateFormat,
    bsSize,
    disabled
  } = props;

  const fromChange = (date: RelativeDate) => {
    const newValue = { from: date, to };
    onChange(newValue);
  };

  const toChange = (date: RelativeDate) => {
    const newValue = { from, to: date };
    onChange(newValue);
  };

  const presetSelect = (key: string) => {
    const newValue = {
      from: presets[key].from || null,
      to: presets[key].to || null
    };
    onChange(newValue);
  };

  return (
    <div className="daterange-picker">
      <div className="form-inline">
        <RelativeDatePicker
          // id={props.id + '-from'}
          value={from}
          format={format}
          onChange={fromChange}
          bsSize={bsSize}
          disabled={disabled}
        />
        &thinsp;&mdash;&thinsp;
        <RelativeDatePicker
          // id={props.id + '-to'}
          value={to}
          format={format}
          onChange={toChange}
          bsSize={bsSize}
          disabled={disabled}
        />
        <DropdownButton
          onSelect={(key: any) => presetSelect(key as string)}
          bsStyle="link"
          bsSize={bsSize}
          title=""
          id="relative-daterange-preset-dropdown"
          disabled={disabled}
        >
          {Object.keys(presets).map(key => (
            <MenuItem key={key} eventKey={key}>
              {presets[key].caption}
            </MenuItem>
          ))}
        </DropdownButton>
      </div>
    </div>
  );
};

export default DateRangePicker;

export const dateRangeToMongoQuery = (
  condition: DateRange,
  key: string
): { $and: any[] } | null => {
  const result: any = { $and: [] };
  const from = normalizeRelative(condition.from);
  if (from) result.$and.push({ [key]: { $gte: { $date: from } } });
  const to = normalizeRelative(condition.to, true);
  if (to) result.$and.push({ [key]: { $lt: { $date: to } } });
  return from || to ? result : null;
};
