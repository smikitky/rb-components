import React from 'react';

import ColorPicker, { ColorPalette } from '../lib/ColorPicker';
import ValuePreview from './value-preview';

const ColorPickers = props => (
  <div>
    <h4>Inline</h4>
    <ColorPicker showColorCode {...props} />
    &ensp;
    <ColorPicker bsSize="xs" {...props} />
    &ensp;
    <ColorPicker noCaret {...props} />
    &ensp;
    <ColorPicker noCaret showColorCode {...props} />
    &ensp;
    <ColorPicker boxPreview showColorCode {...props} />
    <h4>Block</h4>
    <ColorPicker block boxPreview showColorCode bsSize="sm" {...props} />
  </div>
);

const ColorDemo = () => {
  return (
    <div>
      <h3>Dropdown Color Pickers</h3>
      <ValuePreview initialValue={'#ff0000'} canDisable>
        <ColorPickers />
      </ValuePreview>
      <h3>Static Color Palette</h3>
      <ValuePreview initialValue={'#ff0000'} canDisable>
        <ColorPalette />
      </ValuePreview>
    </div>
  );
};

export default ColorDemo;
