import React, { Fragment } from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import classnames from 'classnames';
import normalizeOptions from './utils/normalizeOptions';
import styled from 'styled-components';

const DefaultRenderer = props => <Fragment>{props.caption}</Fragment>;

const StyledDropdown = styled(Dropdown)`
  &.dropdown-block {
    display: block;
    > .btn {
      float: none;
      text-align: left;
      &.btn-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .dropdown-menu {
      min-width: 100%;
    }
  }
`;

export default function ShrinkSelect(props) {
  const {
    defaultSelect = null,
    onChange = () => {},
    bsSize = undefined,
    bsStyle = 'default',
    block = false,
    disabled,
    className,
    renderer: Renderer = DefaultRenderer,
    numericalValue = false
  } = props;

  const options = normalizeOptions(props.options);

  const title =
    props.value in options ? (
      <Renderer {...options[props.value]} />
    ) : defaultSelect !== null ? (
      options[defaultSelect].caption
    ) : (
      ' '
    );

  const handleChange = key => {
    if (typeof onChange === 'function') {
      onChange(numericalValue ? parseFloat(key) : key);
    }
  };

  return (
    <StyledDropdown
      id="shrink-select-dropdown"
      className={classnames(
        'shrink-select',
        { 'dropdown-block': block },
        className
      )}
      disabled={disabled}
    >
      <Dropdown.Toggle bsStyle={bsStyle} bsSize={bsSize} block={block}>
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.keys(options).map(key => (
          <MenuItem key={key} onClick={() => handleChange(key)}>
            <Renderer {...options[key]} />
          </MenuItem>
        ))}
      </Dropdown.Menu>
    </StyledDropdown>
  );
}
