import React from 'react';
import Icon from './Icon';

const LoadingIndicator = props => {
	const { icon = 'refresh' } = props;
	return <Icon icon={icon} spin={true} />;
};

export default LoadingIndicator;
