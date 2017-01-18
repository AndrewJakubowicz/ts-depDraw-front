import React, { Component } from 'react';
import './App.css';

import {CodeDisplayEditor} from './components/myCodeMirror';
import {OpenFileTabs} from './components/fileTabs';

// D3 stuff
import {Chart} from './components/d3Component/Chart';

var sampleData = [
  {id: '412312fsd', x: 7, y:41, z:6},
  {id: 'asdsad', x: 300, y:40, z:20},
  {id: 'gsefsd', x: 200, y:20, z:3},
  {id: 'zxctesr', x: 520, y:100, z:38}
]



class App extends Component {
  render() {
    return (
      <div className="App flexbox">
        <div className="App-header">
          <h2>MVP - ts-depDraw</h2>
        </div>
        <div className="row content">
          <Chart
            data={sampleData} />
        </div>
       <OpenFileTabs />
       <CodeDisplayEditor />
      </div>
    );
  }
}
export default App;
