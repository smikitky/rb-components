import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import Icon from './Icon';

const IconButton = props => {
	const { icon, children, ...rest } = props;
	return <Button {...rest}>
		<Icon icon={icon} />
		{children ? <span>&ensp;</span> : null}
		{children}
	</Button>
};

export default IconButton;
