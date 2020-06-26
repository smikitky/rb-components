import React from 'react';
import ShrinkSelect, { ShrinkSelectProps } from './ShrinkSelect';

const BlockSelect: React.FC<ShrinkSelectProps> = props => (
  <ShrinkSelect block {...props} />
);

export default BlockSelect;
