import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import {createCodeBlock} from './util/myCodeMirror';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

createCodeBlock('crap.ts');
