import React from 'react';

import ColorPicker, { ColorPalette } from '../lib/ColorPicker';
import GradationEditor from '../lib/GradationEditor';
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

const GradationEditors = props => (
  <div>
    <GradationEditor {...props} />
    <hr />
    <GradationEditor block {...props} />
  </div>
);

const gradationInitialValue = [
  { position: 0, color: '#ff0000', alpha: 1 },
  { position: 50, color: '#00ff00', alpha: 0.5 },
  { position: 100, color: '#0000ff', alpha: 1 }
];

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
      <h3>Gradation Editor</h3>
      <ValuePreview initialValue={gradationInitialValue} canDisable>
        <GradationEditors />
      </ValuePreview>
    </div>
  );
};

export default ColorDemo;
