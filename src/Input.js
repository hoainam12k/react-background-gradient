import React from 'react';
import style from './style.css'
import PropTypes from 'prop-types';

export default class Input extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: 0
    }
  }
  componentDidMount() {
    this.setState({ inputValue: this.props.angle })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ inputValue: nextProps.angle })
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  onKeyPress = () => {
    this.props.editAngle(this.state.inputValue);
  }
  render() {
    return (
      <div>
        <input className={style.input} type='text' name='inputValue' value={this.state.inputValue}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
        />
      </div>
    )
  }
}

Input.propTypes = {
  editAngle: PropTypes.func.isRequired,
  angle: PropTypes.number
}
