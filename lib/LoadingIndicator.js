import React from 'react';
import Icon from './Icon';

const StaticLoadingIndicator = props => {
	const { icon = 'refresh' } = props;
	return <Icon icon={icon} spin={true} />;
};

export default class LoadingIndicator extends React.Component {
	constructor(props) {
		super(props);
		this.handleTimer = this.handleTimer.bind(this);
		this.state = { show: false };
	}
	
	handleTimer() {
		this.setState({ show: true });
	}
	
	setTimer(delay) {
		if (delay > 0) {
			this.timer = setTimeout(this.handleTimer, this.props.delay);
		} else {
			this.setState({ show: true });
		}
	}
	
	removeTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	componentDidMount() {
		this.setTimer(this.props.delay);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.delay !== nextProps.delay) {
			this.removeTimer();
			this.setTimer(nextProps.delay);
		}
	}
	
	componentWillUnmount() {
		this.removeTimer();
	}
	
	render() {
		if (this.state.show) {
			return <StaticLoadingIndicator icon={this.props.icon} />;
		}
		return null;
	}
}
