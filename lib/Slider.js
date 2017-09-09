import React from 'react';
import classnames from 'classnames';

class SliderThumb extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dragging: false };
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
	}

	handleDragStart(ev) {
		this.setState({ dragging: true });
		// hide drag image
		const img = document.createElement('img');
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
		ev.dataTransfer.setDragImage(img, 0, 0);
	}
	
	handleDrag(ev) {
		if (!this.state.dragging) return;
		const { onMove } = this.props;
		onMove(ev);
	}

	handleDragEnd() {
		this.setState({ dragging: false });
	}

	render() {
		const { percentPosition, thumbRef, disabled } = this.props;
		const classNames = classnames(
			'slider-thumb',
			{ dragging: this.state.dragging }
		);
		return <div
			draggable={!disabled}
			className={classNames}
			tabIndex={disabled ? -1 : 1}
			style={{ left: percentPosition + '%' }}
			onDragStart={this.handleDragStart}
			onDrag={this.handleDrag}
			onDragEnd={this.handleDragEnd}
			ref={thumbRef}
		/>;
	}
}

class SliderTrack extends React.Component {
	constructor(props) {
		super(props);
		this.handleThumbMove = this.handleThumbMove.bind(this);
	}

	calcValue(ev) {
		if (ev.clientY == 0) return NaN;
		const { min, max, step } = this.props;
		const numOfSteps = (max - min) / step;

		const trackRect = this.track.getBoundingClientRect();
		const trackLeft = trackRect.left;
		const trackWidth = trackRect.width;
		const thumbLeft = ev.clientX;
		let percentPos = (thumbLeft - trackLeft) / trackWidth;
		if (thumbLeft < trackLeft) percentPos = 0;
		if (thumbLeft > trackLeft + trackWidth) percentPos = 1;

		const normalized = Math.round(percentPos * numOfSteps) / numOfSteps;
		const value = min + normalized * (max - min);
		return value;
	}

	handleThumbMove(ev) {
		if (ev.clientY == 0) return; // hacky
		const value = this.calcValue(ev);
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}
	
	render() {
		const { value, max, min, disabled } = this.props;
		const percent = (value - min) / (max - min) * 100;

		return <div
			className='slider-track'
			ref={el => this.track = el}
		>
			<SliderThumb
				onMove={this.handleThumbMove}
				percentPosition={percent}
				thumbRef = {el =>  this.thumb = el}
				disabled={disabled}
			/>
		</div>;
	}
}

const Slider = props => {
	const {
		value,
		onChange,
		disabled,
		min,
		max,
		step,
		className
	} = props;
	
	const classNames = classnames('slider', { disabled }, className);

	return <div className={classNames}>
		<SliderTrack
			value={value}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			onChange={onChange}
		/>
	</div>;
};

Slider.defaultProps = {
	min: 0,
	max: 100,
	value: 0,
	step: 1
};

export default Slider;