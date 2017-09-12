// Utility modal dialogs.
// These can be used similarly to standard dialogs like alert() and prompt(),
// but are non-blocking and have Promise support.

import React from 'react';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Icon from './Icon';
import CustomDialog from './CustomDialog';

export const modal = (dialogClass, dialogProps) => {
	return new Promise((resolve, reject) => {
		const container = document.createElement('div');
		document.body.appendChild(container);

		let settledStatus = undefined;

		const settled = (isResolve, value) => {
			settledStatus = { isResolve, value };
		};

		const exited = () => {
			setImmediate(() => {
				ReactDOM.unmountComponentAtNode(container);
				document.body.removeChild(container);
			});
			if (settledStatus.isResolve) {
				resolve(settledStatus.value);
			} else {
				reject(settledStatus.value);
			}
		};

		ReactDOM.render(
			<DialogContainer
				onSettle={settled}
				onExited={exited}
				dialog={dialogClass}
				dialogProps={dialogProps}
			/>,
			container
		);
	});
};

class DialogContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { show: true };
		this.onResolve = this.settle.bind(this, true);
		this.onReject= this.settle.bind(this, false);
	}

	settle(isResolve, value) {
		this.setState({ show: false });
		this.props.onSettle(isResolve, value);
	}

	render() {
		const Dialog = this.props.dialog;
		return <Dialog
			onExited={this.props.onExited}
			show={this.state.show}
			onResolve={this.onResolve}
			onReject={this.onReject}
			{...this.props.dialogProps}
		/>;
	}
}

/**
 * Opens an alert dialog which is almost compatible with native `alert`.
 */
export const alert = (text, { title = 'Message', icon = 'info-sign' } = {}) => {
	const buttons = { OK: { response: true, style: 'primary', autoFocus: true } };
	return modal(ChoiceDialog, { text, title, icon, buttons });
};

/**
 * Opens a confirmation dialog which is almost compatible with native `confirm`.
 */
export const confirm = (text, { title = 'Confirm', icon = 'info-sign', cancelable = false } = {}) => {
	const buttons = {
		OK: { response: true, style: 'primary', autoFocus: true },
		Cancel: { response: false, style: 'link' }
	};
	return modal(ChoiceDialog, { closeButton: cancelable, text, title, icon, buttons });
};

/*
 * Opens a dialog with arbitrary buttons.
 * choices: can be in one of the following forms:
 *  - [ 'Green', 'Black' ]
 *  - { Green: 'gr', Black: 'bl' }
 *  - { Green: { response: 'gr', style: 'primary' }, Black: { response: 'bl', style: 'warning' }}
 */
export const choice = (
	text,
	choices,
	{ title = 'Choose', icon = 'info-sign', closeButton = false, keyboard = false } = {}
) => {
	if (Array.isArray(choices)) {
		const obj = {};
		choices.forEach(choice => obj[choice] = choice);
		choices = obj;
	}
	Object.keys(choices).forEach(key => {
		if (typeof choices[key] !== 'object')
			choices[key] = { response: choices[key], style: 'default' };
	});
	return modal(
		ChoiceDialog,
		{
			text, title, icon, closeButton, keyboard,
			buttons: choices
		}
	);
};

const ChoiceDialog = props => {
	const { icon, title, text, buttons, closeButton = true } = props;
	const glyph = icon ? <span><Icon icon={icon} />&ensp;</span> : '';

	return <CustomDialog {...props}>
		<Modal.Header closeButton={closeButton}>
			{glyph}{title}
		</Modal.Header>
		<Modal.Body>{text}</Modal.Body>
		<Modal.Footer>
			{Object.keys(buttons).map(key => {
				const b = buttons[key];
				return <Button
					bsStyle={b.style}
					onClick={() => props.onResolve(b.response)}
					key={key}
					autoFocus={!!b.autoFocus}
				>
					{key}
				</Button>;
			})}
		</Modal.Footer>
	</CustomDialog>;
};

/* Prompt */

export const prompt = (
	text,
	value,
	{ title = 'Input', icon = 'info-sign', password = false } = {}
) => {
	return modal(PromptDialog, { text, icon, title, value, password });
};

class PromptDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.value ? props.value : '' };
		this.change = this.change.bind(this);
		this.keyDown = this.keyDown.bind(this);
	}

	change(event) {
		this.setState({ value: event.target.value });
	}

	keyDown(event) {
		if (event.keyCode == keycode.codes.enter) {
			this.props.onResolve(this.state.value);
		}
	}

	render() {
		const { icon, password, title, text, onResolve } = this.props;

		const glyph = icon ? <span><Icon icon={icon} />&ensp;</span> : '';
		const type = password ? 'password' : 'text';

		return <CustomDialog {...this.props}>
			<Modal.Header closeButton>
				{glyph}{title}
			</Modal.Header>
			<Modal.Body>
				<div>{text}</div>
				<FormControl
					type={type}
					autoFocus
					value={this.state.value}
					onChange={this.change}
					onKeyDown={this.keyDown}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button
					bsStyle='primary'
					onClick={() => onResolve(this.state.value)}
				>
					OK
				</Button>
				<Button
					bsStyle='link'
					onClick={() => onResolve(null)}
				>
					Cancel
				</Button>
			</Modal.Footer>
		</CustomDialog>;
	}
}

/**
 * Shows progress dialog when doing something.
 */
export const withProgressDialog = (text, task) => {
	return modal(ProgressDialog, { text, task });
};

class ProgressDialog extends React.Component {
	componentDidMount() {
		this.props.task.then(data => {
			this.props.onResolve(data);
		}).catch(err => {
			this.props.onReject(err);
		});
	}

	render() {
		return <CustomDialog {...this.props}>
			<Modal.Header>
				{this.props.text}
			</Modal.Header>
			<Modal.Body>
				<ProgressBar active now={100} />
			</Modal.Body>
		</CustomDialog>;
	}
}
