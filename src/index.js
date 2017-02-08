import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';


// REDUX DEPENDENCIES
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createLogger from 'redux-logger';

import * as actions from './actions';
import {rootReducer} from './reducers';
import {rootEpic} from './epics';


// MATERIAL UI DEPENDENCIES
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


// // D3
// var d3Graph = require('./components/d3Graph')();

const epicMiddleWare = createEpicMiddleware(rootEpic);
const logger = createLogger();
let store = createStore(rootReducer,
            applyMiddleware(epicMiddleWare, logger));
window.store = store;
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// Init stuff
setTimeout(_ => {
  store.dispatch({type: actions.INIT_PROGRAM});
}, 1);

// Close the dragonfly if they click away from the codeMirror.
window.addEventListener("click", e => {
  store.dispatch(actions.closeDragonfly());
  store.dispatch(actions.resetFilter());
})
