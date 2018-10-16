import React from 'react';
import Icon from './Icon';

const StaticLoadingIndicator = props => {
  const { icon = 'refresh' } = props;
  return <Icon icon={icon} spin={true} />;
};

export default class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.frame = this.frame.bind(this);
    this.state = { show: !(this.props.delay > 0) };
    this.start = new Date().getTime();
  }

  frame() {
    requestAnimationFrame(() => {
      const current = new Date().getTime();
      if (current - this.start > this.props.delay) {
        this.setState({ show: true });
      } else {
        this.frame();
      }
    });
  }

  componentDidMount() {
    if (!this.state.show) this.frame();
  }

  render() {
    if (this.state.show) {
      return <StaticLoadingIndicator icon={this.props.icon} />;
    }
    return null;
  }
}
