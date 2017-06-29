import React from 'react';
import classnames from 'classnames';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

export default class PropertyEditor extends React.PureComponent {
	handleChange(key, val) {
		const { value = {}, onChange } = this.props;
		const newValues = { ... value };
		newValues[key] = val;
		typeof onChange === 'function' && onChange(newValues);
	}

	render() {
		const {
			value = {},
			complaints = {},
			properties = [],
			className
		} = this.props;

		const rows = properties.map(property => {
			if (typeof property === 'string') {
				return <h3>{property}</h3>;
			}
			const { key, caption, editor: Component } = property;
			const complain = complaints[key];
			const row = [
				<Row key={key} className={complain ? 'bg-danger' : ''}>
					<Col md={3}>
						<ControlLabel>{caption ? caption : key}</ControlLabel>
					</Col>
					<Col md={9}>
						<Component
							value={value[key]}
							onChange={val => this.handleChange(key, val)}
						/>
					</Col>
				</Row>
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
