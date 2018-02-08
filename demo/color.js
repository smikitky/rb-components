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
  { position: 0, color: '#ff0000ff' },
  { position: 0.5, color: '#00ff0080' },
  { position: 1, color: '#0000ffff' }
];

const ColorDemo = () => {
  return (
    <div>
      <h3>Dropdown Color Pickers</h3>
      <ValuePreview initialValue={'#ff0000'} canDisable>
        <ColorPickers />
      </ValuePreview>
      <h4>With Alpha</h4>
      <ValuePreview initialValue={'#ff0000ff'} canDisable>
        <ColorPicker withAlpha showColorCode />
      </ValuePreview>
      <h3>Static Color Palette</h3>
      <ValuePreview initialValue={'#ff0000'} canDisable>
        <ColorPalette />
      </ValuePreview>
      <h4>With Alpha</h4>
      <ValuePreview initialValue={'#ff0000ff'} canDisable>
        <ColorPalette withAlpha />
      </ValuePreview>
      <h3>Gradation Editor</h3>
      <ValuePreview initialValue={gradationInitialValue} canDisable>
        <GradationEditors />
      </ValuePreview>
    </div>
  );
};

export default ColorDemo;
