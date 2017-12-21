import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

const CustomDialog = props => {
  const {
    show,
    onExited,
    onResolve,
    backdrop = 'static',
    keyboard = true,
    bsSize,
    dialogClassName
  } = props;

  return (
    <Modal
      show={show}
      onExited={onExited}
      onHide={() => onResolve(null)}
      bsSize={bsSize}
      backdrop={backdrop}
      keyboard={keyboard}
      dialogClassName={dialogClassName}
    >
      {props.children}
    </Modal>
  );
};

export default CustomDialog;
