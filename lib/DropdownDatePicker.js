import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import Calendar from './Calendar';
import moment from 'moment';
import classnames from 'classnames';
import styled from 'styled-components';

const StyledDropdown = styled(Dropdown)`
  .dropdown-date-picker-menu {
    padding: 10px;
  }
`;

const DropdownDatePicker = props => {
  const [yearMonth, setYearMonth] = useState(null);

  const {
    value,
    disabled,
    bsSize = undefined,
    bsStyle = 'default',
    block = false,
    format,
    onChange = () => {}
  } = props;

  const handleToggle = isOpen => {
    if (!isOpen) return;
    const m = moment(value, format);
    if (m.isValid()) {
      setYearMonth({ year: m.year(), month: m.month() + 1 });
    }
  };

  return (
    <StyledDropdown
      id="dropdown-date-picker-dropdown"
      className={classnames('dropdown-date-picker', {
        'dropdown-block': block
      })}
      onToggle={handleToggle}
      disabled={disabled}
    >
      <Dropdown.Toggle bsSize={bsSize} bsStyle={bsStyle} block={block}>
        {value}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-date-picker-menu">
        <Calendar
          value={value}
          yearMonth={yearMonth}
          onChange={onChange}
          onYearMonthChange={setYearMonth}
          format={format}
        />
      </Dropdown.Menu>
    </StyledDropdown>
  );
};

export default DropdownDatePicker;
