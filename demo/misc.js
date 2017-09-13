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
		<h3>Loading Indicators with Delay</h3>
		<p>Remains hidden after the mounting for the specified amount of time.</p>
		<ul>
			<li><LoadingIndicator delay={500} /></li>
			<li><LoadingIndicator icon='repeat' delay={1000} /></li>
			<li><LoadingIndicator icon='fa-spinner' delay={1500} /></li>
			<li><LoadingIndicator icon='fa-cog' delay={2000} /></li>
		</ul>
	</div>;
};

export default MiscDemo;
