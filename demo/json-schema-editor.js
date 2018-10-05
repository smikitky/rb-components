import React from 'react';
import ValuePreview from './value-preview';
import JsonSchemaEditor from '../lib/JsonSchemaEditor';

const schema = {
  type: 'object',
  properties: {
    age: { type: 'integer' },
    zip: { type: 'string', pattern: '^\\d{3}\\-\\d{4}$' },
    job: { enum: ['manager', 'director'] },
    chk: { type: 'boolean' }
  }
};

const JsonSchemaEditorDemo = () => {
  return (
    <div>
      <h3>JSON Schema Editor</h3>
      <p>
        <code>JsonSchemaEditor</code> is a key-value editor that supports a very
        limited subset of JSON Schema.
      </p>
      <ValuePreview initialValue={{}} canDisable>
        <JsonSchemaEditor schema={schema} />
      </ValuePreview>
    </div>
  );
};

export default JsonSchemaEditorDemo;
