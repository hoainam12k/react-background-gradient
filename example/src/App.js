import React, { Component } from 'react'

import ExampleComponent from 'react-bg-gradient'
import { Palettle } from './colorPalettle';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      gradient: {
        range: [
          {
            offsetX: 15,
            // r: 34,
            // g: 27,
            // b: 32,
            // a: 1,
            hex: '#221b20'
          },
          {
            offsetX: 50,
            // r: 134,
            // g: 57,
            // b: 62,
            // a: 1,
            hex: '#86393E'
          }
        ],
        angle: 30,
        type: 'radial',
        palettle: Palettle
      }
    }
  }

  
  handleChange = (color) => {
    console.log(color)
  }

  render() {
    // console.log(this.state.gradient)
    return (
      <div>
        <ExampleComponent gradient={this.state.gradient} onChange={this.handleChange} />      
     </div>
    )
  }
}
