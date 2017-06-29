import React from 'react';

import ArrayEditor from '../lib/ArrayEditor';
import ValuePreview from './value-preview';
import ColorPicker from '../lib/ColorPicker';
import DropdownDatePicker from '../lib/DropdownDatePicker';
import Calendar from '../lib/Calendar';
import PropertyEditor from '../lib/PropertyEditor';

const ColorEditor = props => <ColorPicker showColorCode bsSize='sm' {...props} />;

const ColorArrayEditor = props => (
	<ArrayEditor editor={ColorEditor} newItemValue='#ffff88' {...props} />
);

const properties = [
	{ key: 'color', caption: 'Color', editor: ColorEditor },
	{ key: 'colors', caption: 'Colors', editor: ColorArrayEditor },
	{ key: 'date', caption: 'Date', editor: DropdownDatePicker },
	{ key: 'date2', caoption: 'Date 2', editor: Calendar }
];

const complaints = {
	date: 'This date is not valid.'
};

const PropertyEditorDemo = () => {
	return <div>
		<h3>Array Editor</h3>
		<ValuePreview initialValue={[]}>
			<ArrayEditor editor={ColorEditor} newItemValue='#ff00ff' />
		</ValuePreview>
		<h3>Property Editor</h3>
		<ValuePreview initialValue={[]}>
			<PropertyEditor properties={properties} complaints={complaints} />
		</ValuePreview>
	</div>;
};

export default PropertyEditorDemo;
