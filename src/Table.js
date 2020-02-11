import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

export default class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      hex: [],
      stop: [],
      newActive: 'a',
      oldActive: 'b',
      test: 0,
      turn: true,
      change: true
    }
  }

  sortBy = (field, reverse, primer) => {
    const key = primer
      ? function (x) {
        return primer(x[field])
      }
      : function (x) {
        return x[field]
      };
    reverse = !reverse ? 1 : -1;
    return function (a, b) {
      a = key(a); b = key(b);
      let exp1 = a > b;
      let exp2 = b > a
      return reverse * (exp2 - exp1);
    }
  }

  componentWillMount() {
    let range = this.props.rangeChange();
    let active = this.props.active();
    let hex = [];
    for (let i in range) {
      if (Number(i) === Number(active)) {
        range[i][active] = Number(active)
      }
    }
    let fillTable = range;
    for (let i in fillTable) {
      hex.push({hex: fillTable[i].hex, r: fillTable[i].r, g: fillTable[i].g, b: fillTable[i].b, a: fillTable[i].a, offsetX: fillTable[i].offsetX, active: active, key: i});
    }
    console.log(hex, 'hex')
    this.setState({hex: hex});
  }

  componentDidMount() {
    let active = this.props.active();
    this[active].style.border = '2px solid white'
  }

  componentDidUpdate() {
    let active = this.props.active();
    let lengthRef = document.getElementsByName('hex').length;
    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white'

    console.log(this.state.hex, 'didMount')
  }

  componentWillReceiveProps() {
    // console.log(this.props.change(), 'change')
    let range = this.props.rangeChange();
    let active = this.props.active();
    let {change} = this.state
    let hex = [];
    console.log(change, 'change')
    if (change === true) {
      for (let i in range) {
        if (Number(i) === Number(active)) {
          range[i][active] = Number(active)
        }
      }
      let fillTable = range
      for (let j in range) {
        hex.push({hex: fillTable[j].hex, r: fillTable[j].r, g: fillTable[j].g, b: fillTable[j].b, a: fillTable[j].a, offsetX: fillTable[j].offsetX, active: active, key: j});
      }
      this.setState({hex: hex, change: true});
    }
  }

  clickColorTable = (val, active) => {
    // this.setState({change: false})
    let lengthRef = document.getElementsByName('hex').length;
    this.props.onClickColor(val, active);

    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white'
  }

  onChangeStop = (hex, key, val) => e => {
    console.log(e.target.value)
    const newHex = this.state.hex.reverse();
    this.props.onChangeStop(val);
    for (let i in newHex) {
      if (Number(newHex[i].key) === Number(key)) {
        newHex[i].offsetX = e.target.value
      }
    }
    this.setState({hex: newHex})
  }

  changeColorTable = (hex, key, val) => e => {
    this.setState({change: false})
    let value = e.target.value
    this.props.changeColorTable(val);
    const newHex = this.state.hex.reverse();
    for (let i in newHex) {
      if (Number(newHex[i].key) === Number(key)) {
        newHex[i].hex = value
      }
    }

    this.setState({hex: newHex})
  }

  deleteColor = (key) => {
    console.log(key);
    this.props.deleteColor(key)
  }

  table = () => {
    let {hex} = this.state;
    console.log(hex, 'table')
    let newHex = Object.values(hex).sort(this.sortBy('offsetX', true, parseInt)).reverse();
    return (
      newHex.map((val, index) => {
        return (
          <tr>
            <td style={{background: val.hex}} data={index} onClick={() => { this.clickColorTable(val, val.key) }} ref={ref => { this[val.key] = ref }} />
            <td >
              <input style={{height: '20px', width: '55px'}} type='text' name='hex' value={val.hex}
                onChange={this.changeColorTable(val.hex, val.key, val)}
                onClick={() => { this.clickColorTable(val, val.key) }}
              />
            </td>
            <td><input style={{height: '20px', width: '55px'}} type='text' value={val.offsetX} onChange={this.onChangeStop(val.hex, val.key, val)} /></td>
            <td><button onClick={() => this.deleteColor(val.key)}>Delete</button></td>
          </tr>
        )
      })
    )
  }

  render() {
    return (
      <div>
        <table className={style.listColor}>
          <tbody>
            <tr>
              <th>COLOR</th>
              <th>HEX</th>
              <th>STOP</th>
              <th>DELETE</th>
            </tr>
            {this.table()}
          </tbody></table>
      </div>
    )
  }
}
