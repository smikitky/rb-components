import React from 'react';
import ArrayEditor from '../lib/ArrayEditor';
import ValuePreview from './value-preview';
import ColorPicker from '../lib/ColorPicker';
import DropdownDatePicker from '../lib/DropdownDatePicker';
import Calendar from '../lib/Calendar';
import PropertyEditor from '../lib/PropertyEditor';
import Slider, { Range } from '../lib/Slider';
import * as types from '../lib/editor-types';

const ColorEditor = props => <ColorPicker showColorCode bsSize='sm' {...props} />;

const ColorArrayEditor = types.inlineArrayOf(ColorEditor, '#ffff88');

const properties = [
	{
		key: 'text',
		caption: 'Text',
		editor: types.text({
			placeholder: 'zip code (111-2222)',
			regex: /^\d{0,3}\-?\d{0,4}$/
		})
	},
	{ key: 'number', caption: 'Number', editor: types.number({ placeholder: 'age', min: 0, max: 10 }) },
	{ key: 'integer', caption: 'Int', editor: types.integer() },
	{ key: 'check', caption: 'Check', editor: types.checkbox({ label: 'yes' }) },
	{ key: 'textarea', editor: types.textarea() },
	{ key: 'color', caption: 'Color', editor: ColorEditor },
	{ key: 'colors', caption: 'Colors', editor: ColorArrayEditor },
	{ key: 'date', caption: 'Date', editor: DropdownDatePicker },
	{ key: 'date2', caption: 'Date 2', editor: Calendar },
	{ key: 'slider', caption: 'Slider', editor: Slider },
	{ key: 'range', caption: 'Range', editor: Range }
];

const complaints = {
	date: 'This is an example error message.'
};

const PropertyEditorDemo = () => {
	return <div>
		<h3>Array Editor</h3>
		<ValuePreview initialValue={[]} canDisable>
			<ArrayEditor
				editor={ColorEditor}
				newItemValue={() => Math.random() > 0.5 ? '#ff00ff' : '#00ffff'}
			/>
		</ValuePreview>
		<h3>Property Editor</h3>
		<ValuePreview initialValue={{}} canDisable>
			<PropertyEditor properties={properties} complaints={complaints} />
		</ValuePreview>
	</div>;
};

export default PropertyEditorDemo;
