'use strict';

import React from 'react';
import classnames from 'classnames';

export function createIconComponent(prefixes) {
	return function Icon(props) {
		const { icon, spin = false } = props;
		for (let k of Object.keys(prefixes)) {
			if (icon.indexOf(k) === 0) {
				const fqn = prefixes[k] + icon.substring(k.length);
				return <i className={classnames({ spin } , fqn)} />;
			}
		}
		const fqn = prefixes.default + icon;
		return <i className={classnames({ spin }, fqn)} />;
	};
}

/**
 * Default Icon component recognizes glyphicon and font awesome icon classes
 */
const Icon = createIconComponent({
	'glyphicon-': 'glyphicon glyphicon-',
	'fa-': 'fa fa-',
	default: 'glyphicon glyphicon-'
});

export default Icon;