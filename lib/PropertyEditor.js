import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

export default class PropertyEditor extends React.PureComponent {
	handleChange(key, val) {
		const { value, onChange } = this.props;
		const newValues = { ... value };
		newValues[key] = val;
		typeof onChange === 'function' && onChange(newValues);
	}

	render() {
		const {
			value,
			complaints,
			properties,
			className
		} = this.props;

		const rows = properties.map(property => {
			if (typeof property === 'string') {
				return <h3>{property}</h3>;
			}
			const { key, caption, editor: Component } = property;
			const complain = complaints[key];
			const row = [
				<div key={key} className={classnames('row', { 'bg-danger' : complain })}>
					<div className='col-md-3'>
						<ControlLabel>{caption ? caption : key}</ControlLabel>
					</div>
					<div className='col-md-9'>
						<Component
							value={value[key]}
							onChange={val => this.handleChange(key, val)}
						/>
					</div>
				</div>
			];
			if (complain) {
				row.push(<div className='text-danger complaint'>
					{complain}
				</div>);
			}
			return row;
		});

		const classNames = classnames(
			'property-editor',
			'form-horizontal',
			className
		);

		return <div className={classNames}>{rows}</div>;
	}
}

PropertyEditor.defaultProps = {
	value: {},
	properties: [],
	complaints: {}
};

PropertyEditor.propTypes = {
	value: PropTypes.object,
	properties: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		caption: PropTypes.node,
		editor: PropTypes.func.isRequired
	})).isRequired,
	complaints: PropTypes.object
};
