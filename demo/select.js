import React from 'react';
import ShrinkSelect from '../lib/ShrinkSelect';
import BlockSelect from '../lib/BlockSelect';
import MultiSelect from '../lib/MultiSelect';
import ValuePreview from './value-preview';

const options = ['Apple', 'Banana', 'Grape', 'Lemon', 'Melon', 'Orange'];

const CustomRenderer = props => {
  const { renderAs, caption } = props;
  const color = renderAs === 'select' ? 'pink' : 'yellow';
  const style = { border: `1px solid ${color}`, padding: '1px 3px' };
  return <span style={style}>{caption}</span>;
};

export const ShrinkSelectDemo = () => {
  return (
    <div>
      <h3>ShrinkSelect</h3>
      <p>
        Like <code>&lt;select&gt;</code>, but resizes itself according to the
        selection.
      </p>
      <ValuePreview initialValue={options[0]} canDisable>
        <ShrinkSelect options={options} />
      </ValuePreview>
      <h3>BlockSelect</h3>
      <p>
        Like <code>&lt;select&gt;</code>, but has the same appearance as{' '}
        <code>ShrinkSelect</code>.
      </p>
      <ValuePreview initialValue={options[0]}>
        <BlockSelect options={options} />
      </ValuePreview>
      <h3>MultiSelect</h3>
      <ValuePreview initialValue={[]} canDisable>
        <MultiSelect options={options} />
      </ValuePreview>
      <h3>With Custom Renderer</h3>
      <ValuePreview initialValue={[]} canDisable>
        <MultiSelect options={options} renderer={CustomRenderer} />
      </ValuePreview>
      <h3>MultiSelect Checkbox Array</h3>
      <ValuePreview initialValue={[]} canDisable>
        <MultiSelect options={options} type="checkbox" />
      </ValuePreview>
    </div>
  );
};

export default ShrinkSelectDemo;
