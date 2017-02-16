import React, { Component } from 'react';
import './App.css';
import Paper from 'material-ui/Paper';

import {StartModalBox} from './components/modalContinueLoadBox';
import {CodeDisplayEditor} from './components/myCodeMirror';
import {OpenFileTabs} from './components/fileTabs';
import {DragonFly} from './components/dragonfly';



class App extends Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <StartModalBox />
        <DragonFly />
      <div className="App flexbox">
        <div className="bottom-half">
          <Paper zDepth={1} style={{height:'100%'}}>
          <OpenFileTabs />
          <CodeDisplayEditor />
          </Paper>
        </div>
      </div>
      </div>
    );
  }
}
export default App;
