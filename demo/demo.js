'use strict';

require('file-loader?name=index.html!./index.html');

import React from 'react';
import ReactDom from 'react-dom';

import IconButton from '../lib/IconButton';
import LoadingIndicator from '../lib/LoadingIndicator';
import { alert, confirm, prompt } from '../lib/Modal';

const onAlertClick = async () => {
	await alert('Alert!');
};

const onConfirmClick = async () => {
	const answer = await confirm('Are you sure?');
	if (answer) {
		await alert('You clicked OK');
	} else {
		await alert('You clicked Cancel');
	}
};

const onPromptClick = async () => {
	const answer = await prompt('Input something');
	await alert('Your input is: ' + answer);
}

const Demo = () => <div>
	<div>
		<LoadingIndicator />
	</div>
	<div>
		<IconButton
			icon='exclamation-triangle'
			bsStyle='warning'
			onClick={onAlertClick}
		>
			Alert
		</IconButton>
		<IconButton
			icon='question-circle'
			bsStyle='info'
			onClick={onConfirmClick}
		>
			Confirm
		</IconButton>
		<IconButton
			icon='comment'
			bsStyle='primary'
			onClick={onPromptClick}
		>
			Prompt
		</IconButton>
	</div>
</div>;

ReactDom.render(
	<Demo />,
	document.getElementById('main')
);
