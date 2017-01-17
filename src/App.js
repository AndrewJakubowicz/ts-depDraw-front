import React, { Component } from 'react';
import './App.css';

import {CodeDisplayEditor} from './components/myCodeMirror';



class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>MVP - ts-depDraw</h2>
        </div>
        <div id="d3-root"></div>
       <CodeDisplayEditor />
      </div>
    );
  }
}
export default App;
