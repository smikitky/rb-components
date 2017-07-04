import React from 'react';
import LoadingIndicator from '../lib/LoadingIndicator';

const MiscDemo = () => {
	return <div>
		<h3>Loading Indicators</h3>
		<ul>
			<li><LoadingIndicator /></li>
			<li><LoadingIndicator icon='repeat' /></li>
			<li><LoadingIndicator icon='fa-spinner' /></li>
			<li><LoadingIndicator icon='fa-cog' /></li>
		</ul>
	</div>;
};

export default MiscDemo;
