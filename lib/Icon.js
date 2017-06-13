'use strict';

import React from 'react';

export function createIconComponent(prefixes) {
	return function Icon(props) {
		const { icon } = props;
		for (let k in Object.keys(prefixes)) {
			if (icon.indexOf(k) === 0) {
				const fqn = prefixes[k] + icon;
				return <i className={fqn} />;
			}
		}
		const fqn = prefixes.default + icon;
		return <i className={fqn} />;
	};
}

const Icon = createIconComponent({
	'glyphicon-': 'glyphicon glyphicon-',
	'fa-': 'fa fa-',
	default: 'glyphicon glyphicon-'
});

export default Icon;