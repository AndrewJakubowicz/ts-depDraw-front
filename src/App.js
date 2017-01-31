import React, { Component } from 'react';
import './App.css';
import Paper from 'material-ui/Paper';

import {CodeDisplayEditor} from './components/myCodeMirror';
import {OpenFileTabs} from './components/fileTabs';
import {DragonFly} from './components/dragonfly';



class App extends Component {
  render() {
    return (
      <div className="App flexbox">
        <div className="row content"></div>
        <DragonFly />
        <Paper style={{width: '90%',
                      margin: '0 auto 0 auto'}} zDepth={1}>
        <OpenFileTabs />
        <CodeDisplayEditor />
        </Paper>
      </div>
    );
  }
}
export default App;
