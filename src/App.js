import React, { Component } from 'react';
import './App.css';

import {CodeDisplayEditor} from './components/myCodeMirror';
import {OpenFileTabs} from './components/fileTabs';



class App extends Component {
  render() {
    return (
      <div className="App flexbox">
        <div className="App-header">
          <h2>MVP - ts-depDraw</h2>
        </div>
        <div className="row content"></div>
       <OpenFileTabs />
       <CodeDisplayEditor />
      </div>
    );
  }
}
export default App;
