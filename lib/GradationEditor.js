import React from 'react';
import classnames from 'classnames';
import tinycolor from 'tinycolor2';
import getHorizontalPositionInElement from './utils/getHorizontalPositionInElement';

const toHex = colorStop => {
  return tinycolor(colorStop.color)
    .setAlpha(colorStop.alpha)
    .toHex8String();
};

class Handle extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      dragging: false, // becomes true after mousedown
      dragged: false, // becomes true after mousemove after mousedown
      dimmed: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.disabled && nextProps.disabled) {
      this.setState({ dragging: false, dragged: false });
    }
  }

  handleDocumentMouseMove(ev) {
    const { disabled, onUpdate, stopId, numStops } = this.props;
    const removeThreshold = 30;
    ev.preventDefault();
    if (disabled) return;
    if (!this.state.dragging) return;
    this.setState({ dragged: true });
    const pos = getHorizontalPositionInElement(
      this.elem.parentNode,
      ev.clientX
    );
    const box = this.elem.parentNode.getBoundingClientRect();
    const dimmed =
      numStops > 2 &&
      (ev.clientY < box.top - removeThreshold ||
        ev.clientY > box.top + box.height + removeThreshold);
    this.setState({ dimmed });
    if (!dimmed) {
      onUpdate(stopId, { position: pos });
    }
  }

  handleDocumentMouseUp() {
    const { onRemove, stopId } = this.props;
    if (this.state.dimmed) {
      onRemove(stopId);
    }
    this.setState({ dragging: false });
    this.removeEventListeners();
  }

  removeEventListeners() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  handleMouseDown(ev) {
    const { disabled } = this.props;
    if (disabled) return;
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
    this.setState({ dragging: true, dragged: false });
    ev.stopPropagation();
  }

  handleClick() {
    const { disabled, onUpdate, stopId, value } = this.props;
    if (disabled) return;
    if (this.state.dragged) return;
    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = value.color;
    const changed = ev => {
      picker.removeEventListener('change', changed);
      onUpdate(stopId, { color: ev.target.value });
    };
    picker.addEventListener('change', changed);
    picker.click();
  }

  render() {
    const { disabled, value } = this.props;
    const { dimmed } = this.state;
    const style = {
      left: value.position * 100 + '%',
      backgroundColor: toHex(value)
    };
    return (
      <div
        ref={el => (this.elem = el)}
        className={classnames('gradation-editor-color-stop', {
          disabled,
          dimmed
        })}
        style={style}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClick}
      />
    );
  }
}

const buildGradient = value =>
  'linear-gradient(to right, ' +
  value.map(h => toHex(h) + ' ' + h.position * 100 + '%').join(', ') +
  ')';

export default class GradationEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleColorStopUpdate = this.handleColorStopUpdate.bind(this);
    this.handleAddColorStop = this.handleAddColorStop.bind(this);
    this.handleColorStopRemove = this.handleColorStopRemove.bind(this);
    this.counter = 1;
    this.map = new Map();
  }

  handleColorStopUpdate(stopId, updates) {
    const { value, onChange } = this.props;
    const newValue = value
      .map(s => {
        if (this.map.get(s) === stopId) {
          this.map.delete(s);
          const newStop = { ...s, ...updates };
          this.map.set(newStop, stopId);
          return newStop;
        } else {
          return s;
        }
      })
      .sort((a, b) => a.position - b.position);
    onChange(newValue);
  }

  handleColorStopRemove(stopId) {
    const { value, onChange } = this.props;
    const newValue = value.filter(s => {
      if (this.map.get(s) === stopId) {
        this.map.delete(s);
        return false;
      }
      return true;
    });
    onChange(newValue);
  }

  handleAddColorStop(ev) {
    const { disabled, value, onChange, maxStops } = this.props;
    if (disabled) return;
    if (typeof maxStops === 'number' && value.length >= maxStops) return;
    const newValue = value.slice();
    const position = getHorizontalPositionInElement(this.preview, ev.clientX);
    newValue.push({ position, color: '#ffffff', alpha: 1 });
    newValue.sort((a, b) => a.position - b.position);
    onChange(newValue);
  }

  componentWillUnmount() {
    this.map.clear();
  }

  render() {
    const { block, value, className, disabled } = this.props;
    const gradient = buildGradient(value);

    return (
      <div
        className={classnames('gradation-editor', className, {
          block,
          disabled
        })}
      >
        <div
          ref={el => (this.preview = el)}
          className="gradation-editor-preview"
          style={{ background: gradient }}
        >
          {value.map(point => {
            let id = this.map.get(point);
            if (!id) {
              id = this.counter++;
              this.map.set(point, id);
            }
            return (
              <Handle
                disabled={disabled}
                key={id}
                stopId={id}
                value={point}
                numStops={this.props.value.length}
                onUpdate={this.handleColorStopUpdate}
                onRemove={this.handleColorStopRemove}
              />
            );
          })}
        </div>
        <div
          className={classnames('gradation-editor-add-area', { disabled })}
          onClick={this.handleAddColorStop}
        />
      </div>
    );
  }
}