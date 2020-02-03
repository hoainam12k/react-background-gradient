import React from 'react';
import "./style.css";
export default class Circle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            angle: -55,
        }
    }
    componentWillMount() {
        this.setState({ angle: this.props.angle })
    }
    componentDidMount() {
        const obj = this
        let circle = document.getElementById('circle');
        let picker = document.getElementById('picker');
        let pickerCircle = picker.firstElementChild;
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

        let mousedown = (event) => {
            event.preventDefault()
            document.body.style.cursor = 'default'
            mousemove(event)
            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        };

        let mousemove = (event) => {
            obj.setState({ angle: rotate(event.pageX, event.pageY) });
            obj.handleAngle();
            let deg = rotate(event.pageX, event.pageY) - 55;
            picker.style[transform] = 'rotate(' + deg + 'deg)'
        };

        let mouseup = function () {
            document.body.style.cursor = null;
            document.removeEventListener('mouseup', mouseup)
            document.removeEventListener('mousemove', mousemove)
        };



        pickerCircle.addEventListener('mousedown', mousedown)


        circle.addEventListener('mousedown', function (event) {
            if (event.target == this) mousedown(event)

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
                    <div id="picker-circle">
                    </div>
                </div>
            </div>
        )
    }
}