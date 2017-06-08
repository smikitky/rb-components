import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import Fa from './Fa';

const IconButton = props => {
	const { icon, children, ...rest } = props;
	return <Button {...rest}>
		<Fa icon={icon} />
		{children ? <span>&ensp;</span> : null}
		{children}
	</Button>
};

export default IconButton;
