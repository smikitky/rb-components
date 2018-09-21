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
import classnames from 'classnames';
import wrapDisplayName from './utils/wrapDisplayName';

/**
 * HoC that wraps a plain compmonent and turns it into a
 * stateful dialog that can be used with `modal`.
 * The wrapped component will be passed two functons,
 * `onResolve` and `onReject`, which can be used to
 * close the dialog.
 */
export const createDialog = WrappedComponent => {
  const Enhanced = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { show: true };
      this.handleResolve = this.handleSettle.bind(this, true);
      this.handleReject = this.handleSettle.bind(this, false);
      this.handleHide = this.handleHide.bind(this);
      this.handleExited = this.handleExited.bind(this);
    }

    handleSettle(isResolve, value) {
      this.setState({ show: false });
      this.settledValue = value;
      this.isResolve = isResolve;
    }

    handleExited() {
      const { onResolve, onReject, onExited } = this.props;
      onExited();
      if (this.isResolve) {
        onResolve(this.settledValue);
      } else {
        onReject(this.settledValue);
      }
    }

    handleHide() {
      this.handleResolve(null);
    }

    render() {
      const {
        backdrop = 'static',
        className,
        bsClass,
        keyboard,
        ...rest
      } = this.props;
      return (
        <Modal
          show={this.state.show}
          onExited={this.handleExited}
          onHide={this.handleHide}
          backdrop={backdrop}
          keyboard={keyboard}
          className={className}
          bsClass={bsClass}
        >
          <WrappedComponent
            {...rest}
            onResolve={this.handleResolve}
            onReject={this.handleReject}
          />
        </Modal>
      );
    }
  };
  Enhanced.displayName = wrapDisplayName('Dialog', WrappedComponent);
  return Enhanced;
};

/**
 * Opens a modal dialog and returns the result via Promise.
 * @param {React.Component} Dialog The dialog component made by `createDialog`.
 * @returns {Promise<any>} Dialog result, usually a user response.
 */
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
  return choice(text, buttons, { title, icon });
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
  return choice(text, buttons, { title, icon, cancelable });
};

/**
 * Opens a dialog with arbitrary buttons.
 * @param {string} text Message shown to the user.
 * @param {any} choices Buttons to show. Can be in one of the following forms.
 *  - `[ 'Green', 'Black' ]`
 *  - `{ Green: 'gr', Black: 'bl' }`
 *  - `{ Green: { response: 'gr', style: 'primary' }, Black: { response: 'bl', style: 'warning' }}`
 * @param {any} options Options.
 * @return {Promise<any>} The user response.
 *   Resolves with null if dialog's close button is clicked.
 */
export const choice = (
  text,
  choices,
  {
    title = 'Choose',
    icon = 'info-sign',
    cancelable = false,
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
      closeButton={!!cancelable}
      keyboard={keyboard}
      buttons={choices}
      {...props}
    />
  ));
};

const ChoiceDialog = createDialog(function Choice(props) {
  const { icon, title, text, buttons, closeButton = true } = props;
  const glyph =
    typeof icon === 'string' ? (
      <Fragment>
        <Icon icon={icon} />
        &ensp;
      </Fragment>
    ) : React.isValidElement(icon) ? (
      icon
    ) : null;

  return (
    <Fragment>
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
    </Fragment>
  );
});

/**
 * Opens a prompt dialog.
 * @param {string} text The text message shown in the dialog.
 * @param {string} value Initial value of the text box.
 * @param {*} options Options.
 * @returns {Promise<string>} The string input by the user.
 */
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
 * @param {string} text The message shown to the user.
 * @param {Promise<any>} task Some unsettled Promise object to wait for.
 * @returns {Promise<any>} Settles with the same value as the passed promise.
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
