// Utility modal dialogs.
// These can be used similarly to standard dialogs like alert() and prompt(),
// but are non-blocking and have Promise support.

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Icon from './Icon';
import createDialog from './createDialog';
import classnames from 'classnames';

export const modal = Dialog => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const exited = () => {
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
      });
    };

    ReactDOM.render(
      <Dialog onResolve={resolve} onReject={reject} onExited={exited} />,
      container
    );
  });
};

/**
 * Opens an alert dialog which is almost compatible with native `alert`.
 */
export const alert = (text, { title = 'Message', icon = 'info-sign' } = {}) => {
  const buttons = { OK: { response: true, style: 'primary', autoFocus: true } };
  return modal(props => (
    <ChoiceDialog
      text={text}
      title={title}
      icon={icon}
      buttons={buttons}
      {...props}
    />
  ));
};

/**
 * Opens a confirmation dialog which is almost compatible with native `confirm`.
 */
export const confirm = (
  text,
  { title = 'Confirm', icon = 'info-sign', cancelable = false } = {}
) => {
  const buttons = {
    OK: { response: true, style: 'primary', autoFocus: true },
    Cancel: { response: false, style: 'link' }
  };
  return modal(props => (
    <ChoiceDialog
      closeButton={cancelable}
      text={text}
      title={title}
      icon={icon}
      buttons={buttons}
      {...props}
    />
  ));
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
  {
    title = 'Choose',
    icon = 'info-sign',
    closeButton = false,
    keyboard = false
  } = {}
) => {
  if (Array.isArray(choices)) {
    const obj = {};
    choices.forEach(choice => (obj[choice] = choice));
    choices = obj;
  }
  Object.keys(choices).forEach(key => {
    if (typeof choices[key] !== 'object')
      choices[key] = { response: choices[key], style: 'default' };
  });
  return modal(props => (
    <ChoiceDialog
      text={text}
      title={title}
      icon={icon}
      closeButton={closeButton}
      keyboard={keyboard}
      buttons={choices}
      {...props}
    />
  ));
};

const ChoiceDialog = createDialog(function Choice(props) {
  const { icon, title, text, buttons, closeButton = true } = props;
  const glyph = icon && (
    <Fragment>
      <Icon icon={icon} />
      &ensp;
    </Fragment>
  );

  return (
    <div>
      <Modal.Header closeButton={closeButton}>
        {glyph}
        {title}
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        {Object.keys(buttons).map(key => {
          const b = buttons[key];
          return (
            <Button
              bsStyle={b.style}
              onClick={() => props.onResolve(b.response)}
              key={key}
              autoFocus={!!b.autoFocus}
            >
              {key}
            </Button>
          );
        })}
      </Modal.Footer>
    </div>
  );
});

/* Prompt */

export const prompt = (
  text,
  value,
  { title = 'Input', icon = 'info-sign', password = false, validator } = {}
) => {
  return modal(props => (
    <PromptDialog
      text={text}
      icon={icon}
      title={title}
      value={value}
      password={password}
      validator={validator}
      {...props}
    />
  ));
};

const PromptDialog = createDialog(
  class Prompt extends React.Component {
    constructor(props) {
      super(props);
      const value = typeof props.value === 'string' ? props.value : '';
      this.state = { value, errorMessage: this.validate(value) };
      this.change = this.change.bind(this);
      this.keyDown = this.keyDown.bind(this);
      this.handleOkClick = this.handleOkClick.bind(this);
    }

    validate(value) {
      const { validator } = this.props;
      if (typeof validator !== 'function') return null;
      const result = validator(value);
      return typeof result === 'string' ? result : null;
    }

    change(event) {
      const value = event.target.value;
      this.setState({ value, errorMessage: this.validate(value) });
    }

    keyDown(event) {
      if (event.keyCode == keycode.codes.enter) {
        this.handleOkClick();
      }
    }

    handleOkClick() {
      const { onResolve } = this.props;
      if (typeof this.state.errorMessage === 'string') return;
      onResolve(this.state.value);
    }

    render() {
      const { icon, password, title, text, onResolve } = this.props;
      const { errorMessage } = this.state;
      const isError = typeof errorMessage === 'string';

      const glyph = icon && (
        <Fragment>
          <Icon icon={icon} />{' '}
        </Fragment>
      );
      const type = password ? 'password' : 'text';

      return (
        <div>
          <Modal.Header closeButton>
            {glyph}
            {title}
          </Modal.Header>
          <Modal.Body>
            <div className={classnames('form-group', { 'has-error': isError })}>
              <label className="control-label">{text}</label>
              <FormControl
                type={type}
                autoFocus
                value={this.state.value}
                onChange={this.change}
                onKeyDown={this.keyDown}
              />
              <div className="control-label">{isError ? errorMessage : ''}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              disabled={isError}
              onClick={this.handleOkClick}
            >
              OK
            </Button>
            <Button bsStyle="link" onClick={() => onResolve(null)}>
              Cancel
            </Button>
          </Modal.Footer>
        </div>
      );
    }
  }
);

/**
 * Shows progress dialog when doing something.
 */
export const withProgressDialog = (text, task) => {
  return modal(props => <ProgressDialog text={text} task={task} {...props} />);
};

const ProgressDialog = createDialog(
  class Progress extends React.Component {
    componentDidMount() {
      const { task, onResolve, onReject } = this.props;
      task.then(onResolve).catch(onReject);
    }

    render() {
      return (
        <div>
          <Modal.Header>{this.props.text}</Modal.Header>
          <Modal.Body>
            <ProgressBar active now={100} />
          </Modal.Body>
        </div>
      );
    }
  }
);
