import React, { useState } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import FormControl from 'react-bootstrap/lib/FormControl';
import Calendar, { defaultDateFormat } from './Calendar';
import moment from 'moment';
import styled from 'styled-components';
import { Sizes } from 'react-bootstrap';

const dateToString = (input: RelativeDate): string => {
  if (typeof input === 'string') return input;
  if (input === null) return '(All)';
  const [delta, unit] = input;
  if (unit === 'day') {
    if (delta === 0) return 'Today';
    if (delta === -1) return 'Yesterday';
  }
  const unitStr = Math.abs(delta) > 1 ? unit + 's' : unit;
  return delta < 0
    ? `${-delta} ${unitStr} ago`
    : `${delta} ${unitStr} from now`;
};

const StyledDropdown = styled(Dropdown)`
  .relative-datepicker-menu {
    padding: 10px;
    white-space: nowrap;
    min-width: 200px;
    .switch {
      margin-top: 10px;
    }
    .form-inline .form-control {
      width: 80px;
    }
  }
`;

export type RelativeDate = null | string | [number, 'day' | 'week' | 'month'];

type Mode = 'all' | 'absolute' | 'relative';

const RelativeDatePicker: React.FC<{
  value: RelativeDate;
  onChange: (value: RelativeDate) => void;
  disabled?: boolean;
  format: string;
  bsSize?: Sizes;
  bsStyle?: string;
}> = props => {
  const {
    value,
    onChange,
    format = defaultDateFormat,
    disabled,
    bsSize,
    bsStyle
  } = props;

  const [mode, setMode] = useState<Mode>('all');

  const adjustMode = () => {
    let mode: Mode = 'absolute';
    if (value === null) mode = 'all';
    if (Array.isArray(value)) mode = 'relative';
    setMode(mode);
  };

  const handleChangeMode = (mode: Mode) => {
    if (mode === 'relative') {
      onChange([0, 'day']);
    } else if (mode === 'all') {
      onChange(null);
    } else {
      onChange(moment().format(format));
    }
    setMode(mode);
  };

  const handleRelativeValueChange = (ev: any) => {
    const value = ev.target.value;
    onChange([-value, 'day']);
  };

  const editor = (
    <div className="relative-datepicker-menu">
      <ButtonGroup bsSize="xsmall">
        <Button
          tabIndex={-1}
          bsStyle={mode === 'relative' ? 'primary' : 'default'}
          onClick={() => handleChangeMode('relative')}
        >
          Relative
        </Button>
        <Button
          tabIndex={-1}
          bsStyle={mode === 'absolute' ? 'primary' : 'default'}
          onClick={() => handleChangeMode('absolute')}
        >
          Absolute
        </Button>
        <Button
          tabIndex={-1}
          bsStyle={mode === 'all' ? 'primary' : 'default'}
          onClick={() => handleChangeMode('all')}
        >
          All
        </Button>
      </ButtonGroup>
      {mode !== 'all' && (
        <div className="switch">
          {mode === 'relative' ? (
            <div className="form-inline">
              <FormControl
                bsSize="sm"
                type="number"
                min={0}
                tabIndex={-1}
                value={Array.isArray(value) ? -value[0] : 0}
                onSelect={
                  ev => ev.stopPropagation()
                  /* prevents closing of dropdown */
                }
                onChange={handleRelativeValueChange}
              />
              &ensp;days ago
            </div>
          ) : (
            <Calendar format={format} value={value} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  );

  return (
    <StyledDropdown
      id="relative-datetime-picker-dropdown"
      onDrop={adjustMode}
      disabled={disabled}
    >
      <Dropdown.Toggle bsSize={bsSize} bsStyle={bsStyle}>
        {dateToString(value)}
      </Dropdown.Toggle>
      <Dropdown.Menu>{editor}</Dropdown.Menu>
    </StyledDropdown>
  );
};

export default React.memo(RelativeDatePicker);

export const normalizeRelative = (
  dateValue: RelativeDate
): moment.Moment | null => {
  if (typeof dateValue === 'string') {
    return moment(dateValue);
  } else if (dateValue === null) {
    return null;
  } else if (Array.isArray(dateValue)) {
    return moment().startOf('day').add(dateValue[0], dateValue[1]);
  }
  return null;
};
