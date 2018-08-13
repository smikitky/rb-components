import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import uncontrollable from 'uncontrollable';
import styled from 'styled-components';

export const defaultDateFormat = 'YYYY-MM-DD';

const StyledDiv = styled.div`
  text-align: center;
  display: inline-block;
  .calendar-nav {
    text-align: center;
  }
  .calendar-table {
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    td,
    th {
      width: 100% /7;
      padding: 0 2px;
    }
    td.not-this-month {
      color: #999;
    }
    td:hover {
      background-color: #eee;
    }
    td.selected {
      background-color: #ccc;
    }
    &.disabled {
      cursor: not-allowed;
      td:hover {
        background-color: transparent;
      }
      td.selected {
        background-color: #ddd;
      }
    }
  }
`;

class ControlledCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleWheel = this.handleWheel.bind(this);
    this.prevYear = this.nav.bind(this, -1, 'year');
    this.nextYear = this.nav.bind(this, +1, 'year');
    this.prevMonth = this.nav.bind(this, -1, 'month');
    this.nextMonth = this.nav.bind(this, +1, 'month');
  }

  resolveYearMonthProp() {
    const ym = this.props.yearMonth;
    if (ym != undefined && ym.year && ym.month >= 1 && ym.month <= 12) {
      return ym;
    }
    const date = new Date();
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  }

  nav(delta, unit) {
    const { onYearMonthChange } = this.props;
    if (typeof onYearMonthChange !== 'function') return;

    const { year, month } = this.resolveYearMonthProp();
    const newDate = moment({ year, month: month - 1 }).add(delta, unit);
    onYearMonthChange({ year: newDate.year(), month: newDate.month() + 1 });
  }

  handleWheel(ev) {
    ev.preventDefault();
    if (ev.deltaY > 0) this.nextMonth();
    if (ev.deltaY < 0) this.prevMonth();
  }

  render() {
    const { value, onChange, format, disabled } = this.props;
    const { year, month } = this.resolveYearMonthProp();

    return (
      <StyledDiv
        className={classnames('calendar', { 'text-muted': disabled, disabled })}
        onWheel={this.handleWheel}
      >
        <div className="calendar-nav">
          <Navicon
            glyph="backward"
            onClick={this.prevYear}
            disabled={disabled}
          />
          <Navicon
            glyph="triangle-left"
            onClick={this.prevMonth}
            disabled={disabled}
          />
          {year} - {month}
          <Navicon
            glyph="triangle-right"
            onClick={this.nextMonth}
            disabled={disabled}
          />
          <Navicon
            glyph="forward"
            onClick={this.nextYear}
            disabled={disabled}
          />
        </div>
        <CalendarTable
          yearMonth={{ year, month }}
          format={format}
          onChange={onChange}
          value={value}
          disabled={disabled}
        />
      </StyledDiv>
    );
  }
}

ControlledCalendar.propTypes = {
  yearMonth: PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  onYearMonthChange: PropTypes.func,
  onChange: PropTypes.func
};

// uncontrollable makes this component 'optionally-controllable'.
export const Calendar = uncontrollable(ControlledCalendar, {
  yearMonth: 'onYearMonthChange'
});
export default Calendar;

const Navicon = ({ glyph, onClick, disabled }) => (
  <Button bsSize="xs" bsStyle="link" onClick={onClick} disabled={disabled}>
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
      const valueMoment =
        value !== undefined ? moment(value, format).unix() : undefined;
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
    const {
      yearMonth: { year, month },
      value,
      disabled,
      format
    } = this.props;

    if (!year || !month) return <div>Invalid year month</div>;

    const start = moment({
      year,
      month: month - 1,
      day: 1
    }).startOf('week');
    const last = moment({
      year,
      month: month - 1
    })
      .endOf('month')
      .endOf('week')
      .startOf('day');
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

    const day = date => {
      const classNames = classnames({
        selected: valueMoment && date.isSame(valueMoment, 'day'),
        'not-this-month': date.month() !== month - 1
      });
      return (
        <td
          key={date.dayOfYear()}
          tabIndex={disabled ? undefined : -1}
          data-date={date.unix()}
          onClick={this.handleDateSelect}
          onKeyDown={this.handleKeyDown}
          className={classNames}
        >
          {date.date()}
        </td>
      );
    };

    const classNames = classnames('calendar-table', {
      'text-muted': disabled,
      disabled
    });

    return (
      <table
        className={classNames}
        tabIndex={disabled ? undefined : this.state.hasFocus ? -1 : 0}
        onFocus={this.handleTableFocus}
        onBlur={this.handleTableBlur}
        ref={el => (this.table = el)}
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
        <tbody ref={el => (this.tbody = el)}>
          {weeks.map(week => (
            <tr key={week[0].dayOfYear()}>{week.map(date => day(date))}</tr>
          ))}
        </tbody>
      </table>
    );
  }
}

CalendarTable.defaultProps = {
  format: defaultDateFormat
};
