import React from 'react';
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
import { Sizes } from 'react-bootstrap';
import { normalizeRelative } from './RelativeDatePicker';

const escapeRegExp = (str: string) => {
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

export interface Keys {
  [key: string]: {
    type: KeyType;
    caption: string;
    spec: any;
  };
}

export type Operator =
  | '=='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | '^='
  | '$='
  | '*=';

export interface SingleNode {
  keyName: string;
  op: Operator;
  value: any;
}

export type GroupNode = { $and: Node[] } | { $or: Node[] };

export type Node = GroupNode | SingleNode;

export type Condition = GroupNode;

type MongoQueryOperator =
  | { $ne: any }
  | { $gt: any }
  | { $lt: any }
  | { $gte: any }
  | { $lte: any }
  | { $regex: string };

type MongoQuery = {
  [key: string]: any | MongoQueryOperator;
};

type MongoQueryLogicalOperator =
  | {
      $and: MongoQuery[];
    }
  | {
      $or: MongoQuery[];
    };

type MongoQueryResult = MongoQuery | MongoQueryLogicalOperator;

const ConditionEditor: React.FC<{
  keys: Keys;
  value: Condition;
  onChange: (value: Condition) => void;
  bsSize?: Sizes;
  disabled?: boolean;
}> = props => {
  const {
    keys,
    value = { $and: [] },
    onChange,
    bsSize = undefined,
    disabled
  } = props;

  return (
    <StyledDiv className="condition-editor">
      <ConditionNode
        keys={keys}
        value={value}
        depth={0}
        index={0}
        siblingCount={1}
        onChange={onChange}
        onRemove={noop}
        bsSize={bsSize}
        disabled={disabled}
      />
    </StyledDiv>
  );
};

export default ConditionEditor;

interface NodeEditorProps<T> {
  keys: Keys;
  value: T;
  onChange: (node: T) => void;
  onRemove: (index: number) => void;
  depth: number;
  index: number;
  siblingCount: number;
  bsSize?: Sizes;
  disabled?: boolean;
}

type NodeEditor<T extends Node> = React.FC<NodeEditorProps<T>>;

const ConditionNode = <T extends Node>(
  props: NodeEditorProps<T>
): React.ReactElement => {
  const node = props.value;
  if (typeof node === 'object') {
    const isGroupNode = '$and' in node || '$or' in node;
    const NodeComp: NodeEditor<any> = isGroupNode
      ? GroupedCondition
      : SingleCondition;
    return (
      <NodeComp
        keys={props.keys}
        value={props.value}
        index={props.index}
        onChange={props.onChange}
        onRemove={props.onRemove}
        depth={props.depth}
        bsSize={props.bsSize}
        siblingCount={props.siblingCount}
        disabled={props.disabled}
      />
    );
  }
  return <div>Error: Type error at depth {props.depth}</div>;
};

const GroupedCondition: NodeEditor<GroupNode> = props => {
  const members: Node[] =
    '$and' in props.value ? props.value.$and : props.value.$or;
  const groupType = '$and' in props.value ? '$and' : '$or';

  const handleMemberChange = (index: number, newObj: Node) => {
    const newMembers = members.slice();
    newMembers[index] = newObj;
    props.onChange({ [groupType]: newMembers } as GroupNode);
  };

  const handleTypeChange = (type: '$and' | '$or') => {
    props.onChange({ [type]: members } as GroupNode);
  };

  const handleDeleteMember = (index: number) => {
    const newMembers = members.slice();
    newMembers.splice(index, 1);
    if (newMembers.length) {
      props.onChange({ [groupType]: newMembers } as GroupNode);
    } else {
      props.onRemove(props.index);
    }
  };

  const handleAddMember = () => {
    const newMember: SingleNode = {
      keyName: Object.keys(props.keys)[0],
      op: '==',
      value: ''
    };
    props.onChange({
      [groupType]: [...members, newMember]
    } as GroupNode);
  };

  const handleAddGroup = () => {
    const newCondition: SingleNode = {
      keyName: Object.keys(props.keys)[0],
      op: '==',
      value: ''
    };
    const newMember: GroupNode = { $or: [newCondition] };
    props.onChange({
      [groupType]: [...members, newMember]
    } as GroupNode);
  };

  return (
    <div className="condition-group-node">
      <AndOr
        value={groupType}
        onChange={handleTypeChange}
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
        {members.map((member, i) => (
          <ConditionNode
            key={i}
            keys={props.keys}
            value={member}
            onChange={val => handleMemberChange(i, val)}
            onRemove={handleDeleteMember}
            depth={props.depth + 1}
            index={i}
            siblingCount={members.length}
            bsSize={props.bsSize}
            disabled={props.disabled}
          />
        ))}
        <ToolButton
          bsSize={props.bsSize}
          icon="plus"
          onClick={handleAddMember}
          disabled={props.disabled}
        />
        <ToolButton
          bsSize={props.bsSize}
          icon="folder-open"
          onClick={handleAddGroup}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};

type KeyType = 'number' | 'text' | 'select' | 'date';

const typeMap: {
  [type in KeyType]: {
    operators: { [op: string]: string };
    control: React.ComponentType<{
      spec: any;
      value: any;
      onChange: (value: any) => void;
      bsSize?: Sizes;
      disabled?: boolean;
    }>;
    convert: (input: any, spec: any) => any;
  };
} = {
  number: {
    operators: {
      '==': '=',
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<='
    },
    control: props => {
      return (
        <FormControl
          type="number"
          bsSize={props.bsSize}
          value={props.value}
          onChange={ev => props.onChange(parseFloat((ev as any).target.value))}
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
    control: props => {
      return (
        <FormControl
          type="text"
          bsSize={props.bsSize}
          value={props.value}
          onChange={ev => props.onChange((ev as any).target.value)}
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
    control: props => {
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
    control: props => {
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

const SingleCondition: NodeEditor<SingleNode> = props => {
  const { keyName, op, value } = props.value;

  if (!(keyName in props.keys)) {
    return <div>Error: Unknown key {keyName}</div>;
  }

  const valueType = props.keys[keyName].type;
  const valueSpec = props.keys[keyName].spec;
  const operators = typeMap[valueType].operators;
  const Control = typeMap[valueType].control;

  const handleKeyChange = (newKeyName: string) => {
    const newKey = props.keys[newKeyName];
    let newOp = op;
    if (props.keys[keyName].type !== newKey.type) newOp = '==';
    let newValue = value;
    newValue = typeMap[newKey.type].convert(newValue, newKey.spec);
    props.onChange({ keyName: newKeyName, op: newOp, value: newValue });
  };

  const handleOpChange = (newOp: Operator) => {
    props.onChange({ keyName, op: newOp, value });
  };

  const handleValueChange = (newValue: any) => {
    props.onChange({ keyName, op, value: newValue });
  };

  const keyOptions: { [key: string]: string } = {};
  Object.keys(props.keys).forEach(k => {
    keyOptions[k] = props.keys[k].caption;
  });

  return (
    <div className="condition-single-node">
      <ShrinkSelect
        options={keyOptions}
        value={keyName}
        bsSize={props.bsSize}
        className="key-dropdown"
        onChange={id => handleKeyChange(id as string)}
        disabled={props.disabled}
      />
      <ShrinkSelect
        options={operators}
        value={op}
        bsSize={props.bsSize}
        className="op-dropdown"
        onChange={op => handleOpChange(op as Operator)}
        disabled={props.disabled}
      />
      <FormGroup>
        <Control
          value={value}
          bsSize={props.bsSize}
          onChange={handleValueChange}
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

const AndOr: React.FC<{
  value: '$and' | '$or';
  onChange: (value: '$and' | '$or') => void;
  bsSize?: Sizes;
  disabled?: boolean;
}> = props => {
  const options = { $and: 'AND', $or: 'OR' };

  return (
    <ShrinkSelect
      options={options}
      bsStyle="primary"
      bsSize={props.bsSize}
      value={props.value}
      onChange={props.onChange as (value: string | number) => void}
      disabled={props.disabled}
    />
  );
};

const ToolButton: React.FC<{
  icon: string;
  onClick: () => void;
  bsSize?: Sizes;
  disabled?: boolean;
}> = props => {
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
 */
export const conditionToMongoQuery = (
  condition: Node,
  dateFields: string[] = [],
  useNormalizeRelative: boolean = false,
  asUtc: boolean = false
): MongoQueryResult => {
  const binary2obj4date = (key: string, op: Operator, value: any) => {
    const dateValue = {
      $date: normalizeRelative(value, false, asUtc)
    };
    const nextDateValue = {
      $date: normalizeRelative(value, true, asUtc)
    };
    switch (op) {
      case '==':
        return [
          { [key]: { $gte: dateValue } },
          { [key]: { $lt: nextDateValue } }
        ];
      case '!=':
        return [
          { [key]: { $lt: dateValue } },
          { [key]: { $gte: nextDateValue } }
        ];
      case '>':
        return { [key]: { $gte: nextDateValue } };
      case '<':
        return { [key]: { $lt: dateValue } };
      case '>=':
        return { [key]: { $gte: dateValue } };
      case '<=':
        return { [key]: { $lt: nextDateValue } };
      default:
        throw new Error('Invalid operator for date field');
    }
  };
  const binary2obj = (key: string, op: Operator, value: any) => {
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

  if ('$and' in condition) {
    return {
      $and: condition.$and.flatMap((m: Node) =>
        conditionToMongoQuery(m, dateFields, useNormalizeRelative)
      )
    };
  } else if ('$or' in condition) {
    return {
      $or: condition.$or.flatMap((m: Node) =>
        conditionToMongoQuery(m, dateFields, useNormalizeRelative)
      )
    };
  } else if ('keyName' in condition) {
    return useNormalizeRelative && dateFields.indexOf(condition.keyName) >= 0
      ? binary2obj4date(condition.keyName, condition.op, condition.value)
      : binary2obj(condition.keyName, condition.op, condition.value);
  } else {
    throw new Error('Malformed node');
  }
};
