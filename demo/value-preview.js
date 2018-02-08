import React, { cloneElement, Fragment } from 'react';

const DefaultPreviewer = props => {
  const { value } = props;
  return <Fragment>{JSON.stringify(value)}</Fragment>;
};

/**
 * Displays the specified component with its value
 * and maintains the value changes.
 */
export default class ValuePreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: props.initialValue, disabled: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleDisableClick = this.handleDisableClick.bind(this);
  }

  handleChange(value) {
    this.setState({ value });
  }

  handleDisableClick() {
    this.setState({ disabled: !this.state.disabled });
  }

  render() {
    const {
      valueProp = 'value',
      event = 'onChange',
      canDisable = false,
      children,
      previewer: Previewer = DefaultPreviewer
    } = this.props;
    const child = cloneElement(children, {
      [valueProp]: this.state.value,
      [event]: this.handleChange,
      disabled: this.state.disabled
    });
    return (
      <div>
        {canDisable && (
          <div>
            <label>
              <input type="checkbox" onClick={this.handleDisableClick} />
              disabled
            </label>
          </div>
        )}
        {child}
        <div className="value">
          <Previewer value={this.state.value} />
        </div>
      </div>
    );
  }
}
