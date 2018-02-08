import React from 'react';

import ColorPicker, { ColorPalette } from '../lib/ColorPicker';
import GradationEditor, { buildGradationSteps } from '../lib/GradationEditor';
import ValuePreview from './value-preview';
import IconButton from '../lib/IconButton';

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

class GradationPreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.handleBuild = this.handleBuild.bind(this);
    this.state = { dataUrl: null, steps: 65536 };
  }

  handleBuild() {
    this.setState({ dataUrl: null });
    const { value } = this.props;
    const array = buildGradationSteps(value, this.state.steps);
    const blob = new Blob([array.buffer], {
      type: 'application/octet-stream'
    });
    var fr = new FileReader();
    fr.onload = ev => {
      this.setState({ dataUrl: ev.target.result });
    };
    fr.readAsDataURL(blob);
  }

  render() {
    const { value } = this.props;
    return (
      <div>
        {JSON.stringify(value)}
        <div>
          <IconButton bsSize="xs" icon="star" onClick={this.handleBuild}>
            Build Array
          </IconButton>
          <input
            type="number"
            value={this.state.steps}
            onChange={ev => this.setState({ steps: parseInt(ev.target.value) })}
          />
        </div>
        {this.state.dataUrl && (
          <div>
            <textarea style={{ width: '100%' }} value={this.state.dataUrl} />
          </div>
        )}
      </div>
    );
  }
}

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
      <ValuePreview
        initialValue={gradationInitialValue}
        canDisable
        previewer={GradationPreviewer}
      >
        <GradationEditors />
      </ValuePreview>
    </div>
  );
};

export default ColorDemo;
