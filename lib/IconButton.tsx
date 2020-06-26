import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Icon from './Icon';
import { ButtonProps } from 'react-bootstrap';

/**
 * Creates a custom IconButton component that works with a custom
 * implementation of Icon component.
 */
export const createIconButtonComponent = (
  iconComp: React.FC<{ icon: string }>
) => {
  const IconComp = iconComp;
  const IconButton: React.FC<{ icon: string } & ButtonProps> = props => {
    const { icon, children, ...rest } = props;
    return (
      <Button {...rest}>
        <IconComp icon={icon} />
        {children ? <span>&ensp;</span> : null}
        {children}
      </Button>
    );
  };
  return IconButton;
};

/**
 * Default IconButton, which recognizes Glyphicon and Font Awesome.
 */
const IconButton = createIconButtonComponent(Icon);
export default IconButton;
