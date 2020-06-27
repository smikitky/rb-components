import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ArrayEditor from './ArrayEditor';
import BlockSelect from './BlockSelect';
import ShrinkSelect from './ShrinkSelect';
import MultiSelect from './MultiSelect';
import wrapDisplayName from './utils/wrapDisplayName';
import { Options } from './utils/normalizeOptions';

export type Editor<T> = React.FC<{
  value: T;
  onChange: (value: T) => void;
  disabled: boolean;
}>;

/**
 * Provides creators for basic "editor" components,
 * which are used with PropertyEditor and ArrayEditor.
 * Each editor must take "value", "onChange" and "disabled" props.
 * Other props like "maxLength" and "placeholder" can be bound to the
 * component using creators in this module.
 * @module
 */

const formControl = <T extends any = string>(
  options: { filter?: (input: T) => T; regex?: RegExp; type: string },
  baseFilter?: (input: string) => T
) => {
  const { filter, regex, ...otherOptions } = options;
  const stringify = (val: any) =>
    typeof val === 'undefined' ? '' : String(val);
  const process = (value: string, prevValue: T): T => {
    let outValue = baseFilter ? baseFilter(value) : (value as T);
    if (filter) outValue = filter(outValue);
    if (regex instanceof RegExp && !regex.test(value))
      outValue = prevValue as T;
    return outValue;
  };

  const result = (({ onChange, value, disabled }) => (
    <FormControl
      {...otherOptions}
      value={stringify(value)}
      onChange={(ev: any) => onChange(process(ev.target.value, value))}
      disabled={disabled}
    />
  )) as Editor<T>;
  result.displayName = `FormControl(${options.type})`;
  return result;
};

export const text = options => formControl({ ...options, type: 'text' });

export const password = options =>
  formControl({ ...options, type: 'password' });

export const number = options =>
  formControl<number>({ ...options, type: 'number' }, parseFloat);

export const integer = options =>
  formControl<number>({ ...options, type: 'number' }, parseInt);

export const textarea = options =>
  formControl({ ...options, componentClass: 'textarea' });

export const checkbox = (options: { label: string }) => {
  return (({ onChange, value, disabled }) => (
    <span>
      <Checkbox
        checked={!!value}
        onChange={(ev: any) => onChange(ev.target.checked)}
        disabled={disabled}
      >
        {options && options.label}
      </Checkbox>
    </span>
  )) as Editor<boolean>;
};

export const select = <T extends string | number = string>(
  options: Options,
  params: any = {}
) => {
  return (props => (
    <BlockSelect
      options={options}
      {...params}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  )) as Editor<T>;
};

export const shrinkSelect = <T extends string | number = string>(
  options: Options,
  params: any = {}
) => {
  return (props => (
    <ShrinkSelect
      options={options}
      {...params}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  )) as Editor<T>;
};

export const multiSelect = <T extends string | number = string>(
  options: Options,
  params: any = {}
) => {
  return (props => (
    <MultiSelect
      options={options}
      {...params}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  )) as Editor<T[]>;
};

/**
 * Wraps another editor and turns it an ArrayEditor
 */
export const arrayOf = <T extends any>(
  editor: Editor<T>,
  newItemValue: any = '',
  inline?: boolean
) => {
  const result: Editor<T[]> = props => (
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

export const inlineArrayOf = <T extends any>(
  editor: Editor<T>,
  newItemValue: any
) => {
  return arrayOf(editor, newItemValue, true);
};
