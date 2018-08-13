import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
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
export function createIconComponent(prefixes) {
  const result = function Icon(props) {
    const { icon, spin = false } = props;
    for (const k of Object.keys(prefixes)) {
      if (icon.indexOf(k) === 0) {
        const fqn = prefixes[k] + icon.substring(k.length);
        return <StyledI className={classnames({ spin }, fqn)} />;
      }
    }
    const fqn = prefixes.default + icon;
    return <i className={classnames({ spin }, fqn)} />;
  };
  result.propTypes = {
    icon: PropTypes.string.isRequired,
    spin: PropTypes.bool
  };
  return result;
}

/**
 * Default Icon component, which recognizes Glyphicon and Font Awesome icon classes.
 */
const Icon = createIconComponent({
  'glyphicon-': 'glyphicon glyphicon-',
  'fa-': 'fa fa-',
  default: 'glyphicon glyphicon-'
});

export default Icon;
