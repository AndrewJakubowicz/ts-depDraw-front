import React, { Component } from 'react';
import './App.css';

import {CodeDisplayEditor} from './components/myCodeMirror';
import {OpenFileTabs} from './components/fileTabs';
import {DragonFly} from './components/dragonfly';



class App extends Component {
  render() {
    return (
      <div className="App flexbox">
        <div className="row content"></div>
        <DragonFly />
        <OpenFileTabs />
        <CodeDisplayEditor />
      </div>
    );
  }
}
export default App;
