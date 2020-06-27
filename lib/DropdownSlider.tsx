import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import Slider, { SliderProps } from './Slider';
import classnames from 'classnames';
import styled from 'styled-components';
import { Sizes } from 'react-bootstrap';

const StyledDropdown = styled(Dropdown)`
  .slider {
    width: 200px;
  }
  .dropdown-slider-menu {
    padding: 10px;
  }
`;

const defaultCaptionFunc = (value: number) => value + '';

const DropdownSlider: React.FC<
  {
    value: number;
    onChange: (value: number) => void;
    captionFunc: (value: number) => string;
    bsSize?: Sizes;
    bsStyle?: string;
  } & SliderProps
> = props => {
  const {
    value,
    onChange,
    disabled,
    bsSize = undefined,
    bsStyle = 'default',
    block = false,
    min,
    max,
    step,
    captionFunc = defaultCaptionFunc
  } = props;

  return (
    <StyledDropdown
      id="dropdown-slider-dropdown"
      className={classnames('dropdown-slider', { 'dropdown-block': block })}
      disabled={disabled}
    >
      <Dropdown.Toggle
        bsSize={bsSize}
        bsStyle={bsStyle}
        // @ts-ignore
        block={block}
      >
        {captionFunc(value)}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-slider-menu">
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          thumbTabIndex={-1}
        />
      </Dropdown.Menu>
    </StyledDropdown>
  );
};

export default React.memo(DropdownSlider);
