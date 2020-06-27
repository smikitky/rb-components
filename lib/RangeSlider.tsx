import React from 'react';
import { MultiSlider, SliderProps } from './Slider';

const RangeSlider: React.FC<
  {
    value: number[];
    onChange: (value: number[]) => void;
  } & SliderProps
> = props => {
  return <MultiSlider sliders={['lo', 'hi']} {...props} />;
};

export default RangeSlider;
