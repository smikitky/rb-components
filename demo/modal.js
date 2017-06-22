import React from 'react';

import IconButton from '../lib/IconButton';
import { alert, confirm, prompt, withProgressDialog } from '../lib/Modal';

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
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const onProgressClick = async () => {
	withProgressDialog('Waiting for 2 seconds...', delay(2000));
}

export default function ModalDemo() {
	return <div className='btn-group'>
		<IconButton
			icon='alert'
			bsStyle='warning'
			onClick={onAlertClick}
		>
			Alert
		</IconButton>
		<IconButton
			icon='question-sign'
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
		<IconButton
			icon='time'
			bsStyle='success'
			onClick={onProgressClick}
		>
			With Progress
		</IconButton>
	</div>;
}
