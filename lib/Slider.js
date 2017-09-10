import React from 'react';
import classnames from 'classnames';

class SliderThumb extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dragging: false };
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
		this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	handleMouseDown() {
		if (this.props.disabled) return;
		this.setState({ dragging: true });
		document.addEventListener('mousemove', this.handleDocumentMouseMove);
		document.addEventListener('mouseup', this.handleDocumentMouseUp);
	}
	
	handleDocumentMouseUp() {
		this.setState({ dragging: false });
		document.removeEventListener('mousemove', this.handleDocumentMouseMove);
		document.removeEventListener('mouseup', this.handleDocumentMouseUp);
	}

	handleDocumentMouseMove(ev) {
		if (!this.state.dragging) return;
		const track = this.thumb.parentNode;
		const clientX = ev.clientX;
		const { left: trackLeft, width: trackWidth } = track.getBoundingClientRect();
		let percentPos = (clientX - trackLeft) / trackWidth;
		if (clientX < trackLeft) percentPos = 0;
		if (clientX > trackLeft + trackWidth) percentPos = 1;
		this.props.onMove(percentPos);
	}

	handleKeyDown(ev) {
		const { onStep } = this.props;
		if (typeof onStep !== 'function') return;
		switch(ev.keyCode) {
			case 37: // left arrow
				onStep(-1);
				break;
			case 39: // right arrow
				onStep(1);
				break;
		}
		ev.preventDefault();
	}

	render() {
		const { percentPosition, disabled, id } = this.props;
		const classNames = classnames(
			'slider-thumb',
			`slider-thumb-${id}`,
			{ dragging: this.state.dragging }
		);
		return <div
			ref={el => this.thumb = el}
			role='slider'
			className={classNames}
			tabIndex={disabled ? undefined : 0}
			style={{ left: percentPosition + '%' }}
			onMouseDown={this.handleMouseDown}
			onKeyDown={this.handleKeyDown}
		/>;
	}
}

function valueToPercent(value, min, max) {
	if (value < min) return 0;
	if (value > max) return 100;
	return (value - min) / (max - min) * 100;
}

function percentToValue(percent, min, max, step) {
	const numOfSteps = (max - min) / step;
	return min + Math.round(percent * numOfSteps) * (max - min) / numOfSteps;
}

const ActiveTrack = props => {
	const left = props.percentLeft;
	const right = 100 - props.percentRight;
	return <div className='slider-active-track'
		style={{ left: left + '%', right: right + '%' }}
	/>;
};

class MultiSlider extends React.Component {
	constructor(props) {
		super(props);
		this.handleThumbMove = this.handleThumbMove.bind(this);
		this.handleStep = this.handleStep.bind(this);
	}

	limitThumbValue(thumbValue, i) {
		const { value, sliders, min, max } = this.props;
		if (thumbValue < min) thumbValue = min;
		if (thumbValue > max) thumbValue = max;
		if (i > 0 && thumbValue < value[i - 1]) {
			thumbValue = value[i - 1];
		}
		if (i < sliders.length - 1 && thumbValue > value[i + 1]) {
			thumbValue = value[i + 1];
		}
		return thumbValue;
	}

	changeThumbValue(index, newThumbValue) {
		const { value, onChange } = this.props;
		if (typeof onChange === 'function') {
			const newValue = [...value];
			newValue[index] = newThumbValue;
			onChange(newValue);
		}
	}

	handleThumbMove(index, percentPos) {
		const { min, max, step } = this.props;
		const newThumbValue = percentToValue(percentPos, min, max, step);
		const limited = this.limitThumbValue(newThumbValue, index);
		this.changeThumbValue(index, limited);
	}

	handleStep(index, delta) {
		const { step, value } = this.props;
		const newThumbValue = this.limitThumbValue(
			value[index] + delta * step, index
		);
		this.changeThumbValue(index, newThumbValue);
	}

	render() {
		const {
			value,
			sliders,
			min,
			max,
			disabled,
			className
		} = this.props;
		const classNames = classnames('slider', { disabled }, className);
		return <div className={classNames}>
			<div
				className='slider-track'
				ref={el => this.track = el}
			>
				{sliders.map((key, i) => (
					<SliderThumb
						key={key}
						id={key}
						onMove={v => this.handleThumbMove(i, v)}
						onStep={d => this.handleStep(i, d)}
						percentPosition={valueToPercent(value[i], min, max)}
						disabled={disabled}
					/>
				))}
				{ sliders.length > 0 &&
					<ActiveTrack
						percentLeft={valueToPercent(value[0], min, max)}
						percentRight={valueToPercent(value[sliders.length - 1], min, max)}
					/>
				}
			</div>
		</div>;
	}
}

export const Range = props => {
	return <MultiSlider
		sliders={['lo', 'hi']}
		{...props}
	/>;
};

Range.defaultProps = {
	min: 0,
	max: 100,
	value: [0, 100],
	step: 1
};


export const Slider = props => {
	const { value, onChange = () => {}, ...rest } = props;
	return <MultiSlider
		sliders={['value']}
		value={[value]}
		onChange={v => onChange(v[0])}
		{...rest}
	/>;
};

Slider.defaultProps = {
	min: 0,
	max: 100,
	value: 0,
	step: 1
};

export default Slider;