import React, { Fragment } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1px 10px;
  line-height: 1.5em;
  opacity: ${props => (props.disabled ? 0.7 : 1.0)};
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
  input {
    display: block;
    height: 1.4em;
  }
  select {
    display: block;
    height: 1.4em;
  }
`;

class ValidatingTextProp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      input: props.value || '',
      valid: this.isValid(props.value, props.validator)
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTextBlur = this.handleTextBlur.bind(this);
  }

  isValid(val, validator) {
    const { required } = this.props;
    if (typeof val === 'undefined') {
      return !required;
    } else {
      return validator(val);
    }
  }

  handleChange(ev) {
    const val = ev.target.value;
    const { keyName, onChange, validator } = this.props;
    if (this.isValid(val.length ? val : undefined, validator)) {
      this.setState({ input: val, valid: true });
      onChange(keyName, val.length ? val : undefined, true);
    } else {
      this.setState({ input: val, valid: false });
    }
  }

  componentDidUpdate(prevProps) {
    const { value, validator } = this.props;
    if (prevProps.value !== value) {
      this.setState({
        input: this.props.value || '',
        valid: this.isValid(value, validator)
      });
    }
  }

  handleTextBlur() {
    const { onTextBlur, keyName, value, validator } = this.props;
    this.setState({
      input: value || '',
      valid: this.isValid(value, validator)
    });
    typeof onTextBlur === 'function' && onTextBlur(keyName);
  }

  render() {
    const { disabled } = this.props;
    const { input, valid } = this.state;
    return (
      <input
        className={classnames({ invalid: !valid })}
        type="text"
        value={input}
        disabled={disabled}
        onChange={this.handleChange}
        onBlur={this.handleTextBlur}
      />
    );
  }
}

const StringProp = props => {
  const {
    keyName,
    value,
    schema: { pattern, minLength, maxLength },
    required,
    disabled,
    onChange,
    onTextBlur
  } = props;
  const validator = val => {
    if (minLength > 0 && val.length < minLength) return false;
    if (maxLength > 0 && val.length > maxLength) return false;
    if (typeof pattern === 'string') {
      if (!RegExp(pattern).test(val)) return false;
    }
    return true;
  };
  return (
    <ValidatingTextProp
      keyName={keyName}
      value={value}
      required={required}
      disabled={disabled}
      onChange={onChange}
      onTextBlur={onTextBlur}
      validator={validator}
    />
  );
};

const NumberProp = props => {
  const {
    keyName,
    value,
    schema: { type, minimum, maximum, exclusiveMinimum, exclusiveMaximum },
    required,
    disabled,
    onChange,
    onTextBlur
  } = props;
  const isInt = type === 'integer';

  const validator = val => {
    const pattern = isInt ? /^\-?\d+$/ : /^\-?\d+(\.\d+)?$/;
    if (!pattern.test(val)) return false;
    const parsed = isInt ? parseInt(val, 10) : parseFloat(val);
    if (typeof minimum === 'number' && minimum > parsed) return false;
    if (typeof exclusiveMinimum === 'number' && exclusiveMinimum >= parsed)
      return false;
    if (typeof maximum === 'number' && maximum < parsed) return false;
    if (typeof exclusiveMaximum === 'number' && exclusiveMaximum <= parsed)
      return false;
    return true;
  };

  const handleChange = (keyName, val) => {
    if (val === undefined) {
      onChange(keyName, undefined, true);
    } else {
      const parsed = isInt ? parseInt(val, 10) : parseFloat(val);
      onChange(keyName, parsed, true);
    }
  };

  return (
    <ValidatingTextProp
      keyName={keyName}
      value={value}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      onTextBlur={onTextBlur}
      validator={validator}
    />
  );
};

const EnumProp = props => {
  const {
    keyName,
    value,
    schema: { enum: options },
    required,
    disabled,
    onChange
  } = props;
  const handleChange = ev => {
    const index = ev.target.selectedIndex;
    onChange(keyName, index >= 1 ? options[index - 1] : undefined, false);
  };
  const invalid = value !== undefined ? options.indexOf(value) < 0 : required;
  return (
    <select
      className={classnames({ invalid })}
      value={value}
      disabled={disabled}
      onChange={handleChange}
    >
      <option value="" />
      {options.map((o, i) => (
        <option key={i} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

const BooleanProp = props => {
  const { keyName, value, disabled, onChange } = props;
  const handleChange = ev => onChange(keyName, ev.target.checked, false);
  return (
    <input
      type="checkbox"
      checked={!!value}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};

const Prop = props => {
  const {
    schema,
    keyName,
    value,
    required,
    disabled,
    onChange,
    onTextBlur
  } = props;
  const Editor = Array.isArray(schema.enum)
    ? EnumProp
    : {
        string: StringProp,
        number: NumberProp,
        integer: NumberProp,
        boolean: BooleanProp
      }[schema.type];
  if (!Editor) throw new TypeError('Unsupported value type');
  return (
    <Editor
      schema={schema}
      keyName={keyName}
      value={value}
      required={required}
      disabled={disabled}
      onChange={onChange}
      onTextBlur={onTextBlur}
    />
  );
};

const JsonSchemaEditor = props => {
  const { value, schema, onChange, onTextBlur, disabled } = props;

  if (
    typeof schema !== 'object' ||
    ('type' in schema && schema.type !== 'object') ||
    ('properties' in schema && typeof schema.properties !== 'object')
  ) {
    throw new TypeError('Invalid or unsupported JSON schema');
  }
  if (!schema.properties) return null;

  const keys = Object.keys(schema.properties);

  const required = Array.isArray(schema.requiredProperties)
    ? schema.requiredProperties
    : [];

  const handleChange = (key, val, isTextInput) => {
    const newValue = { ...value, [key]: val };
    if (val === undefined) delete newValue[key];
    typeof onChange === 'function' && onChange(newValue, isTextInput);
  };

  const handleTextBlur = key => {
    typeof onTextBlur === 'function' && onTextBlur(key);
  };

  return (
    <StyledDiv disabled={disabled}>
      {keys.map(k => (
        <Fragment key={k}>
          <span>{k}</span>
          <Prop
            schema={schema.properties[k]}
            required={required.indexOf(k) >= 0}
            keyName={k}
            value={value[k]}
            disabled={disabled}
            onChange={handleChange}
            onTextBlur={handleTextBlur}
          />
        </Fragment>
      ))}
    </StyledDiv>
  );
};

export default JsonSchemaEditor;
