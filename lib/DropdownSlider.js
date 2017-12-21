import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import Slider from './Slider';
import classnames from 'classnames';

export default class DropdownSlider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  render() {
    const {
      value,
      disabled,
      bsSize = undefined,
      bsStyle = 'default',
      block = false,
      min,
      max,
      step,
      captionFunc
    } = this.props;

    return (
      <Dropdown
        id="dropdown-slider-dropdown"
        className={classnames('dropdown-slider', { 'dropdown-block': block })}
        disabled={disabled}
      >
        <Dropdown.Toggle bsSize={bsSize} bsStyle={bsStyle} block={block}>
          {captionFunc(value)}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-slider-menu">
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={this.handleChange}
            thumbTabIndex={-1}
          />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const defaultCaptionFunc = value => parseFloat(value) + '';

DropdownSlider.defaultProps = {
  captionFunc: defaultCaptionFunc
};
