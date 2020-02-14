import React, { Component } from 'react'

import ExampleComponent from 'react-bg-gradient'
import { Palettle } from './colorPalettle';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      range: [
         {
          offsetX: 15,
          r: 34,
          g: 27,
          b: 32,
          a: 1,
          hex: '#221B20'
        },
         {
          offsetX: 50,
          r: 134,
          g: 57,
          b: 62,
          a: 1,
          hex: '#86393E'
        }
      ],
      angle: 0,
      palettle: Palettle
    }
  }

  onChange = () => {
    return this.state
  }

  render() {
    return (
      <div>
        <ExampleComponent onChange={this.onChange} />
      </div>
    )
  }
}
