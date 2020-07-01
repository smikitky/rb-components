import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import keycode from 'keycode';
import getHorizontalPositionInElement from './utils/getHorizontalPositionInElement';
import styled from 'styled-components';

const SliderThumb: React.FC<{
  onMove: (value: number) => void;
  onStep: (value: number) => void;
  percentPosition: number;
  disabled?: boolean;
  id: string;
  thumbTabIndex: number;
}> = props => {
  const { onMove, onStep } = props;
  const [dragging, setDragging] = useState(false);
  const thumb = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleDocumentMouseUp = () => setDragging(false);

    const handleDocumentMouseMove = ev => {
      if (!dragging) return;
      const percentPos = getHorizontalPositionInElement(
        thumb.current.parentNode as HTMLDivElement,
        ev.clientX
      );
      onMove(percentPos);
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [dragging, onMove]);

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleKeyDown = ev => {
    if (typeof onStep !== 'function') return;
    switch (keycode(ev)) {
      case 'left':
        onStep(-1);
        ev.preventDefault();
        break;
      case 'right':
        onStep(1);
        ev.preventDefault();
        break;
    }
  };

  const { percentPosition, disabled, id, thumbTabIndex } = props;
  const classNames = classnames('slider-thumb', `slider-thumb-${id}`, {
    dragging
  });
  return (
    <div
      ref={thumb}
      role="slider"
      className={classNames}
      tabIndex={disabled ? undefined : thumbTabIndex}
      style={{ left: percentPosition + '%' }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    />
  );
};

function valueToPercent(value, min, max) {
  if (value < min) return 0;
  if (value > max) return 100;
  return ((value - min) / (max - min)) * 100;
}

function percentToValue(percent, min, max, step) {
  const numOfSteps = (max - min) / step;
  return min + (Math.round(percent * numOfSteps) * (max - min)) / numOfSteps;
}

const ActiveTrack: React.FC<{
  percentLeft: number;
  percentRight: number;
}> = props => {
  const left = props.percentLeft;
  const right = 100 - props.percentRight;
  return (
    <div
      className="slider-active-track"
      style={{ left: left + '%', right: right + '%' }}
    />
  );
};

const thumbColor = '#337ab7';
const activeThumbColor = '#286090';

const StyledDiv = styled.div`
  padding: 3px 8px;
  width: 400px;
  &.block {
    width: auto;
  }
  &.disabled {
    cursor: not-allowed;
  }

  .slider-track {
    position: relative;
    background-color: #f5f5f5;
    box-shadow: inset 0 1px 4px silver;
    height: 10px;
  }

  .slider-active-track {
    position: absolute;
    background-color: #c5c5ff;
    box-shadow: inset 0 1px 4px silver;
    height: 10px;
    .slider.disabled & {
      background-color: silver;
    }
  }

  .slider-thumb {
    position: absolute;
  }

  .slider-thumb-value {
    &::after {
      position: absolute;
      display: block;
      content: '';
      border: 4px solid ${thumbColor};
      border-radius: 8px;
      left: -8px;
      top: -3px;
      width: 16px;
      height: 16px;
      .slider.disabled & {
        border-color: gray;
      }
    }
    &.dragging::after {
      border-color: ${activeThumbColor};
    }
  }

  .slider-thumb-lo {
    &::after {
      position: absolute;
      display: block;
      content: '';
      border-left: 12px solid ${thumbColor};
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      left: -12px;
      top: -3px;
      .slider.disabled & {
        border-left-color: gray;
      }
    }
    &.dragging::after {
      border-left-color: ${activeThumbColor};
    }
  }

  .slider-thumb-hi {
    &::after {
      position: absolute;
      display: block;
      content: '';
      border-right: 12px solid ${thumbColor};
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      left: 0px;
      top: -3px;
      .slider.disabled & {
        border-right-color: gray;
      }
    }
    &.dragging::after {
      border-right-color: ${activeThumbColor};
    }
  }
`;

export interface SliderProps {
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  className?: string;
  thumbTabIndex?: number;
  block?: boolean;
}

export const MultiSlider: React.FC<
  {
    value: number[];
    onChange: (value: number[]) => void;
    sliders: string[];
  } & SliderProps
> = React.memo(props => {
  const {
    value = [],
    onChange,
    sliders,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    className,
    thumbTabIndex = 0,
    block
  } = props;

  const limitThumbValue = (thumbValue: number, i: number) => {
    if (thumbValue < min) thumbValue = min;
    if (thumbValue > max) thumbValue = max;
    if (i > 0 && thumbValue < value[i - 1]) {
      thumbValue = value[i - 1];
    }
    if (i < sliders.length - 1 && thumbValue > value[i + 1]) {
      thumbValue = value[i + 1];
    }
    return thumbValue;
  };

  const changeThumbValue = (index: number, newThumbValue: number) => {
    const newValue = [...value];
    newValue[index] = newThumbValue;
    onChange(newValue);
  };

  const handleThumbMove = (index: number, percentPos: number) => {
    const newThumbValue = percentToValue(percentPos, min, max, step);
    const limited = limitThumbValue(newThumbValue, index);
    changeThumbValue(index, limited);
  };

  const handleStep = (index: number, delta: number) => {
    const newThumbValue = limitThumbValue(value[index] + delta * step, index);
    changeThumbValue(index, newThumbValue);
  };

  const classNames = classnames('slider', { disabled, block }, className);

  return (
    <StyledDiv className={classNames}>
      <div className="slider-track">
        {sliders.map((key, i) => (
          <SliderThumb
            key={key}
            id={key}
            onMove={v => handleThumbMove(i, v)}
            onStep={d => handleStep(i, d)}
            percentPosition={valueToPercent(value[i], min, max)}
            disabled={disabled}
            thumbTabIndex={thumbTabIndex}
          />
        ))}
        {sliders.length > 0 && (
          <ActiveTrack
            percentLeft={valueToPercent(value[0], min, max)}
            percentRight={valueToPercent(value[sliders.length - 1], min, max)}
          />
        )}
      </div>
    </StyledDiv>
  );
});

export const Slider: React.FC<
  {
    value: number;
    onChange: (value: number) => void;
  } & SliderProps
> = props => {
  const { value, onChange = () => {}, ...rest } = props;
  return (
    <MultiSlider
      sliders={['value']}
      value={[value]}
      onChange={v => onChange(v[0])}
      {...rest}
    />
  );
};

export default Slider;
