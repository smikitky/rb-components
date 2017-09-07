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
			bsClass, // for overriding default class
			className, // for providing other classes along with the default one
			rowClassName, keyClassName, valueClassName,
			hasComplaintClassName, complaintClassName
		} = this.props;

		const rows = properties.map(property => {
			if (typeof property === 'string') {
				return <h3>{property}</h3>;
			}
			const { key, caption, editor: Component, className } = property;
			const hasComplaint = key in complaints;
			const classNames = classnames(
				rowClassName, className, { [hasComplaintClassName]: hasComplaint }
			);
			const row = [
				<div key={key} className={classNames}>
					<div className={keyClassName}>
						<ControlLabel>{caption ? caption : key}</ControlLabel>
					</div>
					<div className={valueClassName}>
						<Component
							value={value[key]}
							onChange={val => this.handleChange(key, val)}
						/>
					</div>
				</div>
			];
			if (hasComplaint) {
				row.push(<div className={complaintClassName}>
					{complaints[key]}
				</div>);
			}
			return row;
		});

		const classNames = classnames(
			bsClass,
			className
		);

		return <div className={classNames}>{rows}</div>;
	}
}

PropertyEditor.defaultProps = {
	value: {},
	properties: [],
	complaints: {},
	bsClass: 'property-editor',
	rowClassName: 'row',
	keyClassName: 'col-md-3',
	valueClassName: 'col-md-9',
	hasComplaintClassName: 'bg-danger',
	complaintClassName: 'text-danger'
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
