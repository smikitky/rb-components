import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Editor } from './editor-types';

const StyledDiv = styled.div`
  padding: 0 15px;
  h3 {
    font-size: 120%;
    font-weight: bold;
  }
  .row {
    padding: 0.5em 0;
  }
`;

export interface PropertyEditorProperty<K, V> {
  key: K;
  editor: Editor<V>;
  caption?: string;
  className?: string;
}

// https://stackoverflow.com/q/62405615/1209240
export type PropertyEditorProperties<P extends object> = (
  | string
  | { [K in keyof P]: PropertyEditorProperty<K, P[K]> }[keyof P]
)[];

interface Props<P extends object> {
  properties: PropertyEditorProperties<P>;
  value: P;
  complaints?: {
    [key in keyof P]?: string;
  };
  onChange: (value: P, key: keyof P) => void;
  disabled?: boolean;
  /**
   * Used to override default class
   */
  bsClass?: string;
  /**
   * Used to provide other classes along with the default one
   */
  className?: string;
  rowClassName?: string;
  labelClassName?: string;
  keyClassName?: string;
  valueClassName?: string;
  hasComplaintClassName?: string;
  complaintClassName?: string;
}

/**
 * Renders key-value editor rows with varios value types.
 * Each 'editor' in a row is a React component that accepts 'value' and 'onChange'.
 * Other props of the underlying editor, if any, can be bound to the editor
 * using the higher-order function technique.
 * Some basic editors can be made via editor-types.
 */
const PropertyEditor = <P extends object>(
  props: Props<P>
): React.ReactElement<Props<P>> => {
  const {
    value,
    onChange,
    complaints,
    properties = [],
    bsClass = 'property-editor',
    className,
    disabled = false,
    rowClassName = 'row form-horizontal',
    labelClassName = 'control-label',
    keyClassName = 'col-md-3',
    valueClassName = 'col-md-9',
    hasComplaintClassName = 'bg-danger',
    complaintClassName = 'text-danger'
  } = props;

  const handleChange = <K extends keyof P>(key: K, val: P[K]) => {
    if (disabled) return;
    const newValues = { ...value, [key]: val };
    onChange(newValues, key);
  };

  const rows = properties.map(property => {
    if (typeof property === 'string') {
      return <h3 key={'heading:' + property}>{property}</h3>;
    }
    const {
      key,
      editor: Component,
      caption,
      className: propClassName
    } = property;
    const hasComplaint = complaints && key in complaints;
    const classNames = classnames(rowClassName, propClassName, {
      [hasComplaintClassName]: hasComplaint
    });
    const row = [
      <div key={key as string} className={classNames}>
        <div className={keyClassName}>
          <label className={labelClassName}>{caption ? caption : key}</label>
        </div>
        <div className={valueClassName}>
          <Component
            disabled={disabled}
            value={value[key]}
            onChange={val => handleChange(key, val)}
          />
        </div>
      </div>
    ];
    if (hasComplaint) {
      row.push(<div className={complaintClassName}>{complaints![key]}</div>);
    }
    return row;
  });

  const classNames = classnames(bsClass, className);

  return <StyledDiv className={classNames}>{rows}</StyledDiv>;
};

export default React.memo(PropertyEditor) as <P extends object = {}>(
  props: Props<P>
) => React.ReactElement<Props<P>>;
