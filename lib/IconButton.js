import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Icon from './Icon';

/**
 * Creates a custom IconButton component that works with a custom
 * implementation of Icon component.
 */
export function createIconButtonComponent(iconComp) {
  const IconComp = iconComp;
  return function IconButton(props) {
    const { icon, children, ...rest } = props;
    return (
      <Button {...rest}>
        <IconComp icon={icon} />
        {children ? <span>&ensp;</span> : null}
        {children}
      </Button>
    );
  };
}

/**
 * Default IconButton, which recognizes Glyphicon and Font Awesome.
 */
const IconButton = createIconButtonComponent(Icon);
export default IconButton;
