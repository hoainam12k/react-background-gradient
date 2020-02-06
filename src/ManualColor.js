import React from 'react';
import PropTypes from 'prop-types';
import { Palettle } from './colorPalettle';
import style from './style.css';

export default class ManualColor extends React.Component {
  constructor() {
    super();
    this.state = {
      gradient: 'linear',
      btn: ''
    }
  }

  onClick = (val, index) => {
    this.props.chooseManualColor(val);
    let listBtn = document.getElementsByName('manualColor').length;
    for (let i = 0; i < listBtn; i++) {
      if (index !== i) {
        Object.assign(document.getElementsByName('manualColor')[i].style, { border: '' });
      }
    }
    Object.assign(document.getElementById(val + index).style, { border: '2px solid #1F2667' });
  }

  shouldComponentUpdate() {
    let {newGradient} = this.props;
    let {gradient} = this.state;
    if (newGradient !== gradient) {
      return false
    } else { return true }
  }

  componentWillReceiveProps(nextProps) {
    let {newGradient} = nextProps;
    this.setState({gradient: newGradient})
  }

  table = () => {
    let arrayGradient = [];
    let {gradient} = this.state;
    if (gradient === 'linear') {
      for (let i in Palettle) {
        let backGround = `linear-gradient(${Palettle[i].angle}deg, rgba(${Palettle[i].color1.r},${Palettle[i].color1.g},${Palettle[i].color1.b},1) ${Palettle[i].color1.range}%, rgba(${Palettle[i].color2.r},${Palettle[i].color2.g},${Palettle[i].color2.b},1) ${Palettle[i].color2.range}%)`
        arrayGradient.push(backGround)
      };
    } else {
      for (let i in Palettle) {
        let backGround = `radial-gradient(circle, rgba(${Palettle[i].color1.r},${Palettle[i].color1.g},${Palettle[i].color1.b},1) ${Palettle[i].color1.range}%, rgba(${Palettle[i].color2.r},${Palettle[i].color2.g},${Palettle[i].color2.b},1) ${Palettle[i].color2.range}%)`
        arrayGradient.push(backGround)
      };
    }

    return (
      Object.values(Palettle).map((val, index) => {
        return (
          <div name='manualColor' className={style.manualColor} id={val + index} style={{background: arrayGradient[index]}} onClick={() => this.onClick(val, index)} />
        )
      })
    )
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        {this.table()}
      </div>
    )
  }
}

ManualColor.propTypes = {
  chooseManualColor: PropTypes.func.isRequired,
  newGradient: PropTypes.string.isRequired
}
