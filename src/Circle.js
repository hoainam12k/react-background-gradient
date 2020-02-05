import React from 'react';
import "./style.css";
export default class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0,
    }
  }
  componentWillMount() {
    this.handleAngle()
    this.setState({ angle: this.props.angle })
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //     let angle = this.state.angle;
  //     if (angle === nextProps.angle) {
  //         return true;
  //     }
  //     return false;
  // }

  mouseDown = (event) => {
    event.preventDefault();
    const obj = this
    let circle = document.getElementById('circle');
    let picker = document.getElementById('picker');
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

    // pickerCircle.addEventListener('mousedown', mousedown)
    let circle = document.getElementById('circle');

    circle.addEventListener('mousedown', function (event) {
      if (event.target == document.getElementById('picker-circle')) this.mouseDown(event)

    })
  }
  componentDidUpdate() {
    let picker = document.getElementById('picker');
    picker.style['transform'] = `rotate(${this.props.angle - 55}deg)`;

  }

  handleAngle = () => {
    this.props.chooseAngle(this.state.angle)
  }

  render() {
    return (
      <div id="circle">
        <div id="picker">
          <div className="picker-circle"
            onMouseDown={this.mouseDown}>
          </div>
        </div>
      </div>
    )
  }
}