import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import normalizeOptions from './utils/normalizeOptions';
import classnames from 'classnames';

const DefaultRenderer = props => <span>{props.caption}</span>;

const MultiSelectDropdown = props => {
  const {
    renderer: Renderer,
    value,
    showSelectedMax,
    noneText,
    glue,
    options,
    onItemChange,
    disabled
  } = props;

  let caption = [];
  if (value.length === 0) {
    caption = noneText;
  } else if (value.length > showSelectedMax) {
    caption = `${value.length} selected`;
  } else {
    value.forEach((sel, i) => {
      const renderItem = options[sel];
      if (i > 0) caption.push(glue);
      caption.push(<Renderer key={i} renderAs="list" {...renderItem} />);
    });
  }

  return (
    <Dropdown
      id="multiselect-dropdown-comp"
      className="multiselect"
      disabled={disabled}
    >
      <Dropdown.Toggle>{caption}</Dropdown.Toggle>
      <Dropdown.Menu className="multiselect-popover multiselect-checkboxes">
        {checkBoxArray({
          renderer: Renderer,
          value,
          options,
          onItemChange,
          tabIndex: -1
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const checkBoxArray = props => {
  const {
    renderer: Renderer,
    value = [],
    options,
    onItemChange,
    disabled,
    tabIndex
  } = props;

  return Object.keys(options).map((key, i) => {
    const checked = value.some(sel => sel == key); // lazy equiality('==') needed
    const checkedClass = checked ? 'checked' : '';
    const renderItem = options[key];
    return (
      <li
        key={i}
        role="presentation"
        onClick={() => {
          !disabled && onItemChange(i, checked);
        }}
        className={checkedClass}
      >
        <input
          type="checkbox"
          checked={checked}
          readOnly
          tabIndex={tabIndex}
          disabled={disabled}
        />&ensp;
        <Renderer {...renderItem} renderAs="select" />
      </li>
    );
  });
};

/**
 * Dropdown + Multiselect component.
 */
export default function MultiSelect(props) {
  const {
    renderer = DefaultRenderer,
    showSelectedMax = 3,
    value = [],
    type = 'dropdown',
    glue = ', ',
    noneText = '(None)',
    onChange,
    disabled
  } = props;

  // Normalize options
  const options = normalizeOptions(props.options);

  function onItemChange(clickedIndex, checked) {
    const newValue = [];
    Object.keys(options).forEach((key, i) => {
      const insertingKey = props.numericalValue ? parseFloat(key) : key;
      if (clickedIndex !== i) {
        if (value.indexOf(insertingKey) !== -1) newValue.push(insertingKey);
      } else {
        if (!checked) newValue.push(insertingKey);
      }
    });
    typeof onChange === 'function' && onChange(newValue);
  }

  if (type === 'dropdown') {
    return (
      <MultiSelectDropdown
        value={value}
        disabled={disabled}
        options={options}
        renderer={renderer}
        glue={glue}
        showSelectedMax={showSelectedMax}
        noneText={noneText}
        onItemChange={onItemChange}
      />
    );
  } else {
    const classNames = classnames('list-unstyled', 'multiselect-checkboxes', {
      'text-muted': disabled
    });
    return (
      <ul className={classNames}>
        {checkBoxArray({
          value,
          disabled,
          options,
          renderer,
          onItemChange
        })}
      </ul>
    );
  }
}
