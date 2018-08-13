import React from 'react';
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

export default class DropdownDatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { yearMonth: null };
    this.dateClick = this.dateClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
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
    if (!isOpen) return;
    const { value, format } = this.props;
    const m = moment(value, format);
    if (m.isValid()) {
      this.setState({
        yearMonth: { year: m.year(), month: m.month() + 1 }
      });
    }
  }

  handleYearMonthChange(yearMonth) {
    this.setState({ yearMonth });
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

    return (
      <StyledDropdown
        id="dropdown-date-picker-dropdown"
        className={classnames('dropdown-date-picker', {
          'dropdown-block': block
        })}
        onToggle={this.handleToggle}
        disabled={disabled}
      >
        <Dropdown.Toggle bsSize={bsSize} bsStyle={bsStyle} block={block}>
          {value}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-date-picker-menu">
          <Calendar
            value={value}
            yearMonth={this.state.yearMonth}
            ref={calendar => (this.calendar = calendar)}
            onChange={this.dateClick}
            onYearMonthChange={this.handleYearMonthChange}
            format={format}
          />
        </Dropdown.Menu>
      </StyledDropdown>
    );
  }
}
