import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import FormControl from 'react-bootstrap/lib/FormControl';
import Calendar from './Calendar';
import moment from 'moment';

function dateToString(input) {
	if (typeof input === 'string') return input;
	if (input === null) return '(All)';
	let [delta, unit] = input;
	if (unit === 'day') {
		if (delta === 0) return 'Today';
		if (delta === -1) return 'Yesterday';
	}
	if (Math.abs(delta) > 1) unit += 's';
	return (delta < 0) ? `${-delta} ${unit} ago` : `${delta} ${unit} from now`;
}

export default class RelativeDatePicker extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { mode: 'all' };
		this.adjustMode = this.adjustMode.bind(this);
		this.relativeValueChange = this.relativeValueChange.bind(this);
	}

	triggerChange(value) {
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	dateClick(date) {
		this.triggerChange(date);
	}

	adjustMode() {
		let mode = 'absolute';
		if (this.props.value === null) mode = 'all';
		if (Array.isArray(this.props.value)) mode = 'relative';
		this.setState({ mode });
	}

	setMode(mode) {
		if (mode === 'relative') {
			this.triggerChange([0, 'day']);
		} else if (mode === 'all') {
			this.triggerChange(null);
		}
		this.setState({ mode });
	}

	relativeValueChange(ev) {
		const value = ev.target.value;
		this.triggerChange([-value, 'day']);
	}

	render() {
		const { mode } = this.state;
		const { value, bsSize = undefined, bsStyle = 'default' } = this.props;
		const editor = <div className='relative-datepicker-menu'>
			<ButtonGroup bsSize='xsmall'>
				<Button
					bsStyle={mode === 'relative' ? 'primary' : 'default'}
					onClick={() => this.setMode('relative')}
				>Relative</Button>
				<Button
					bsStyle={mode === 'absolute' ? 'primary' : 'default'}
					onClick={() => this.setMode('absolute')}
				>Absolute</Button>
				<Button
					bsStyle={mode === 'all' ? 'primary' : 'default'}
					onClick={() => this.setMode('all')}
				>All</Button>
			</ButtonGroup>
			{ mode !== 'all' &&
				<div className='switch'>
					{mode === 'relative' ?
						<div className='form-inline'>
							<FormControl bsSize='sm' type='number' min={0}
								value={Array.isArray(value) ? -value[0] : 0}
								onSelect={ev => ev.stopPropagation() /* prevents closing of dropdown */}
								onChange={this.relativeValueChange}
							/>
							&ensp;days ago
						</div>
					:
						<Calendar value={value} onChange={date => this.dateClick(date)}/>
					}
				</div>
			}
		</div>;

		return <Dropdown
			id='relative-datetime-picker-dropdown'
			onDrop={this.adjustMode}
		>
			<Dropdown.Toggle bsSize={bsSize} bsStyle={bsStyle}>
				{dateToString(this.props.value)}
			</Dropdown.Toggle>
			<Dropdown.Menu>{editor}</Dropdown.Menu>
		</Dropdown>;
	}
}

export const normalizeRelative = dateValue => {
	if (typeof dateValue === 'string') {
		return moment(dateValue);
	} else if (dateValue === null) {
		return null;
	} else if (typeof dateValue === 'object') {
		return moment().startOf('day').add(...dateValue);
	}
	return null;
};
