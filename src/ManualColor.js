import React from 'react';
import PropTypes from 'prop-types';
import color from './color';
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
       for (let i in color) {
         let backGround = `-webkit-linear-gradient(${color[i].angle}deg, rgba(${color[i].color1.r},${color[i].color1.g},${color[i].color1.b},1) ${color[i].color1.range}%, rgba(${color[i].color2.r},${color[i].color2.g},${color[i].color2.b},1) ${color[i].color2.range}%)`
         arrayGradient.push(backGround)
       };
     } else {
       for (let i in color) {
         let backGround = `-webkit-radial-gradient(circle, rgba(${color[i].color1.r},${color[i].color1.g},${color[i].color1.b},1) ${color[i].color1.range}%, rgba(${color[i].color2.r},${color[i].color2.g},${color[i].color2.b},1) ${color[i].color2.range}%)`
         arrayGradient.push(backGround)
       };
     }

     return (
       Object.values(color).map((val, index) => {
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
