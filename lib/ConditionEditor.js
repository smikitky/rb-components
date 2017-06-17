import React from 'react';
import ShrinkSelect from './ShrinkSelect';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const escapeRegExp = str => {
	str = str + '';
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

const noop = () => {};

export default function ConditionEditor(props) {
	const { keys, value, onChange } = props;

	return <div className="condition-editor">
		<ConditionNode keys={keys}
			depth={0}
			onChange={onChange}
			onRemove={noop}
			value={value}
		/>
	</div>;
}

const ConditionNode = props => {
	const node = props.value;
	if (typeof node === 'object') {
		if (node.$and || node.$or) {
			// group node
			const key = node.$and ? '$and' : '$or';
			const members = node[key];
			return <GroupedCondition
				keys={props.keys}
				index={props.index}
				onChange={props.onChange}
				onRemove={props.onRemove}
				depth={props.depth}
				groupType={key}
				members={members}
			/>;
		} else if (node.keyName !== undefined && node.op !== undefined) {
			const { keyName, op, value } = node;
			return <SingleCondition
				keys={props.keys}
				index={props.index}
				memberCount={props.memberCount}
				onChange={props.onChange}
				onRemove={props.onRemove}
				depth={props.depth}
				keyName={keyName}
				op={op}
				value={value}
			/>;
		} else {
			return <div>Error: Malformed node at depth {props.depth}</div>
		}
	}
	return <div>Error: Type error at depth {props.depth}</div>;
};

const GroupedCondition = props => {
	function memberChange(index, newObj) {
		let newMembers = props.members.slice();
		newMembers[index] = newObj;
		props.onChange({ [props.groupType]: newMembers });
	}

	function typeChange(type) {
		props.onChange({ [type]: props.members });
	}

	function deleteMember(index) {
		let newMembers = props.members.slice();
		newMembers.splice(index, 1);
		if (newMembers.length) {
			props.onChange({ [props.groupType]: newMembers });
		} else {
			props.onRemove(props.index);
		}
	}

	function addMemberClick() {
		let newMember = { keyName: Object.keys(props.keys)[0], op: '==', value: '' };
		props.onChange({ [props.groupType]: [...props.members, newMember] });
	}

	function addGroupClick() {
		let newCondition = { keyName: Object.keys(props.keys)[0], op: '==', value: '' };
		let newMember = { $or: [newCondition] };
		props.onChange({ [props.groupType]: [...props.members, newMember] });
	}

	return <div className="condition-group-node">
		<AndOr value={props.groupType} onChange={type => typeChange(type)} />
		{props.depth > 0 ?
			<ToolButton icon="remove" onClick={() => props.onRemove(props.index)} />
		: null}
		<div className="condition-group-members">
			{props.members.map((member, i) => (
				<ConditionNode keys={props.keys} index={i} depth={props.depth + 1}
					memberCount={props.members.length}
					onChange={val => memberChange(i, val)}
					onRemove={deleteMember}
					key={i} value={member}
				/>
			))}
			<ToolButton icon="plus" onClick={addMemberClick} />
			<ToolButton icon="folder-open" onClick={addGroupClick} />
		</div>
	</div>;
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
			return <FormControl
				type='number'
				value={props.value}
				onChange={ev => props.onChange(parseFloat(ev.target.value))}
			/>;
		}
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
			return <FormControl
				type='text'
				value={props.value}
				onChange={ev => props.onChange(ev.target.value)}
			/>;
		}
	},
	select: {
		operators: {
			'==': 'is',
			'!=': 'is not'
		},
		control: function SelectForm(props) {
			let options = props.spec.options;
			if (Array.isArray(options)) {
				const tmp = {};
				options.forEach(item => tmp[item] = item);
				options = tmp;
			}
			return <FormControl componentClass='select'
				value={props.value}
				onChange={ev => props.onChange(ev.target.value)}
			>
				<option value="" hidden />
				{Object.keys(options).map(k =>
					<option value={k} key={k}>{options[k]}</option>
				)}
			</FormControl>
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

	function keyChange(newId) {
		let op = props.op;
		if (props.keys[props.keyName].type != props.keys[newId].type) op = '==';
		props.onChange({ keyName: newId, op, value: props.value });
	}

	function opChange(newOp) {
		props.onChange({ keyName: props.keyName, op: newOp, value: props.value });
	}

	function valueChange(newValue) {
		props.onChange({ keyName: props.keyName, op: props.op, value: newValue });
	}

	let options = {};
	Object.keys(props.keys).forEach(k => {
		options[k] = props.keys[k].caption;
	});

	return <div className="condition-single-node">
		<ShrinkSelect options={options} value={props.keyName} size="sm"
			onChange={id => keyChange(id)}
		/>
		<ShrinkSelect options={operators} value={props.op} size="sm"
			onChange={op => opChange(op)}
		/>
		<FormGroup bsSize="sm">
			{<Control value={props.value} onChange={valueChange} spec={valueSpec}/>}
		</FormGroup>
		{ props.memberCount > 1 ?
			<ToolButton icon="remove" onClick={() => props.onRemove(props.index)} />
		: null }
	</div>;
};

const AndOr = props => {
	let options = { $and: 'AND', $or: 'OR' };
	return <ShrinkSelect options={options} bsStyle="primary" size="sm"
		value={props.value} onChange={props.onChange}
	/>;
};

const ToolButton = props => {
	return <Button bsSize="small" bsStyle="link" onClick={props.onClick}>
		<Glyphicon glyph={props.icon} />
	</Button>
};

export const conditionToMongoQuery = condition => {
	function binary2obj(key, op, value) {
		switch (op) {
			case '==':
				return {[key]: value};
			case '!=':
				return {[key]: {$ne: value}};
			case '>':
				return {[key]: {$gt: value}};
			case '<':
				return {[key]: {$lt: value}};
			case '>=':
				return {[key]: {$gte: value}};
			case '<=':
				return {[key]: {$lte: value}};
			case '^=':
				return {[key]: {$regex: '^' + escapeRegExp(value)}};
			case '$=':
				return {[key]: {$regex: escapeRegExp(value) + '$'}};
			case '*=':
				return {[key]: {$regex: escapeRegExp(value)}};
		}
	}

	if (Array.isArray(condition.$and)) {
		return { $and: condition.$and.map(m => conditionToMongoQuery(m))};
	} else if (Array.isArray(condition.$or)) {
		return { $or: condition.$or.map(m => conditionToMongoQuery(m))};
	} else if ('keyName' in condition) {
		return binary2obj(condition.keyName, condition.op, condition.value);
	}
};
