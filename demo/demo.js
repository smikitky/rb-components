'use strict';

require('file-loader?name=index.html!./index.html');

import React from 'react';
import ReactDom from 'react-dom';

import IconButton from '../lib/IconButton';

ReactDom.render(
	<IconButton icon='home'>Hello</IconButton>,
	document.getElementById('main')
);
