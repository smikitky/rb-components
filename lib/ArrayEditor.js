import React from 'react';
import classnames from 'classnames';
import IconButton from './IconButton';

export default class ArrayEditor extends React.PureComponent {
	change(index, newValue) {
		const { value, onChange } = this.props;
		const newList = value.slice();
		newList[index] = newValue;
		onChange && onChange(newList);
	}

	add() {
		const { editor, value, onChange } = this.props;
		const newList = value.slice();
		const newItem = editor.newItem instanceof Function ? editor.newItem(newList) : null;
		newList.push(newItem);
		onChange && onChange(newList);
	}

	remove(index) {
		const { value, onChange } = this.props;
		const newList = value.slice();
		newList.splice(index, 1);
		onChange && onChange(newList);
	}

	render() {
		const { value = [], editor: Editor, className } = this.props;
		const classNames = classnames('array-editor list-unstyled', className);
		return <ul className={classNames}>
			{value.map((item, i) => (
				<li key={i.toString()}>
					<Editor
						value={item}
						onChange={val => this.change(i, val)}
					/>
					<IconButton bsStyle='link' icon='remove' onClick={() => this.remove(i)} />
				</li>
			))}
			<li key='add'>
				<IconButton bsStyle='link' icon='plus' onClick={() => this.add()} />
			</li>
		</ul>;
	}
}