import React from 'react';
import ValuePreview from './value-preview';
import JsonSchemaEditor from '../lib/JsonSchemaEditor';

const schema = {
  type: 'object',
  properties: {
    age: { type: 'integer' },
    hex: { type: 'string', pattern: '^[a-fA-F0-9]+$' },
    job: { enum: ['manager', 'director', 100] },
    chk: { type: 'boolean' }
  }
};

const schema2 = {
  ...schema,
  requiredProperties: ['age', 'hex', 'job', 'chk']
};

const JsonSchemaEditorDemo = () => {
  return (
    <div>
      <h3>JSON Schema Editor</h3>
      <p>
        <code>JsonSchemaEditor</code> is a key-value editor that supports a very
        limited subset of JSON Schema.
      </p>
      <ul>
        <li>
          The root must be <code>type: object</code> with{' '}
          <code>properties: ...</code>.
        </li>
        <li>
          Each entry in <code>properties</code> must either 1) have an
          appropriate scalar type (<code>string</code>, <code>number</code>,{' '}
          <code>integer</code>, <code>boolean</code>
          ), or 2) have <code>enum</code>.
        </li>
      </ul>

      <h3>Optional Values</h3>
      <ValuePreview initialValue={{}} canDisable>
        <JsonSchemaEditor schema={schema} />
      </ValuePreview>
      <h3>Requried Values</h3>
      <ValuePreview initialValue={{}} canDisable>
        <JsonSchemaEditor schema={schema2} />
      </ValuePreview>
    </div>
  );
};

export default JsonSchemaEditorDemo;
