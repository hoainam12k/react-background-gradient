import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
  constructor() {
    super();
    this.state = {
      gradient: 'linear'
    }
  }
    onClick = (event) => {
      this.props.chooseGradient(event.target.name)
    }
    render() {
      return (
        <div className={style.button}>
          <button className={style.option_button} name='linear' onClick={this.onClick} >Linear</button>
          <button className={style.option_button} name='radial' onClick={this.onClick}>Radial</button>
        </div>
      )
    }
}

Button.propTypes = {
  chooseGradient: PropTypes.func.isRequired
}
