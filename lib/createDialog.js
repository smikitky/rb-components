import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

const createDialog = WrappedComponent => {
  const Enhanced = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { show: true };
      this.handleResolve = this.handleSettle.bind(this, true);
      this.handleReject = this.handleSettle.bind(this, false);
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

    render() {
      const { modalClassName, backdrop, keyboard, ...rest } = this.props;
      return (
        <Modal
          show={this.state.show}
          onExited={this.handleExited}
          onHide={() => this.handleSettle(true, null)}
          backdrop={!!backdrop}
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
