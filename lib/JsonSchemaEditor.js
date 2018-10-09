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
    const { onChange, validator } = this.props;
    if (this.isValid(val.length ? val : undefined, validator)) {
      this.setState({ input: val, valid: true });
      onChange(val.length ? val : undefined);
    } else {
      this.setState({ input: val, valid: false });
    }
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
      />
    );
  }
}

const StringProp = props => {
  const {
    value,
    schema: { pattern, minLength, maxLength },
    required,
    disabled,
    onChange
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
      value={value}
      required={required}
      disabled={disabled}
      onChange={onChange}
      validator={validator}
    />
  );
};

const NumberProp = props => {
  const {
    value,
    schema: { type, minimum, maximum, exclusiveMinimum, exclusiveMaximum },
    required,
    disabled,
    onChange
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

  const handleChange = val => {
    if (val === undefined) {
      onChange(val);
    } else {
      const parsed = isInt ? parseInt(val, 10) : parseFloat(val);
      onChange(parsed);
    }
  };

  return (
    <ValidatingTextProp
      value={value}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      validator={validator}
    />
  );
};

const EnumProp = props => {
  const {
    value,
    schema: { enum: options },
    required,
    disabled,
    onChange
  } = props;
  const handleChange = ev => {
    const index = ev.target.selectedIndex;
    onChange(index >= 1 ? options[index - 1] : undefined);
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
  const { value, schema, disabled, onChange } = props;
  const handleChange = ev => onChange(ev.target.checked);
  return (
    <input
      type="checkbox"
      checked={value}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};

const Prop = props => {
  const { schema, value, required, disabled, onChange } = props;
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
      value={value}
      required={required}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

const JsonSchemaEditor = props => {
  const { value, schema, onChange, disabled } = props;
  if (typeof schema !== 'object' || schema.type !== 'object') {
    throw new TypeError('Invalid or unsupported JSON schema');
  }

  const keys = Object.keys(schema.properties);
  const required = Array.isArray(schema.requiredProperties)
    ? schema.requiredProperties
    : [];

  const handleChange = (key, val) => {
    const newValue = { ...value, [key]: val };
    if (val === undefined) delete newValue[key];
    typeof onChange === 'function' && onChange(newValue);
  };

  return (
    <StyledDiv disabled={disabled}>
      {keys.map(k => (
        <Fragment key={k}>
          <span>{k}</span>
          <Prop
            schema={schema.properties[k]}
            required={required.indexOf(k) >= 0}
            value={value[k]}
            disabled={disabled}
            onChange={handleChange.bind(null, k)}
          />
        </Fragment>
      ))}
    </StyledDiv>
  );
};

export default JsonSchemaEditor;
