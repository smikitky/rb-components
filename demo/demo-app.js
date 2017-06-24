import React from 'react';

import LoadingIndicator from '../lib/LoadingIndicator';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import ModalDemo from './modal';
import CalendarDemo from './calendar';
import SelectDemo from './select';
import ConditionEditorDemo from './condition-editor';

const DemoApp = () => <div>
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

export default DemoApp;