import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

export default class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0
    }
  }
  componentWillMount() {
    this.handleAngle()
    this.setState({ angle: this.props.angle })
  }

  mouseDown = (event) => {
    event.preventDefault();
    const obj = this
    let circle = this.circle;
    let picker = this.picker;
    let rect = circle.getBoundingClientRect();

    let center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    let transform = (function () {
      let p = 'transform';
      return p
    })();
    picker.style[transform] = `rotate(${this.state.angle - 60}deg)`;

    let rotate = function (x, y) {
      let deltaX = x - center.x;
      let deltaY = y - center.y;
      let angle = Math.round(Math.atan2(deltaY, deltaX) * 180 / Math.PI)
      if (angle < 0) angle = angle + 360;
      return angle
    };

    document.body.style.cursor = 'default'

    let mousemove = (event) => {
      obj.setState({ angle: rotate(event.clientX, event.clientY) });
      obj.handleAngle();
      let deg = rotate(event.clientX, event.clientY) - 55;
      picker.style[transform] = 'rotate(' + deg + 'deg)'
    };

    let mouseup = function () {
      document.body.style.cursor = null;
      document.removeEventListener('mouseup', mouseup)
      document.removeEventListener('mousemove', mousemove)
    };

    mousemove(event)
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }

  componentDidMount() {
    let circle = this.circle;

    circle.addEventListener('mousedown', function (event) {
      if (event.target === document.getElementsByClassName('picker-circle')) this.mouseDown(event)
    })
  }
  componentDidUpdate() {
    let picker = this.picker
    picker.style['transform'] = `rotate(${this.props.angle - 55}deg)`;
  }

  handleAngle = () => {
    this.props.chooseAngle(this.state.angle)
  }

  render() {
    return (
      <div className={style.circle} ref={ref => { this.circle = ref }}>
        <div className={style.picker} ref={ref => { this.picker = ref }}>
          <div className={style.pickerCircle}
            onMouseDown={this.mouseDown} />
        </div>
      </div>
    )
  }
}

Circle.propTypes = {
  angle: PropTypes.number.isRequired,
  chooseAngle: PropTypes.func.isRequired

}
