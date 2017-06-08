import React from 'react';
import classnames from 'classnames';

/**
 * Render Font Awesome Icon
 */
const Fa = props => {
	const { icon, spin = false } = props;
	return <i className={classnames('fa', `fa-${icon}`, { 'fa-spin': spin })} />;
};

export default Fa;
