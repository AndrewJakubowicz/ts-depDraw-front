import React, { Component } from 'react';
import './App.css';

import {CodeDisplayEditor} from './components/myCodeMirror';
import {OpenFileTabs} from './components/fileTabs';

// D3 stuff
import {Chart} from './components/d3Component/Chart';


class App extends Component {
  render() {
    return (
      <div className="App flexbox">
        <div className="App-header">
          <h2>MVP - ts-depDraw</h2>
        </div>
        <div className="row content">
          <Chart />
        </div>
       <OpenFileTabs />
       <CodeDisplayEditor />
      </div>
    );
  }
}
export default App;
