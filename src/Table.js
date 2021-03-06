import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hex: 0,
      stop: 0,
      newActive: 'a',
      oldActive: 'b',
      turn: true,
      change: true,
      arrayHex: 0,
      arrayOffsetX: 0,
      check: false,
      type: '',
      test: false
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    let {range, active} = this.props;
    let hex = [];
    for (let i in range) {
      if (Number(i) === Number(active)) {
        range[i][active] = Number(active)
      }
    }
    let fillTable = range;
    for (let i in fillTable) {
      hex.push({ hex: fillTable[i].hex, r: fillTable[i].r, g: fillTable[i].g, b: fillTable[i].b, a: fillTable[i].a, offsetX: fillTable[i].offsetX, active: active, key: i });
    }
    this.setState({ hex: hex });
  }

  componentDidMount() {
    const {active} = this.props;
    this[active].style.border = '2px solid white'
  }

  componentDidUpdate() {
    const {active} = this.props;
    const {check, hex, test} = this.state
    const lengthRef = document.getElementsByName('hex').length;
    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white';
    if (check === true) {
      for (let i in hex) {
        this[`tr${hex[i].key}`].style.border = '';
      }
      this[`tr${active}`].style.border = '2px solid green';
    }

    if (test === true) {
      for (let i in hex) {
        this[`tr${hex[i].key}`].style.border = '';
      }
      this[`tr${active}`].style.border = '2px solid green';
    }
  }

  convertColor = (color) => {
    let hex = Number(color).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex
    }
    return hex;
  }

  rgbToHex = (r, g, b) => {
    let hex = '#' + this.convertColor(r) + this.convertColor(g) + this.convertColor(b);
    return hex
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    let range = nextProps.range;
    for (let i in range) {
      range[i].hex = this.rgbToHex(range[i].r, range[i].g, range[i].b, range[i].a1)
    }
    const active = nextProps.active;
    let hex = [];
    for (let i in range) {
      if (Number(i) === Number(active)) {
        range[i][active] = Number(active)
      }
    }
    const fillTable = range;
    for (let j in range) {
      hex.push({ hex: fillTable[j].hex, r: fillTable[j].r, g: fillTable[j].g, b: fillTable[j].b, a: fillTable[j].a, offsetX: fillTable[j].offsetX, active: active, key: j });
    };
    const newHex = Object.values(hex).sort(this.sortBy('offsetX', true, parseInt)).reverse();
    const arrayHex = newHex.map((val) => {
      return val.hex
    })
    let arrayOffsetX = newHex.map((val) => {
      return val.offsetX
    })

    this.setState({ hex: hex, change: true, arrayHex: arrayHex, arrayOffsetX: arrayOffsetX });
  }

  clickColorTable = (val, active) => {
    this.setState({check: true, test: true})
    const lengthRef = document.getElementsByName('hex').length;
    this.props.onClickColor(val, active);

    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white';
  }

  onChangeStop = (index) => {
    return e => {
      const { arrayOffsetX } = this.state;
      arrayOffsetX[index] = e.target.value;
      this.setState({ arrayOffsetX: arrayOffsetX });
    }
  }

  changeColorTable = (index) => {
    return e => {
      const { arrayHex } = this.state;
      arrayHex[index] = e.target.value;
      this.setState({ arrayHex: arrayHex });
    }
  }

  deleteColor = (key) => {
    this.props.deleteColor(key)
  }

  onBlurHex = (val) => {
    return e => {
      this.props.changeColorTable(val, e.target.value);
    }
  }

  onBlurOffset = (val) => {
    return e => {
      this.props.onChangeStop(val, e.target.value);
    }
  }

  onKeyPress = (val) => {
    return e => {
      if (e.key === 'Enter') {
        this.props.onChangeStop(val, e.target.value);
      }
    }
  }
  onKeyPressHex = (val) => {
    return e => {
      if (e.key === 'Enter') {
        this.props.changeColorTable(val, e.target.value);
      }
    }
  }

  table = () => {
    const { hex, arrayHex, arrayOffsetX } = this.state;
    const newHex = Object.values(hex).sort(this.sortBy('offsetX', true, parseInt)).reverse();
    return (
      newHex.map((val, index) => {
        return (
          <tr key={index} ref={ref => { this[`tr${val.key}`] = ref }} >
            <td
              style={{ background: val.hex }}
              data={index}
              onClick={() => { this.clickColorTable(val, val.key) }}
              ref={ref => { this[val.key] = ref }} />
            <td >
              <input style={{ height: '20px', width: '55px' }} name='hex' value={arrayHex[index] || ''}
                onChange={this.changeColorTable(index)}
                onClick={() => { this.clickColorTable(val, val.key) }}
                defaultChecked={val.hex}
                ref={ref => { this[`hex${val.key}`] = ref }}
                onBlur={this.onBlurHex(val)}
                onKeyPress={this.onKeyPressHex(val)}

              />
            </td>
            <td><input
              style={{ height: '20px', width: '55px' }}
              value={arrayOffsetX[index] || 0}
              onChange={this.onChangeStop(index)}
              onClick={() => { this.clickColorTable(val, val.key) }}
              onBlur={this.onBlurOffset(val)}
              ref={ref => { this[`offset${val.key}`] = ref }}
              onKeyPress={this.onKeyPress(val)}
            />
            </td>
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
