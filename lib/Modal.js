// Utility modal dialogs.
// These can be used similarly to standard dialogs like alert() and prompt(),
// but are non-blocking and have Promise support.

import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Fa from './Fa';

export const modal = (DialogClass, props) => {
	return new Promise((resolve, reject) => {
		let response = undefined;
		let rejectResponse = undefined;
		let container = document.createElement('div');
		document.body.appendChild(container);

		const exited = () => {
			setImmediate(() => {
				ReactDOM.unmountComponentAtNode(container);
				document.body.removeChild(container);
			});
			if (rejectResponse !== undefined) {
				reject(rejectResponse);
			} else {
				resolve(response);
			}
		};

		const respond = res => {
			response = res;
		};

		const respondReject = err => {
			rejectResponse = err;
		};

		ReactDOM.render(
			<DialogClass {...props} onExited={exited} onRespond={respond} onReject={respondReject} />,
			container
		);
	});
};

export class DialogBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = { show: true };
	}

	respond(response) {
		this.setState({ show: false });
		this.props.onRespond(response);
	}

	reject(err) {
		this.setState({ show: false });
		this.props.onReject(err);
	}
}

/* Alert */

export const alert = (text, { title = 'Message', icon = 'info-circle' } = {}) => {
	const buttons = { OK: { response: true, style: 'primary' } };
	return modal(ChoiceDialog, { text, title, icon, buttons, closeButton: true });
};

/**
 * Opens a confirmation dialog.
 */
export const confirm = (text, { title = 'Confirm', icon = 'info-circle' } = {}) => {
	const buttons = {
		OK: { response: true, style: 'primary' },
		Cancel: { response: false, style: 'link' }
	};
	return modal(ChoiceDialog, { text, title, icon, buttons });
};

/*
 * Opens a dialog with arbitrary buttons.
 * choices: can be in one of the following forms:
 *  - ['Green', 'Black' ]
 *  - { Green: 'gr', Black: 'bl' }
 *  - { Green: { response: 'gr', style: 'primary' }, Black: { response: 'bl', style: 'warning' }}
 */
export const choice = (text, choices, { title = 'Choose', icon = 'info-sign' } = {}) => {
	if (Array.isArray(choices)) {
		let obj = {};
		choices.forEach(choice => obj[choice] = choice);
		choices = obj;
	}
	Object.keys(choices).forEach(key => {
		if (typeof choices[key] !== 'object')
			choices[key] = { response: choices[key], style: 'default' }
	});
	return modal(ChoiceDialog, { text, title, icon, buttons: choices });
};

class ChoiceDialog extends DialogBase {
	render() {
		const glyph = this.props.icon ? <span><Fa icon={this.props.icon} />&ensp;</span> : '';
		return <Modal show={this.state.show} onExited={this.props.onExited}>
			<Modal.Header>{glyph}{this.props.title}</Modal.Header>
			<Modal.Body>{this.props.text}</Modal.Body>
			<Modal.Footer>
				{Object.keys(this.props.buttons).map(key => {
					let b = this.props.buttons[key];
					return <Button
						bsStyle={b.style}
						onClick={() => this.respond(b.response)}
						key={key}
					>
						{key}
					</Button>;
				})}
			</Modal.Footer>
		</Modal>;
	}
}

/* Prompt */

export const prompt = (text, value, { title = 'Input', icon = 'info-sign', password = false } = {}) => {
	return modal(PromptDialog, { text, value, title, icon, password });
};

class PromptDialog extends DialogBase {
	constructor(props) {
		super(props);
		this.state.value = props.value ? props.value : '';
	}

	change(event) {
		this.setState({ value: event.target.value });
	}

	render() {
		const glyph = this.props.icon ? <span><Fa icon={this.props.icon} />&ensp;</span> : '';
		const type = this.props.password ? 'password' : 'text';
		return <Modal show={this.state.show} onExited={this.props.onExited}>
			<Modal.Header>{glyph}{this.props.title}</Modal.Header>
			<Modal.Body>
				<div>{this.props.text}</div>
				<FormControl
					type={type} autoFocus value={this.state.value}
					onChange={ev => this.change(ev)}
					onKeyDown={ev => { if (ev.keyCode == 13) this.respond(this.state.value); }}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle="primary" onClick={() => this.respond(this.state.value)}>OK</Button>
				<Button bsStyle="link" onClick={() => this.respond(null)}>Cancel</Button>
			</Modal.Footer>
		</Modal>;
	}
}

/**
 * Shows progress dialog when doing something.
 */
export const withProgressDialog = (text, task) => {
	return modal(ProgressDialog, { text, task });
};

class ProgressDialog extends DialogBase {
	componentDidMount() {
		this.props.task.then(data => {
			this.respond(data);
		}).catch(err => {
			this.reject(err);
		});
	}

	render() {
		return <Modal show={this.state.show} onExited={this.props.onExited}>
			<Modal.Header>
				{this.props.text}
			</Modal.Header>
			<Modal.Body>
				<ProgressBar active now={100} />
			</Modal.Body>
		</Modal>;
	}
}