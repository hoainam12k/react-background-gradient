import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: ''
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.setState({val: this.props.type})
  }
  componentDidMount() {
    const {type} = this.props
    this.props.chooseGradient(type)
    this[`${type}`].checked = true;
  }
    onClick = (event) => {
      this.setState({val: event.target.value})
      this.props.chooseGradient(event.target.value)
    }

    componentDidUpdate() {
      let {val} = this.state;
      this[`${val}`].checked = true;
    }

    render() {
      return (
        <div className={style.button} >
          <label><input type='radio' value='linear' onClick={this.onClick} ref={ref => { this['linear'] = ref }} name='radio' /> Linear</label>
          <label><input type='radio' value='radial' onClick={this.onClick} ref={ref => { this['radial'] = ref }} name='radio' /> Radial</label>
        </div>
      )
    }
}

Button.propTypes = {
  chooseGradient: PropTypes.func,
  type: PropTypes.string
}
