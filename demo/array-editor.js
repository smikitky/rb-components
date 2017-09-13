import React from 'react';
import ValuePreview from './value-preview';
import ArrayEditor from '../lib/ArrayEditor';
import ColorPicker from '../lib/ColorPicker';
import DropdownDatePicker from '../lib/DropdownDatePicker';
import * as EditorTypes from '../lib/editor-types';

const ColorEditor = props => <span>
	C: <ColorPicker showColorCode bsSize='sm' {...props} />
</span>;

const newItem = () => {
	const colors = ['#ff00ff', '#00ffff', '#ffff00'];
	return colors[Math.floor(Math.random() * colors.length)];
};

const ColorArrayEditors = props => <div>
	<h4>Default</h4>
	<ArrayEditor editor={ColorPicker} newItemValue={newItem} {...props} />
	<h4>With Small Wrapping Component</h4>
	<ArrayEditor editor={ColorEditor} newItemValue={newItem} {...props} />
	<h4>Inline</h4>
	<ArrayEditor inline editor={ColorPicker} newItemValue={newItem} {...props} />
</div>;

const ArrayOfSelections = EditorTypes.inlineArrayOf(
	EditorTypes.shrinkSelect(['Vega', 'Sirius', 'Altair', 'Fomalhaut', 'Mira', 'Procyon']),
	'Vega'
);

const ArrayEditorDemo = () => {
	return <div>
		<h3>Array Editor</h3>
		<p>
			<code>ArrayEditor</code> wraps an &quot;editor&quot; and
			renders an editable list of it.
			An &quot;editor&quot; is any component that takes <code>value</code>,
			<code>onChange(newValue)</code> and <code>disabled</code>.
		</p>
		<ValuePreview initialValue={['#ff0000']} canDisable>
			<ColorArrayEditors />
		</ValuePreview>
		<h3>Array of Dates</h3>
		<ValuePreview initialValue={['2017-05-05']} canDisable>
			<ArrayEditor
				inline
				editor={DropdownDatePicker}
				newItemValue='2020-12-31'
			/>
		</ValuePreview>
		<h3>Array of Selections</h3>
		<ValuePreview initialValue={['Sirius']} canDisable>
			<ArrayOfSelections />
		</ValuePreview>
	</div>;
};

export default ArrayEditorDemo;
