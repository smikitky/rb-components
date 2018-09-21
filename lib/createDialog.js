import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

/**
 * HoC that wraps a plain compmonent and turns it into a
 * stateful dialog that can be used with `modal`.
 * The wrapped component will be passed two functons,
 * `onResolve` and `onReject`, which can be used to
 * close the dialog.
 */
const createDialog = WrappedComponent => {
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
        modalClassName,
        backdrop = 'static',
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
          className={modalClassName}
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
  Enhanced.displayName = `Dialog(${getDisplayName(WrappedComponent)})`;
  return Enhanced;
};

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default createDialog;
