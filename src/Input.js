import React from 'react';
import './style.css'

export default class Input extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: 0,
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
        // this.props.editAngle(this.state.inputValue);

    }
    onKeyPress = () => {
        this.props.editAngle(this.state.inputValue);
    }
    render() {
        return (
            <div>
                <input id='input' type='text' name='inputValue' value={this.state.inputValue}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                />
            </div>
        )
    }
}
