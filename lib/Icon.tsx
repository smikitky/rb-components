import React from 'react';
import classnames from 'classnames';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
 0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359.9deg);
  }
`;

const StyledI = styled.i`
  &.spin {
    animation: ${spin} 2s infinite linear;
  }
`;

/**
 * Creates a generic Icon component.
 * It works similarly to react-bootstrap's <Glypihicon>, but provides
 * a common way to render icons from various icon libraries.
 */
export const createIconComponent = (prefixes: { [key: string]: string }) => {
  const Icon: React.FC<{
    icon: string;
    spin?: boolean;
  }> = function Icon(props) {
    const { icon, spin = false } = props;
    const makeIcon = (fqn: string) => (
      <StyledI className={classnames({ spin }, fqn)} />
    );

    for (const k of Object.keys(prefixes)) {
      if (icon.indexOf(k) === 0) {
        return makeIcon(prefixes[k] + icon.substring(k.length));
      }
    }
    return makeIcon(prefixes.default + icon);
  };
  return Icon;
};

/**
 * Default Icon component, which recognizes Glyphicon and Font Awesome icon classes.
 */
const Icon = createIconComponent({
  'glyphicon-': 'glyphicon glyphicon-',
  'fa-': 'fa fa-',
  default: 'glyphicon glyphicon-'
});

export default Icon;
