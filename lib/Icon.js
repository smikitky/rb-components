'use strict';

import React from 'react';
import classnames from 'classnames';

/**
 * Creates a generic Icon component.
 * It works similarly to react-bootstrap's <Glypihicon>, but provides
 * a common way to render icons from various icon libraries.
 */
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
 * Default Icon component, which recognizes Glyphicon and Font Awesome icon classes.
 */
const Icon = createIconComponent({
	'glyphicon-': 'glyphicon glyphicon-',
	'fa-': 'fa fa-',
	default: 'glyphicon glyphicon-'
});

export default Icon;