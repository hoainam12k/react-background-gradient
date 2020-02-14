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
      test: 0,
      turn: true,
      change: true,
      arrayHex: 0,
      arrayOffsetX: 0,
      check: false
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
    const {check, hex} = this.state
    const lengthRef = document.getElementsByName('hex').length;
    for (let i = 0; i < lengthRef; i++) {
      document.querySelector(`[data='${i}']`).style.border = '';
    }
    this[active].style.border = '2px solid white';
    // if (check === true) {
    //   for (let i in hex) {
    //     this[`offset${hex[i].key}`].blur();
    //   }
    //   this[`offset${active}`].focus();
    // }
    if (check === true) {
      for (let i in hex) {
        this[`tr${hex[i].key}`].style.border = '';
        // this[`offset${hex[i].key}`].blur();
      }
      this[`tr${active}`].style.border = '2px solid green';
      // this[`offset${active}`].focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    let range = nextProps.range;
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
    this.setState({check: true})
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

  // onKeyPress = (val) => {
  //   return e => {
  //     if (e.key === 'Enter') {
  //       this.props.onChangeStop(val, e.target.value);
  //       this.setState({check: true});
  //     }
  //   }
  // }
  onBlurHex = (val) => {
    return e => {
      // if (e.currentTarget.contains(e.relatedTarget)) {
      this.props.changeColorTable(val, e.target.value);
      this.setState({check: true});
      // }
    }
  }

  onBlurOffset = (val) => {
    return e => {
      // if (e.currentTarget.contains(e.relatedTarget)) {
      this.props.onChangeStop(val, e.target.value);
      this.setState({check: true});
      // }
    }
  }

  // onKeyPressHex = (val) => {
  //   return e => {
  //     if (e.key === 'Enter') {
  //       this.props.changeColorTable(val, e.target.value);
  //     }
  //   }
  // }
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
              <input style={{ height: '20px', width: '55px' }} type='text' name='hex' value={arrayHex[index]}
                onChange={this.changeColorTable(index)}
                onClick={() => { this.clickColorTable(val, val.key) }}
                // onKeyPress={this.onKeyPressHex(val)}
                defaultChecked={val.hex}
                ref={ref => { this[`hex${val.key}`] = ref }}
                onBlur={this.onBlurHex(val)}

              />
            </td>
            <td><input
              style={{ height: '20px', width: '55px' }}
              type='text' value={arrayOffsetX[index]}
              onChange={this.onChangeStop(index)}
              // onKeyPress={this.onKeyPress(val)}
              onClick={() => { this.clickColorTable(val, val.key) }}
              onBlur={this.onBlurOffset(val)}
              ref={ref => { this[`offset${val.key}`] = ref }}
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
  range: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
  onClickColor: PropTypes.func,
  onChangeStop: PropTypes.func,
  deleteColor: PropTypes.func,
  changeColorTable: PropTypes.func
}
