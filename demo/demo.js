'use strict';

require('file-loader?name=index.html!./index.html');
require('file-loader?name=rb-components.css!less-loader!../lib/rb-components.less');

import React from 'react';
import ReactDom from 'react-dom';

import LoadingIndicator from '../lib/LoadingIndicator';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import ModalDemo from './modal';
import CalendarDemo from './calendar';
import SelectDemo from './select';
import ConditionEditorDemo from './condition-editor';

const Demo = () => <div>
	<Tabs id='demo-tabs' defaultActiveKey={'modals'} animation={false}>
		<Tab eventKey={'modals'} title='Modals'>
			<ModalDemo />
		</Tab>
		<Tab eventKey={'calendar'} title='Calendar'>
			<CalendarDemo />
		</Tab>
		<Tab eventKey={'shrinkselect'} title='Select'>
			<SelectDemo />
		</Tab>
		<Tab eventKey={'condition-editor'} title='ConditionEditor'>
			<ConditionEditorDemo />
		</Tab>
		<Tab eventKey={'misc'} title='Misc'>
			<LoadingIndicator />
		</Tab>
	</Tabs>
</div>;

ReactDom.render(
	<Demo />,
	document.getElementById('main')
);