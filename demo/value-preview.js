import React, { cloneElement, Fragment, useState } from 'react';

const DefaultPreviewer = props => {
  const { value } = props;
  return <Fragment>{JSON.stringify(value)}</Fragment>;
};

/**
 * Displays the specified component with its value
 * and maintains the value changes.
 */
const ValuePreview = props => {
  const {
    initialValue,
    valueProp = 'value',
    event = 'onChange',
    canDisable = false,
    children,
    previewer: Previewer = DefaultPreviewer
  } = props;
  const [value, setValue] = useState(initialValue);
  const [disabled, setDisabled] = useState(false);

  const handleDisableClick = () => {
    setDisabled(d => !d);
  };

  const child = cloneElement(children, {
    [valueProp]: value,
    [event]: setValue,
    disabled
  });

  return (
    <div>
      {canDisable && (
        <div>
          <label>
            <input type="checkbox" onClick={handleDisableClick} />
            disabled
          </label>
        </div>
      )}
      {child}
      <div className="value">
        <Previewer value={value} />
      </div>
    </div>
  );
};

export default ValuePreview;
