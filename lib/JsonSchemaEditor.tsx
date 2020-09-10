import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

const StyledDiv = styled.div<{ disabled?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1px 10px;
  line-height: 1.5em;
  opacity: ${(props: any) => (props.disabled ? 0.7 : 1.0)};
  input,
  select {
    border: 1px solid silver;
    min-width: 0;
    padding: 0 3px;
    &[disabled] {
      background: #ddd;
    }
    &.invalid {
      border-color: pink;
      background: #ffeeee;
    }
  }
  div.radios {
    border: 1px solid transparent;
    height: 1.4em;
    label {
      margin-right: 15px;
    }
    &.invalid {
      background: #ffeeee;
      border-color: pink;
    }
  }
  input[type='text'] {
    display: block;
    height: 1.4em;
  }
  select {
    display: block;
    height: 1.4em;
  }
`;

const ValidatingTextProp: React.FC<{
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onValidate: (valid: boolean) => void;
  validator: (value: string) => boolean;
  required?: boolean;
  onTextBlur?: () => void;
}> = props => {
  const { value, onChange, disabled, onValidate, validator, required } = props;

  const [input, setInput] = useState<string>(value || '');
  const [valid, setValid] = useState(false);

  const isValid = (val: string | undefined) => {
    return typeof val === 'undefined' ? !required : validator(val);
  };

  useEffect(
    () => {
      const valid = isValid(value);
      setValid(valid);
      onValidate(valid);
    },
    // eslint-disable-next-line
    []
  ); // only on first render

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
    const val: string | undefined = ev.target.value.length
      ? ev.target.value
      : undefined;
    const valid = isValid(val);
    setValid(valid);
    onValidate(valid);
    if (valid) onChange(val);
  };

  return (
    <input
      className={classnames({ invalid: !valid })}
      type="text"
      value={input}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};

type PropEdit<T> = React.FC<{
  value: T;
  onChange: (value: T | undefined) => void;
  disabled?: boolean;
  onValidate: (valid: boolean) => void;
  schema: PropSchema;
  required: boolean;
}>;

const StringProp: PropEdit<string> = props => {
  const { value, onChange, disabled, onValidate, schema, required } = props;
  const { pattern, minLength, maxLength } = schema;
  const validator = useCallback(
    val => {
      if (
        typeof minLength === 'number' &&
        minLength > 0 &&
        val.length < minLength
      )
        return false;
      if (
        typeof maxLength === 'number' &&
        maxLength > 0 &&
        val.length > maxLength
      )
        return false;
      if (typeof pattern === 'string') {
        if (!RegExp(pattern).test(val)) return false;
      }
      return true;
    },
    [maxLength, minLength, pattern]
  );
  return (
    <ValidatingTextProp
      value={value}
      onChange={onChange}
      disabled={disabled}
      onValidate={onValidate}
      required={required}
      validator={validator}
    />
  );
};

const NumberProp: PropEdit<number> = props => {
  const { value, onChange, disabled, onValidate, schema, required } = props;
  const { type, minimum, maximum, exclusiveMinimum, exclusiveMaximum } = schema;
  const isInt = type === 'integer';

  const validator = useCallback(
    (val: string) => {
      const pattern = isInt ? /^\-?\d+$/ : /^\-?\d+(\.\d+)?$/;
      if (!pattern.test(val)) return false;
      const parsed = Number(val);
      if (typeof minimum === 'number' && minimum > parsed) return false;
      if (typeof exclusiveMinimum === 'number' && exclusiveMinimum >= parsed)
        return false;
      if (typeof maximum === 'number' && maximum < parsed) return false;
      if (typeof exclusiveMaximum === 'number' && exclusiveMaximum <= parsed)
        return false;
      return true;
    },
    [exclusiveMaximum, exclusiveMinimum, isInt, maximum, minimum]
  );

  const handleChange = useCallback(
    (val: string | undefined) =>
      onChange(val === undefined ? undefined : Number(val)),
    [onChange]
  );

  return (
    <ValidatingTextProp
      value={typeof value === 'number' ? String(value) : undefined}
      onChange={handleChange}
      disabled={disabled}
      onValidate={onValidate}
      required={required}
      validator={validator}
    />
  );
};

const UNSELECTED = '*%*UNSELECTED*%*';

const EnumProp: PropEdit<any> = props => {
  const { value, onChange, disabled, onValidate, schema, required } = props;
  const { enum: options } = schema;
  const [input, setInput] = useState<string | number | undefined>(value);

  if (!options || !options.length) throw new Error('enum not set');

  useEffect(
    () => {
      if (value === undefined) {
        onValidate(!required);
      } else {
        onValidate(options.indexOf(value) >= 0);
      }
    },
    // eslint-disable-next-line
    []
  ); // only on first render

  const handleChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const index = ev.target.selectedIndex;
    if (index === 0) {
      setInput(undefined);
      if (!required) {
        onValidate(true);
        onChange(undefined);
      } else {
        onValidate(false);
      }
    } else {
      onValidate(true);
      setInput(options[index - 1]);
      onChange(options[index - 1]);
    }
  };

  const invalid = input === undefined ? required : options.indexOf(input) < 0;
  return (
    <select
      className={classnames({ invalid })}
      value={input || UNSELECTED}
      disabled={disabled}
      onChange={handleChange}
    >
      <option value={UNSELECTED} />
      {options.map((o, i) => (
        <option key={i} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

const BooleanProp: PropEdit<boolean> = props => {
  const { value, onChange, disabled, onValidate, required } = props;
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    onValidate(true);
    onChange(ev.target.value === 'true');
  };

  const valid =
    typeof value === 'boolean' || (!required && typeof value === 'undefined');

  useEffect(
    () => {
      onValidate(valid);
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div className={classnames('radios', { invalid: !valid })}>
      <label>
        <input
          type="radio"
          checked={value === true}
          value="true"
          disabled={disabled}
          onChange={handleChange}
        />
        true
      </label>
      <label>
        <input
          type="radio"
          checked={value === false}
          value="false"
          disabled={disabled}
          onChange={handleChange}
        />
        false
      </label>
    </div>
  );
};

const Prop: PropEdit<any> = props => {
  const { schema } = props;
  const Editor: PropEdit<any> = Array.isArray(schema.enum)
    ? EnumProp
    : {
        string: StringProp,
        number: NumberProp,
        integer: NumberProp,
        boolean: BooleanProp
      }[schema.type];
  if (!Editor) throw new TypeError('Unsupported value type');
  return <Editor {...props} />;
};

export interface PropSchema {
  type: 'string' | 'number' | 'integer' | 'boolean';
  // For enum
  enum?: (number | string)[];
  // For string type
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  // For number/integer type
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
}

export interface Schema<T extends object = any> {
  type: 'object';
  properties: {
    [key in keyof T]: PropSchema;
  };
  required?: (keyof T)[];
}

interface SchemaEditorProps<T extends object = any> {
  /**
   * The **initial** data object.
   * Ignored after the initial render.
   */
  value: Partial<T>;
  /**
   * The JSON schema subset used to check the input.
   */
  schema: Schema<T>;
  /**
   * Only called with data that passes the provided schema.
   */
  onChange: (value: Partial<T>) => void;
  /**
   * Called after the initial render and reports whether the
   * initial value is valid. Should be used if the initial `value`
   * may not be valid.
   */
  onValidate: (valid: boolean) => void;
  disabled?: boolean;
}

/**
 * Editor for key-value pairs whose shape is determiend by a subset of
 * JSON Schema.
 */
const JsonSchemaEditor = <T extends {} = any>(
  props: SchemaEditorProps<T>
): React.ReactElement | null => {
  const { value, onChange, disabled, onValidate, schema } = props;
  const [current, setCurrent] = useState({ ...value });
  const valids = useRef<Map<keyof T, boolean>>(new Map()).current;

  useEffect(() => {}, [value]);

  if (
    typeof schema !== 'object' ||
    ('type' in schema && schema.type !== 'object') ||
    ('properties' in schema && typeof schema.properties !== 'object')
  ) {
    throw new TypeError('Invalid or unsupported JSON schema');
  }
  if (!schema.properties) return null;

  const keys = Object.keys(schema.properties) as (keyof T)[];

  const required = Array.isArray(schema.required) ? schema.required : [];

  const handleChange = (key: keyof T, val: any) => {
    const newValue: any = { ...current, [key]: val };
    if (val === undefined) delete newValue[key];
    valids.set(key, true);
    setCurrent(newValue);
    if (keys.every(k => valids.get(k) === true)) onChange(newValue);
  };

  const handleValdate = (key: keyof T, valid: boolean) => {
    valids.set(key, valid);
    if (keys.every(k => valids.has(k))) {
      onValidate(keys.every(k => valids.get(k) === true));
    }
  };

  return (
    <StyledDiv disabled={disabled}>
      {keys.map(k => (
        <Fragment key={k as string}>
          <span>{k}</span>
          <Prop
            schema={schema.properties[k]}
            required={required.indexOf(k as any) >= 0}
            value={current[k]}
            disabled={disabled}
            onChange={val => handleChange(k, val)}
            onValidate={valid => handleValdate(k, valid)}
          />
        </Fragment>
      ))}
    </StyledDiv>
  );
};

export default JsonSchemaEditor;
