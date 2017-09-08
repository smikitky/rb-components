import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconButton from './IconButton';

/**
 * Renders an editor for generic items.
 * The 'editor' is a React component that accepts 'value' and 'onChange'.
 */
export default class ArrayEditor extends React.PureComponent {
	change(index, newValue) {
		const { value, onChange } = this.props;
		const newList = value.slice();
		newList[index] = newValue;
		onChange && onChange(newList);
	}

	add() {
		const { value, newItemValue, onChange } = this.props;
		const newItem = newItemValue instanceof Function ?
			newItemValue(value) : newItemValue;
		const newList = value.concat(newItem);
		onChange && onChange(newList);
	}

	remove(index) {
		const { value, onChange } = this.props;
		const newList = value.slice();
		newList.splice(index, 1);
		onChange && onChange(newList);
	}

	render() {
		const { value, inline, editor: Editor, className } = this.props;
		const classNames = classnames('array-editor', { inline: inline }, className);
		return <ul className={classNames}>
			{value.map((item, i) => (
				<li key={i.toString()}>
					<Editor
						value={item}
						onChange={val => this.change(i, val)}
					/>
					<IconButton
						bsStyle='link'
						bsSize='xs'
						icon='remove'
						onClick={() => this.remove(i)}
					/>
				</li>
			))}
			<li key='add' className='add'>
				<IconButton
					bsStyle='link'
					bsSize='xs'
					icon='plus'
					onClick={() => this.add()}
				>
					Add
				</IconButton>
			</li>
		</ul>;
	}
}

ArrayEditor.defaultProps = {
	value: [],
	newItemValue: null
};

ArrayEditor.propTypes = {
	newItemValue: PropTypes.any,
	inline: PropTypes.bool,
	editor: PropTypes.func.isRequired
};
