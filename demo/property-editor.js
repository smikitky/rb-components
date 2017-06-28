import React from 'react';

import ArrayEditor from '../lib/ArrayEditor';
import ValuePreview from './value-preview';
import ColorPicker from '../lib/ColorPicker';

const editor = props => <ColorPicker showColorCode bsSize='sm' {...props} />;

const PropertyEditorDemo = () => {
	return <div>
		<h3>Array Editor</h3>
		<ValuePreview initialValue={[]} >
			<ArrayEditor editor={editor} />
		</ValuePreview>
	</div>;
};

export default PropertyEditorDemo;
