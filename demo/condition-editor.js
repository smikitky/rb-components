import React from 'react';

import ConditionEditor from '../lib/ConditionEditor';
import ValuePreview from './value-preview';

const keys = {
	age: { caption: 'age', type: 'number' },
	firstName: { caption: 'first name', type: 'text' },
	familyName: { caption: 'family name', type: 'text' },
	sex: {
		caption: 'sex', type: 'select',
		spec: { options: ['M', 'F', 'O']}
	}
};

const initialValue = {
	'$and': [
		{ keyName: 'age', op: '==', value: 30 }
	]
};

const ConditionEditorDemo = () => {
	return <ValuePreview
		component={ConditionEditor}
		keys={keys}
		initialValue={initialValue}
	/>;
};

export default ConditionEditorDemo;
