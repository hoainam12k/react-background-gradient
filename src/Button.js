import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: 'linear'
    }
  }
    onClick = (event) => {
      this.setState({val: event.target.value})
      this.props.chooseGradient(event.target.value)
    }

    componentDidUpdate() {
      const {val} = this.state;
      this[`${val}`].checked = true;
    }

    render() {
      return (
        <div className={style.button} >
          <input type='radio' value='linear' onClick={this.onClick} ref={ref => { this['linear'] = ref }} name='radio' /> Linear
          <input type='radio' value='radial' onClick={this.onClick} ref={ref => { this['radial'] = ref }} name='radio' /> Radial
        </div>
      )
    }
}

Button.propTypes = {
  chooseGradient: PropTypes.func
}
