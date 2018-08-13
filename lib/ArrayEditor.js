import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconButton from './IconButton';
import styled from 'styled-components';

const StyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  li {
    margin-bottom: 2px;
  }
  &.inline {
    > li {
      border: 1px solid #e5e5e5;
      padding: 2px 0 2px 5px;
      margin-right: 5px;
      display: inline-block;
      &.add {
        border: none;
      }
    }
  }
`;

/**
 * Renders an editor for generic items.
 * The 'editor' is a React component that accepts 'value' and 'onChange'.
 */
export default class ArrayEditor extends React.PureComponent {
  change(index, newValue) {
    const { value, onChange, disabled } = this.props;
    if (disabled) return;
    const newList = value.slice();
    newList[index] = newValue;
    onChange && onChange(newList);
  }

  add() {
    const { value, newItemValue, onChange } = this.props;
    const newItem =
      newItemValue instanceof Function ? newItemValue(value) : newItemValue;
    const newList = value.concat(newItem);
    onChange && onChange(newList);
  }

  remove(index) {
    const { value, onChange } = this.props;
    const newList = value.slice();
    newList.splice(index, 1);
    onChange && onChange(newList);
  }

  render() {
    const { value, inline, editor: Editor, className, disabled } = this.props;
    const classNames = classnames(
      'array-editor',
      { inline: inline },
      className
    );
    return (
      <StyledUl className={classNames}>
        {value.map((item, i) => (
          <li key={i.toString()}>
            <Editor
              value={item}
              onChange={val => this.change(i, val)}
              disabled={disabled}
            />
            <IconButton
              bsStyle="link"
              bsSize="xs"
              icon="remove"
              onClick={() => this.remove(i)}
              disabled={disabled}
            />
          </li>
        ))}
        <li key="add" className="add">
          <IconButton
            bsStyle="link"
            bsSize="xs"
            icon="plus"
            onClick={() => this.add()}
            disabled={disabled}
          >
            Add
          </IconButton>
        </li>
      </StyledUl>
    );
  }
}

ArrayEditor.defaultProps = {
  value: [],
  newItemValue: null
};

ArrayEditor.propTypes = {
  newItemValue: PropTypes.any,
  value: PropTypes.arrayOf(PropTypes.any),
  inline: PropTypes.bool,
  editor: PropTypes.func.isRequired
};
