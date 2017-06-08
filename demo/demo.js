'use strict';

require('file-loader?name=index.html!./index.html');

import React from 'react';
import ReactDom from 'react-dom';

import IconButton from '../lib/IconButton';
import LoadingIndicator from '../lib/LoadingIndicator';

const Demo = () => <div>
	<LoadingIndicator />
	<IconButton icon='home'>Hello</IconButton>
</div>;

ReactDom.render(
	<Demo />,
	document.getElementById('main')
);
