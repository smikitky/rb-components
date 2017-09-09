import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import classnames from 'classnames';

const DefaultRenderer = props => <span>{props.caption}</span>;

const MultiSelectDropdown = props => {
	const {
		renderer: Renderer,
		value,
		showSelectedMax,
		noneText,
		glue,
		options,
		onItemChange,
		disabled
	} = props;

	let caption = [];
	if (value.length === 0) {
		caption = noneText;
	} else if (value.length > showSelectedMax) {
		caption = `${value.length} selected`;
	} else {
		value.forEach((sel, i) => {
			let renderItem = options[sel];
			if (i > 0) caption.push(glue);
			caption.push(<Renderer key={i} {...renderItem} />);
		});
	}

	const dropdown = <MultiSelectCheckboxArray
		renderer={Renderer}
		value={value}
		options={options}
		onItemChange={onItemChange}
	/>;

	return <Dropdown
		id='multiselect-dropdown-comp'
		className='multiselect'
		disabled={disabled}
	>
		<Dropdown.Toggle>{caption}</Dropdown.Toggle>
		<Dropdown.Menu className='multiselect-popover'>{dropdown}</Dropdown.Menu>
	</Dropdown>;
};

const MultiSelectCheckboxArray = props => {
	const {
		renderer: Renderer,
		value = [],
		options,
		onItemChange,
		disabled
	} = props;

	return <ul className={classnames('list-unstyled', 'multiselect-checkboxes', { 'text-muted': disabled })}>
		{Object.keys(options).map((key, i) => {
			const checked = value.some(sel => sel == key); // lazy equiality('==') needed
			const checkedClass = checked ? 'checked' : '';
			const renderItem = options[key];
			return (
				<li key={i}
					onClick={() => { !disabled && onItemChange(i, checked); }}
					className={checkedClass}
				>
					<input
						type='checkbox'
						checked={checked}
						readOnly
						disabled={disabled}
					/>&ensp;
					<Renderer {...renderItem} />
				</li>
			);
		})}
	</ul>;
};

/**
 * Dropdown + Multiselect component.
 */
export default function MultiSelect(props) {
	const { renderer = DefaultRenderer,
		showSelectedMax = 3,
		value = [],
		type = 'dropdown',
		glue = ', ',
		noneText = '(None)',
		onChange,
		disabled
	} = props;

	// Normalize options
	let options = { ... props.options };
	if (Array.isArray(props.options)) {
		options = {};
		props.options.forEach(opt => options[opt] = { caption: opt });
	}
	Object.keys(options).forEach(key => {
		if (typeof options[key] === 'string') options[key] = { caption: options[key] };
	});

	function onItemChange(clickedIndex, checked) {
		let newValue = [];
		Object.keys(options).forEach((key, i) => {
			const insertingKey = props.numericalValue ? parseFloat(key) : key;
			if (clickedIndex !== i) {
				if (value.indexOf(insertingKey) !== -1) newValue.push(insertingKey);
			} else {
				if (!checked) newValue.push(insertingKey);
			}
		});
		typeof onChange === 'function' && onChange(newValue);
	}

	if (type === 'dropdown') {
		return <MultiSelectDropdown
			value={value}
			disabled={disabled}
			options={options} renderer={renderer}
			glue={glue} showSelectedMax={showSelectedMax} noneText={noneText}
			onItemChange={onItemChange}
		/>;
	} else {
		return <MultiSelectCheckboxArray
			value={value}
			disabled={disabled}
			options={options} renderer={renderer}
			onItemChange={onItemChange}
		/>;
	}
}
