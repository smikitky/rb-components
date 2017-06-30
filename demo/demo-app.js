import React from 'react';

import LoadingIndicator from '../lib/LoadingIndicator';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import ModalDemo from './modal';
import CalendarDemo from './calendar';
import SelectDemo from './select';
import ColorDemo from './color';
import ConditionEditorDemo from './condition-editor';
import PropertyEditorDemo from './property-editor';

const DemoApp = () => <div>
	<Tabs id='demo-tabs' defaultActiveKey={'modals'} animation={false}
		mountOnEnter={true} unmountOnExit={true}
	>
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
		<Tab eventKey={'color'} title='Color'>
			<ColorDemo />
		</Tab>
		<Tab eventKey={'property'} title='PropertyEditor'>
			<PropertyEditorDemo />
		</Tab>
		<Tab eventKey={'misc'} title='Misc'>
			<div>
				<h3>Loading Indicator</h3>
				<LoadingIndicator />
			</div>
		</Tab>
	</Tabs>
</div>;

export default DemoApp;