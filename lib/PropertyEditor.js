import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

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

/**
 * Renders key-value editor rows with varios value types.
 * Each 'editor' in a row is a React component that accepts 'value' and 'onChange'.
 * Other props of the underlying editor, if any, can be bound to the editor
 * using the higher-order function technique.
 * Some basic editors can be made via property-editor-types.
 */
export default class PropertyEditor extends React.PureComponent {
  handleChange(key, val) {
    const { disabled, value, onChange } = this.props;
    if (disabled) return;
    const newValues = { ...value };
    newValues[key] = val;
    typeof onChange === 'function' && onChange(newValues, key);
  }

  render() {
    const {
      value,
      complaints,
      properties,
      bsClass, // for overriding default class
      className, // for providing other classes along with the default one
      disabled,
      rowClassName,
      labelClassName,
      keyClassName,
      valueClassName,
      hasComplaintClassName,
      complaintClassName
    } = this.props;

    const rows = properties.map(property => {
      if (typeof property === 'string') {
        return <h3 key={'heading:' + property}>{property}</h3>;
      }
      const {
        key,
        caption,
        editor: Component,
        className: propClassName
      } = property;
      const hasComplaint = complaints && key in complaints;
      const classNames = classnames(rowClassName, propClassName, {
        [hasComplaintClassName]: hasComplaint
      });
      const row = [
        <div key={key} className={classNames}>
          <div className={keyClassName}>
            <label className={labelClassName}>{caption ? caption : key}</label>
          </div>
          <div className={valueClassName}>
            <Component
              disabled={disabled}
              value={value[key]}
              onChange={val => this.handleChange(key, val)}
            />
          </div>
        </div>
      ];
      if (hasComplaint) {
        row.push(<div className={complaintClassName}>{complaints[key]}</div>);
      }
      return row;
    });

    const classNames = classnames(bsClass, className);

    return <StyledDiv className={classNames}>{rows}</StyledDiv>;
  }
}

PropertyEditor.defaultProps = {
  value: {},
  properties: [],
  complaints: {},
  bsClass: 'property-editor',
  rowClassName: 'row form-horizontal',
  keyClassName: 'col-md-3',
  labelClassName: 'control-label',
  valueClassName: 'col-md-9',
  hasComplaintClassName: 'bg-danger',
  complaintClassName: 'text-danger'
};

PropertyEditor.propTypes = {
  value: PropTypes.object,
  properties: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        caption: PropTypes.node,
        editor: PropTypes.func.isRequired
      }),
      PropTypes.string
    ])
  ).isRequired,
  complaints: PropTypes.object
};
