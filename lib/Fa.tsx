import React from 'react';
import classnames from 'classnames';

/**
 * Renders a Font Awesome icon.
 * Use more generic Icon component.
 */
const Fa: React.FC<{
  icon: string;
  spin?: boolean;
}> = props => {
  const { icon, spin = false } = props;
  return <i className={classnames('fa', `fa-${icon}`, { 'fa-spin': spin })} />;
};

export default Fa;
