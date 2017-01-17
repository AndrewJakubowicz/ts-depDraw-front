import React, { Component } from 'react';
import './App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>MVP - ts-depDraw</h2>
        </div>
        <div id="d3-root"></div>
        <div id="code-box"></div>
      </div>
    );
  }
}

export default App;
