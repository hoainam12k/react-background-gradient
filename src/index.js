import React from 'react';
import { SketchPicker } from 'react-color';
import Circle from './Circle';
import Input from './Input';
import style from './style.css';
import PropTypes from 'prop-types';
import Button from './Button';
import ManaualColor from './ManualColor'
const WIDTH_SLIDER = 500;
export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: '',
      background: { rgba: { r: 164, g: 26, b: 58, a: 1 }, hex: '#A41A3A' },
      rangeVal: '1',
      move: false,
      first: 1,
      angle: 0,
      gradient: 'linear'
    };
    this.isDragging = false;
  }

  onMouseDown = value => {
    return (event) => {
      event = event || window.event;
      event.preventDefault();
      const obj = this;
      let range = this.state.range
      let shiftX = event.clientX - document.getElementById(value).getBoundingClientRect().left; // lấy khoảng cách giữa thumb và đầu slider
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      function onMouseMove(event) {
        let newLeft = event.clientX - shiftX - obj.slider.getBoundingClientRect().left; // độ dịch chuyển mới so với vị trị cũ của thumb
        if (newLeft < 0) {
          newLeft = 0;
        }
        if (newLeft > 500) {
          newLeft = 500;
        }

        range[value].offsetX = newLeft / 5;

        obj.setState({ range: range })

        document.getElementById(value).style.left = newLeft + 'px';
        this.isDragging = true;
      }

      function onMouseUp(e) {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  }

  // hàm xử lý màu của react-color, đồng thời lấy màu hiện tại của bảng màu.
  handleChangeComplete = (color) => {
    let temp = this.state.range;
    let rangeVal = this.state.rangeVal;
    //
    temp[this.state.rangeVal] = {
      offsetX: Number(this.state.range[rangeVal].offsetX),
      r: color.rgb.r,
      g: color.rgb.g,
      b: color.rgb.b,
      a: color.rgb.a,
      hex: color.hex
    }
    let background = this.state.background;
    background.rgba = color.rgb;
    background.hex = color.hex;
    this.setState({ background: background, range: temp });
  };

  mixColor = (color1, color2) => {
    let ratio = 0.5;
    let hex = function (x) {
      x = x.toString(16);
      return (x.length === 1) ? '0' + x : x;
    };
    let r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    let g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    let b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));
    return {
      r: r,
      g: g,
      b: b,
      a: 1,
      hex: '#' + hex(r) + hex(g) + hex(b)
    }
  }

  // sự kiện click vào slider để thêm thumb mới.
  onClick = (e) => {
    if (!this.isDragging) {
      let offset = Math.round(e.nativeEvent.offsetX / 5); // lấy vị trí hiện tại trên thanh slider
      if (offset < 0) offset = 0;
      if (offset > WIDTH_SLIDER) offset = WIDTH_SLIDER;
      const arrayRanges = Object.values(this.state.range);
      // tìm xem thumb đã có trong object range
      for (let i = 0; i < arrayRanges.length; i++) {
        var isExist = Object.values(arrayRanges[i]).find(e => e === offset);
      }
      if (!isExist) {
        var color = arrayRanges.sort(this.sortBy('offsetX', true, parseInt));
        let idx = '';
        if (color[0].offsetX < offset) {
          let range = Object.entries(this.state.range);
          let index = range[range.length - 1][0]
          const key = `${parseInt(index) + 1}`;
          var newRange = this.state.range;
          Object.assign(newRange, {
            [key]: {
              offsetX: Number(offset),
              r: color[0].r,
              g: color[0].g,
              b: color[0].b,
              a: color[0].a,
              hex: color[0].hex
            }
          });
          let background = { rgba: { r: color[0].r, g: color[0].g, b: color[0].b, a: color[0].a }, hex: color[0].hex };
          this.setState({
            range: newRange,
            rangeVal: key,
            first: key,
            background: background
          })
          document.getElementById(this.state.first).style.border = '';
        } else
        if (color[color.length - 1].offsetX > offset) {
          let range = Object.entries(this.state.range);
          let index = range[range.length - 1][0]
          const key = `${parseInt(index) + 1}`;
          let newRange = this.state.range;
          Object.assign(newRange, {
            [key]: {
              offsetX: Number(offset),
              r: color[color.length - 1].r,
              g: color[color.length - 1].g,
              b: color[color.length - 1].b,
              a: color[color.length - 1].a,
              hex: color[color.length - 1].hex
            }
          });
          let background = { rgba: { r: color[color.length - 1].r, g: color[color.length - 1].g, b: color[color.length - 1].b, a: color[color.length - 1].a }, hex: color[color.length - 1].hex };
          this.setState({
            range: newRange,
            rangeVal: key,
            first: key,
            background: background
          })
          document.getElementById(this.state.first).style.border = '';
        } else {
          for (let i = color.length - 1; i >= 0; i--) {
            if (color[i].offsetX > offset) {
              idx = i;
              break;
            }
          };
          let mixColor = this.mixColor(color[idx].hex.substr(1), color[idx + 1].hex.substr(1));
          let range = Object.entries(this.state.range);
          let index = range[range.length - 1][0]
          const key = `${parseInt(index) + 1}`;
          let newRange = this.state.range;
          Object.assign(newRange, {
            [key]: {
              offsetX: Number(offset),
              r: mixColor.r,
              g: mixColor.g,
              b: mixColor.b,
              a: mixColor.a,
              hex: mixColor.hex
            }
          });
          let background = { rgba: { r: mixColor.r, g: mixColor.g, b: mixColor.b, a: mixColor.a }, hex: mixColor.hex };

          this.setState({
            range: newRange,
            rangeVal: key,
            first: key,
            background: background
          })
          document.getElementById(this.state.first).style.border = '';
        }
      }
    }
  }

  // hàm lấy thumb hiện tại khi click vào
  onClickThumb = (value, range) => {
    let background = { rgba: { r: range.r, g: range.g, b: range.b, a: range.a }, hex: range.hex };
    document.getElementById(this.state.first).style.border = '';
    Object.assign(document.getElementById(value).style, { border: '0.7px solid white' });
    this.setState({
      rangeVal: value,
      background: background,
      first: Number(value)
    })
  }

  // hàm xóa thumb khỏi slider và màu khỏi bảng màu
  deleteColor = (offsetX) => {
    let range = this.state.range;
    let objectRange = Object.entries(range);
    let length = objectRange.length;
    let index = '';
    if (length > 2) {
      for (var i = 0; i < length; i++) {
        if (objectRange[i][1].offsetX === Number(offsetX)) {
          index = objectRange[i][0];
          break;
        }
      }
    }
    if (index !== '') {
      delete range[index];
      let offsetMax = Object.values(range).sort(this.sortBy('offsetX', true, parseInt));
      let rangeVal = objectRange.filter(val => val[1].offsetX === offsetMax[0].offsetX);
      document.getElementById(this.state.first).style.border = '';
      document.getElementById(rangeVal[0][0]).style.border = '0px solid white';
      this.setState({ range: range, rangeVal: rangeVal[0][0], first: rangeVal[0][0] })
    }
  }
  // hàm sắp xếp object, với đầu vào là filed là trường cần mong muốn sắp xếp, reverse dưới dạng boolean có muốn sắp xếp ngưowjc hay không, trường primer là trường định dạng giá trị của trường field là int hay float....
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
      return reverse * (exp1 - exp2);
    }
  }
  // hàm hiển thị các giá trị của bảng màu.
  table = () => {
    let range = this.state.range
    let fillTable = Object.values(range).sort(this.sortBy('offsetX', true, parseInt));
    return (
      Object.values(fillTable).map((val, index) => {
        return (
          <tr>
            <td style={{ background: val.hex, width: '2px', height: '2px', border: '0.7px solid white' }} />
            <td>{val.hex}</td>
            <td>{val.offsetX}</td>
            <td><button onClick={() => this.deleteColor(val.offsetX)}>Delete</button></td>
          </tr>
        )
      })
    )
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

  componentWillMount() {
    this.setState({ range: this.props.range, angle: this.props.angle })
  }

  componentDidUpdate() {
    document.getElementById(this.state.first).style.border = '0.7px solid white';
  }

  handleAngle = (angle) => {
    this.setState({ angle: angle })
  }
  handleGradient = (gradient) => {
    if (gradient === 'radial') {
      this.change.style.display = 'none';
    } else {
      this.change.style.display = '';
    }
    this.setState({gradient: gradient})
  }

  handleManualColor = (value) => {
    let {color1, color2, angle} = value;
    let range = {
      1: {
        offsetX: color1.range,
        r: color1.r,
        g: color1.g,
        b: color1.b,
        a: color1.a,
        hex: color1.hex
      },
      2: {
        offsetX: color2.range,
        r: color2.r,
        g: color2.g,
        b: color2.b,
        a: color2.a,
        hex: color2.hex
      }
    }

    let background = { rgba: { r: color1.r, g: color1.g, b: color1.b, a: color1.a }, hex: color1.hex };

    this.setState({range: range, angle: angle, background: background, first: 1, rangeVal: 1});
  }
  editAngle = (value) => {
    this.setState({ angle: value })
  }
  render() {
    const { range, gradient } = this.state;
    let val = Object.values(range);
    let background1 = '';
    if (gradient === 'linear') {
      background1 = `-webkit-linear-gradient(${this.state.angle}deg, `;
    } else {
      background1 = `-webkit-radial-gradient(circle, `
    }
    let background2 = `-webkit-linear-gradient(0deg, `;
    let colorVal = val.sort(this.sortBy('offsetX', true, parseInt));
    for (var i = colorVal.length - 1; i >= 0; i--) {
      background1 = background1 + `rgba(${colorVal[i].r},${colorVal[i].g},${colorVal[i].b},${colorVal[i].a}) ${colorVal[i].offsetX}%,`;
      background2 = background2 + `rgba(${colorVal[i].r},${colorVal[i].g},${colorVal[i].b},${colorVal[i].a}) ${colorVal[i].offsetX}%,`;
    }
    background1 = background1.substring(0, background1.length - 1) + ')';
    background2 = background2.substring(0, background2.length - 1) + ')';
    return (
      <div>
        <div className={style.slider}
          ref={
            el => { this.slider = el }
          }
        >
          <div className={style.fillColor}
            style={{ width: WIDTH_SLIDER, background: background2 }}
            onClick={this.onClick} />
          {Object.entries(this.state.range).map((value, index) =>
            <div
              name={value[0]}
              id={value[0]}
              style={{
                left: Math.round(this.state.range[value[0]].offsetX * 5),
                background: `rgb(${value[1].r},${value[1].g},${value[1].b})`
              }}
              className={style.thumb}
              onMouseDown={
                this.onMouseDown(value[0])
              }
              onClick={() => this.onClickThumb(value[0], value[1])}
            />
          )}
        </div>
        <div className={style.color}>
          <div>
            <SketchPicker
              color={this.state.background.rgba}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
          <div className='circle-table'>
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
            <div className={style.change} ref={ref => { this.change = ref }}>
              <Circle
                chooseAngle={this.handleAngle}
                angle={this.state.angle}
              />
              <Input angle={this.state.angle} editAngle={this.editAngle} />
            </div>
          </div>
        </div>
        <div className={style.displayColor}>
          <div className={style.table}
            style={{ background: background1 }}
          />
          <div>
            <Button chooseGradient={this.handleGradient} />
          </div>
          <div>
            <ManaualColor chooseManualColor={this.handleManualColor} newGradient={this.state.gradient} angle={this.state.angle} />
          </div>
        </div>
      </div>
    );
  }
};

Slider.propTypes = {
  range: PropTypes.string.isRequired,
  angle: PropTypes.string.isRequired
}
