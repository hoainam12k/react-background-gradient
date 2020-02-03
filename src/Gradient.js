import React from 'react';
import { SketchPicker } from 'react-color';
// import "./styles.css"


class Range extends React.Component {
    constructor(props) {
        super(props);
        this.updateRange = this.updateRange.bind(this);
        this.clickRange = this.clickRange.bind(this);
    }


    componentDidMount() {
        this.style = '.range::-webkit-slider-thumb {background : red }'
    }
    sort_by = (field, reverse, primer) => {
        const key = primer ?
            function (x) {
                return primer(x[field])
            } :
            function (x) {
                return x[field]
            };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    updateRange(e) {
        this.props.updateRange(e.target.value);
    }
    clickRange(e) {
        this.props.clickRange(e.target.value)
    }
    render() {
        const { range, val } = this.props;
        let background_i = 'linear-gradient(to right, ';
        let color_val = val.sort(this.sort_by('offsetX', true, parseInt));
        for (var i = color_val.length - 1; i >= 0; i--) {
            background_i = background_i + `rgba(${color_val[i].r},${color_val[i].g},${color_val[i].b}, ${color_val[i].a}),`
        }
        background_i = background_i.substring(0, background_i.length - 1) + ')'
        return (
            <div>
                <input id="range" type="range"
                    className="range"
                    style={{ backgroundImage: background_i }}
                    value={Number(range)}
                    min="0"
                    max="100"
                    step="1"
                    onChange={this.updateRange}
                    onClick={this.clickRange}
                />
            </div>
        )
    }
}

const WIDTH_SLIDER = 500;


export default class Gradient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            range: {
                rangeVal_1: {
                    offsetX: 0,
                    r: 34,
                    g: 27,
                    b: 32,
                    a: 1,
                },
                rangeVal_2: {
                    offsetX: 100,
                    r: 34,
                    g: 57,
                    b: 62,
                    a: 1,
                }
            },
            background: { r: 164, g: 26, b: 58, a: 1 },
            rangeVal: 'rangeVal_1'
        };
        this.isDragging = false;
    }

    handleChangeComplete = (color) => {
        let temp = this.state.range;
        let range_val = this.state.rangeVal;
        temp[this.state.rangeVal] = {
            offsetX: this.state.range[range_val].offsetX,
            r: color.rgb.r,
            g: color.rgb.g,
            b: color.rgb.b,
            a: color.rgb.a
        }
        this.setState({ background: color.rgb, range: temp });
    };

    clickRange = (key) => (val) => {
        this.setState({
            rangeVal: key

        })
    }
    updateRange = (key) => (val) => {
        this.isDragging = true;
        let t = this.state.range[key];
        t.offsetX = val;
        let temp = this.state.range;
        temp[key] = t;
        this.setState({
            range: temp,
            rangeVal: key
        })

    }

    onMouseDown = () => {
        this.isDragging = false;
    }

    onMouseUp = (e) => {
        if (!this.isDragging) {
            let offset = Math.round(e.nativeEvent.offsetX / 5);
            if (offset < 0) offset = 0;
            if (offset > WIDTH_SLIDER) offset = WIDTH_SLIDER;
            const arrayRanges = Object.values(this.state.range);
            for (let i = 0; i < arrayRanges.length; i++) {
                var isExist = Object.values(arrayRanges[i]).find(e => e === offset);
            }
            if (!isExist) {
                const key = `rangeVal_${arrayRanges.length + 1}`;
                var t = this.state.range;
                let background = this.state.background;

                Object.assign(t, {
                    [key]: {
                        offsetX: offset,
                        r: background.r,
                        g: background.g,
                        b: background.b,
                        a: background.a
                    }
                });
                var oldArray = t;
                this.setState({
                    range: oldArray,
                    rangeVal: key
                })
            }
        }

    }

    sort_by = (field, reverse, primer) => {
        const key = primer ?
            function (x) {
                return primer(x[field])
            } :
            function (x) {
                return x[field]
            };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }


    render() {
        const { background } = this.state;
        let val = Object.values(this.state.range);
        let background_image = '-webkit-linear-gradient(285deg, ';
        let color_val = val.sort(this.sort_by('offsetX', true, parseInt));
        for (var i = color_val.length - 1; i >= 0; i--) {
            background_image = background_image + `rgba(${color_val[i].r},${color_val[i].g},${color_val[i].b}) ${color_val[i].offsetX}%,`
        }
        background_image = background_image.substring(0, background_image.length - 1) + ')'
        return (
            <div id='container'>
                <div id='test' style={{
                    width: WIDTH_SLIDER,
                    height: 10
                }} onMouseUp={this.onMouseUp} onMouseDown={this.onMouseDown}>

                    {Object.entries(this.state.range).map((el, idx) => <Range key={idx} color={this.state.background} val={Object.values(this.state.range)} range={this.state.range[el[0]].offsetX} clickRange={this.clickRange(`${el[0]}`)} updateRange={this.updateRange(`${el[0]}`)} />
                    )}
                </div>
                <SketchPicker
                    color={background}
                    onChangeComplete={this.handleChangeComplete}
                />
                <div id='table'
                    style={{ background: background_image }}
                >
                </div>
            </div>
        )
    }
}
