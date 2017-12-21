import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ArrayEditor from './ArrayEditor';
import BlockSelect from './BlockSelect';
import ShrinkSelect from './ShrinkSelect';
import MultiSelect from './MultiSelect';
import wrapDisplayName from './utils/wrapDisplayName';

/**
 * Provides creators for basic "editor" components,
 * which are used with PropertyEditor and ArrayEditor.
 * Each editor must take "value", "onChange" and "disabled" props.
 * Other props like "maxLength" and "placeholder" can be bound to the
 * component using creators in this module.
 * @module
 */

const formControl = (options, baseFilter) => {
  const { filter, regex, ...otherOptions } = options;

  function process(value, prevValue = '') {
    if (baseFilter) value = baseFilter(value);
    if (filter) value = filter(value);
    if (regex instanceof RegExp && !regex.test(value)) value = prevValue;
    return value;
  }

  const result = ({ onChange, value = '', disabled }) => (
    <FormControl
      {...otherOptions}
      value={value}
      onChange={ev => onChange(process(ev.target.value, value))}
      disabled={disabled}
    />
  );
  result.displayName = `FormControl(${options.type})`;
  return result;
};

export const text = options => formControl({ ...options, type: 'text' });

export const password = options =>
  formControl({ ...options, type: 'password' });

export const number = options =>
  formControl({ ...options, type: 'number' }, parseFloat);

export const integer = options =>
  formControl({ ...options, type: 'number' }, parseInt);

export const textarea = options =>
  formControl({ ...options, componentClass: 'textarea' });

export const checkbox = options => {
  return ({ onChange, value, disabled }) => (
    <span>
      <Checkbox
        checked={!!value}
        onChange={ev => onChange(ev.target.checked)}
        disabled={disabled}
      >
        {options && options.label}
      </Checkbox>
    </span>
  );
};

export const select = (options, params = {}) => {
  return props => (
    <BlockSelect
      options={options}
      {...params}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

export const shrinkSelect = (options, params = {}) => {
  return props => (
    <ShrinkSelect
      options={options}
      {...params}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

export const multiSelect = (options, params = {}) => {
  return props => (
    <MultiSelect
      options={options}
      {...params}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

/**
 * Wraps another editor and turns it an ArrayEditor
 */
export const arrayOf = (editor, newItemValue = '', inline) => {
  const result = props => (
    <ArrayEditor
      editor={editor}
      newItemValue={newItemValue}
      inline={!!inline}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
  result.displayName = wrapDisplayName('arrayOf', editor);
  return result;
};

export const inlineArrayOf = (editor, newItemValue) => {
  return arrayOf(editor, newItemValue, true);
};
