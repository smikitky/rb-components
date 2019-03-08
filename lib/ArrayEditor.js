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
const ArrayEditor = React.memo(props => {
  const {
    value,
    inline,
    newItemValue,
    editor: Editor,
    className,
    onChange = () => {},
    disabled
  } = props;

  const handleChange = (index, newValue) => {
    if (disabled) return;
    const newList = value.slice();
    newList[index] = newValue;
    onChange(newList);
  };

  const handleAdd = () => {
    const newItem =
      newItemValue instanceof Function ? newItemValue(value) : newItemValue;
    const newList = value.concat(newItem);
    onChange(newList);
  };

  const handleRemove = index => {
    const newList = value.slice();
    newList.splice(index, 1);
    onChange(newList);
  };

  const classNames = classnames('array-editor', { inline: inline }, className);
  return (
    <StyledUl className={classNames}>
      {value.map((item, i) => (
        <li key={i.toString()}>
          <Editor
            value={item}
            onChange={val => handleChange(i, val)}
            disabled={disabled}
          />
          <IconButton
            bsStyle="link"
            bsSize="xs"
            icon="remove"
            onClick={() => handleRemove(i)}
            disabled={disabled}
          />
        </li>
      ))}
      <li key="add" className="add">
        <IconButton
          bsStyle="link"
          bsSize="xs"
          icon="plus"
          onClick={handleAdd}
          disabled={disabled}
        >
          Add
        </IconButton>
      </li>
    </StyledUl>
  );
});

export default ArrayEditor;

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
