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
    let range = this.props.range;
    let active = this.props.active;
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
    this.setState({hex: hex});
  }

  componentDidMount() {
    let active = this.props.active;
    this[active].style.border = '2px solid white'
  }

  componentDidUpdate() {
    let active = this.props.active;
    let lengthRef = document.getElementsByName('hex').length;
    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white'
  }

  componentWillReceiveProps(nextProps) {
    let range = nextProps.range;
    let active = nextProps.active;
    let hex = [];
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

  clickColorTable = (val, active) => {
    let lengthRef = document.getElementsByName('hex').length;
    this.props.onClickColor(val, active);

    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white'
  }

  onChangeStop = (hex, key, val) => {
    return e => {
      const newHex = this.state.hex.reverse();
      for (let i in newHex) {
        if (Number(newHex[i].key) === Number(key)) {
          newHex[i].offsetX = e.target.value
        }
      }
      if (Number(e.target.value) < 100 && Number(e.target.value) > 0) { this.setState({hex: newHex}); }
      this.props.onChangeStop(val);
    }
  }

  changeColorTable = (hex, key, val) => {
    return e => {
      this.setState({change: false})
      let value = e.target.value
      const newHex = this.state.hex.reverse();
      for (let i in newHex) {
        if (Number(newHex[i].key) === Number(key)) {
          newHex[i].hex = value
        }
      }
      this.setState({hex: newHex})
      this.props.changeColorTable(val, value);
    }
  }

  deleteColor = (key) => {
    this.props.deleteColor(key)
  }

  table = () => {
    let {hex} = this.state;
    let newHex = Object.values(hex).sort(this.sortBy('offsetX', true, parseInt)).reverse();
    return (
      newHex.map((val, index) => {
        return (
          <tr key={index}>
            <td style={{background: val.hex}} data={index} onClick={() => { this.clickColorTable(val, val.key) }} ref={ref => { this[val.key] = ref }} />
            <td >
              <input style={{height: '20px', width: '55px'}} type='text' name='hex' value={val.hex}
                onChange={this.changeColorTable(val.hex, val.key, val)}
                onClick={() => { this.clickColorTable(val, val.key) }}
                defaultChecked={val.hex}
              />
            </td>
            <td><input
              style={{height: '20px', width: '55px'}}
              type='text' value={val.offsetX}
              onChange={this.onChangeStop(val.hex, val.key, val)}
              onClick={() => { this.clickColorTable(val, val.key) }}
            /></td>
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

Table.propTypes = {
  range: PropTypes.object.isRequired,
  active: PropTypes.number.isRequired,
  onClickColor: PropTypes.func,
  onChangeStop: PropTypes.func,
  deleteColor: PropTypes.func,
  changeColorTable: PropTypes.func
}
