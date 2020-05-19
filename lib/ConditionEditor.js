import React from 'react';
import PropTypes from 'prop-types';
import ShrinkSelect from './ShrinkSelect';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import BlockSelect from './BlockSelect';
import DropdownDatePicker from './DropdownDatePicker';
import moment from 'moment';
import normalizeOptions from './utils/normalizeOptions';
import styled from 'styled-components';

const escapeRegExp = str => {
  str = str + '';
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

const noop = () => {};

const StyledDiv = styled.div`
  padding: 0.3em;
  .condition-single-node,
  .condition-group-node {
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .condition-single-node {
    display: flex;
    .key-dropdown,
    .op-dropdown {
      margin-right: 3px;
    }
    .form-group {
      margin-bottom: 3px;
      flex-grow: 10;
    }
  }
  .condition-group-members {
    border-left: 3px solid silver;
    margin-left: 10px;
    padding-left: 10px;
  }
`;

export default function ConditionEditor(props) {
  const { keys, value, onChange, bsSize = undefined, disabled } = props;

  return (
    <StyledDiv className="condition-editor">
      <ConditionNode
        keys={keys}
        depth={0}
        onChange={onChange}
        onRemove={noop}
        value={value}
        bsSize={bsSize}
        disabled={disabled}
      />
    </StyledDiv>
  );
}

const ConditionNode = props => {
  const node = props.value;
  if (typeof node === 'object') {
    const isGroupNode = node.$and || node.$or;
    const NodeComp = isGroupNode ? GroupedCondition : SingleCondition;
    let additionalProps;

    if (isGroupNode) {
      const groupType = node.$and ? '$and' : '$or';
      additionalProps = {
        groupType,
        members: node[groupType]
      };
    } else {
      const { keyName, op, value } = node;
      additionalProps = { keyName, op, value };
    }
    return (
      <NodeComp
        keys={props.keys}
        index={props.index}
        onChange={props.onChange}
        onRemove={props.onRemove}
        depth={props.depth}
        bsSize={props.bsSize}
        siblingCount={props.siblingCount}
        disabled={props.disabled}
        {...additionalProps}
      />
    );
  }
  return <div>Error: Type error at depth {props.depth}</div>;
};

const GroupedCondition = props => {
  function memberChange(index, newObj) {
    const newMembers = props.members.slice();
    newMembers[index] = newObj;
    props.onChange({ [props.groupType]: newMembers });
  }

  function typeChange(type) {
    props.onChange({ [type]: props.members });
  }

  function deleteMember(index) {
    const newMembers = props.members.slice();
    newMembers.splice(index, 1);
    if (newMembers.length) {
      props.onChange({ [props.groupType]: newMembers });
    } else {
      props.onRemove(props.index);
    }
  }

  function addMemberClick() {
    const newMember = {
      keyName: Object.keys(props.keys)[0],
      op: '==',
      value: ''
    };
    props.onChange({ [props.groupType]: [...props.members, newMember] });
  }

  function addGroupClick() {
    const newCondition = {
      keyName: Object.keys(props.keys)[0],
      op: '==',
      value: ''
    };
    const newMember = { $or: [newCondition] };
    props.onChange({ [props.groupType]: [...props.members, newMember] });
  }

  return (
    <div className="condition-group-node">
      <AndOr
        value={props.groupType}
        onChange={type => typeChange(type)}
        bsSize={props.bsSize}
        disabled={props.disabled}
      />
      {props.depth > 0 && props.siblingCount > 1 ? (
        <ToolButton
          icon="remove"
          onClick={() => props.onRemove(props.index)}
          disabled={props.disabled}
        />
      ) : null}
      <div className="condition-group-members">
        {props.members.map((member, i) => (
          <ConditionNode
            keys={props.keys}
            index={i}
            depth={props.depth + 1}
            siblingCount={props.members.length}
            onChange={val => memberChange(i, val)}
            onRemove={deleteMember}
            bsSize={props.bsSize}
            key={i}
            value={member}
            disabled={props.disabled}
          />
        ))}
        <ToolButton
          bsSize={props.bsSize}
          icon="plus"
          onClick={addMemberClick}
          disabled={props.disabled}
        />
        <ToolButton
          bsSize={props.bsSize}
          icon="folder-open"
          onClick={addGroupClick}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};

const typeMap = {
  number: {
    operators: {
      '==': '=',
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<='
    },
    control: function NumberForm(props) {
      return (
        <FormControl
          type="number"
          bsSize={props.bsSize}
          value={props.value}
          onChange={ev => props.onChange(parseFloat(ev.target.value))}
          disabled={props.disabled}
        />
      );
    },
    convert: input => (isNaN(parseFloat(input)) ? 0 : parseFloat(input))
  },
  text: {
    operators: {
      '==': 'is',
      '!=': 'is not',
      '^=': 'begins with',
      '$=': 'ends with',
      '*=': 'contains'
    },
    control: function TextForm(props) {
      return (
        <FormControl
          type="text"
          bsSize={props.bsSize}
          value={props.value}
          onChange={ev => props.onChange(ev.target.value)}
          disabled={props.disabled}
        />
      );
    },
    convert: input => (input != undefined ? input.toString() : '')
  },
  select: {
    operators: {
      '==': 'is',
      '!=': 'is not'
    },
    control: function SelectForm(props) {
      return (
        <BlockSelect
          bsSize={props.bsSize}
          value={props.value}
          options={props.spec.options}
          onChange={props.onChange}
          disabled={props.disabled}
        />
      );
    },
    convert: (input, spec) => {
      const options = normalizeOptions(spec.options);
      if (input in options) return input;
      return Object.keys(options)[0];
    }
  },
  date: {
    operators: {
      '==': 'is',
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<='
    },
    control: function DateForm(props) {
      return (
        <DropdownDatePicker
          bsSize={props.bsSize}
          value={props.value}
          onChange={props.onChange}
          block
          disabled={props.disabled}
        />
      );
    },
    convert: input => {
      const fmt = 'YYYY-MM-DD';
      const tmp = moment(input, fmt);
      return tmp.isValid() ? tmp.format(fmt) : moment().format(fmt);
    }
  }
};

const SingleCondition = props => {
  if (!(props.keyName in props.keys)) {
    return <div>Error: Unknown key {props.keyName}</div>;
  }

  const valueType = props.keys[props.keyName].type;
  const valueSpec = props.keys[props.keyName].spec;
  const operators = typeMap[valueType].operators;
  const Control = typeMap[valueType].control;

  function keyChange(newKeyName) {
    const newKey = props.keys[newKeyName];
    let newOp = props.op;
    if (props.keys[props.keyName].type !== newKey.type) newOp = '==';
    let newValue = props.value;
    if (typeMap[newKey.type].convert) {
      newValue = typeMap[newKey.type].convert(newValue, newKey.spec);
    }
    props.onChange({ keyName: newKeyName, op: newOp, value: newValue });
  }

  function opChange(newOp) {
    props.onChange({ keyName: props.keyName, op: newOp, value: props.value });
  }

  function valueChange(newValue) {
    props.onChange({ keyName: props.keyName, op: props.op, value: newValue });
  }

  const keyOptions = {};
  Object.keys(props.keys).forEach(k => {
    keyOptions[k] = props.keys[k].caption;
  });

  return (
    <div className="condition-single-node">
      <ShrinkSelect
        options={keyOptions}
        value={props.keyName}
        bsSize={props.bsSize}
        className="key-dropdown"
        onChange={id => keyChange(id)}
        disabled={props.disabled}
      />
      <ShrinkSelect
        options={operators}
        value={props.op}
        bsSize={props.bsSize}
        className="op-dropdown"
        onChange={op => opChange(op)}
        disabled={props.disabled}
      />
      <FormGroup>
        <Control
          value={props.value}
          bsSize={props.bsSize}
          onChange={valueChange}
          spec={valueSpec}
          disabled={props.disabled}
        />
      </FormGroup>
      {props.siblingCount > 1 && (
        <ToolButton
          icon="remove"
          onClick={() => props.onRemove(props.index)}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};

const AndOr = props => {
  const options = { $and: 'AND', $or: 'OR' };
  return (
    <ShrinkSelect
      options={options}
      bsStyle="primary"
      bsSize={props.bsSize}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

const ToolButton = props => {
  return (
    <Button
      bsSize={props.bsSize}
      bsStyle="link"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Glyphicon glyph={props.icon} />
    </Button>
  );
};

/**
 * Converts ConditionEditor's output to API filter.
 * @param {object} condition
 * @param {string[]} dateFields
 */
export const conditionToMongoQuery = (condition, dateFields = []) => {
  const binary2obj = (key, op, value) => {
    if (dateFields.indexOf(key) >= 0) value = { $date: value };
    switch (op) {
      case '==':
        return { [key]: value };
      case '!=':
        return { [key]: { $ne: value } };
      case '>':
        return { [key]: { $gt: value } };
      case '<':
        return { [key]: { $lt: value } };
      case '>=':
        return { [key]: { $gte: value } };
      case '<=':
        return { [key]: { $lte: value } };
      case '^=':
        return { [key]: { $regex: '^' + escapeRegExp(value) } };
      case '$=':
        return { [key]: { $regex: escapeRegExp(value) + '$' } };
      case '*=':
        return { [key]: { $regex: escapeRegExp(value) } };
    }
  };

  if (Array.isArray(condition.$and)) {
    return {
      $and: condition.$and.map(m => conditionToMongoQuery(m, dateFields))
    };
  } else if (Array.isArray(condition.$or)) {
    return {
      $or: condition.$or.map(m => conditionToMongoQuery(m, dateFields))
    };
  } else if ('keyName' in condition) {
    return binary2obj(condition.keyName, condition.op, condition.value);
  }
};

const isSingleNode = PropTypes.shape({
  keyName: PropTypes.string.isRequired,
  op: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired
}).isRequired;

// lazy reference of isNode to define the recursive prop type
const _isNode = function () {
  return isNode.apply(this, arguments);
};

const isGroupNode = PropTypes.oneOfType([
  PropTypes.shape({ $and: PropTypes.arrayOf(_isNode).isRequired }),
  PropTypes.shape({ $or: PropTypes.arrayOf(_isNode).isRequired })
]).isRequired;

const isNode = PropTypes.oneOfType([isSingleNode, isGroupNode]).isRequired;

ConditionEditor.propTypes = {
  value: isGroupNode,
  onChange: PropTypes.func
};

ConditionEditor.defaultProps = { value: { $and: [] } };
