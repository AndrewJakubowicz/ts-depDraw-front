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

// // D3
// var d3Graph = require('./components/d3Graph')();

const epicMiddleWare = createEpicMiddleware(rootEpic);
const logger = createLogger();
let store = createStore(rootReducer,
            applyMiddleware(epicMiddleWare, logger));
window.store = store;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// Init stuff
setTimeout(_ => {
  store.dispatch(actions.fetchFileText());
}, 1);


setTimeout(_ => {
  store.dispatch(actions.fetchFileText('examples/ex3.ts'));
}, 2);
setTimeout(_ => {
  store.dispatch(actions.fetchFileText('examples/ex1.ts'));
}, 3);
setTimeout(_ => {
  store.dispatch(actions.fetchFileText('examples/ex2.ts'));
}, 4);
setTimeout(_ => {
  store.dispatch(actions.fetchFileText('examples/ex4.ts'));
}, 5);



/**DATA FOR DEFAULT NODES */
let exampleNodes = [{index: 0, x: 400, y:50, width: 50, height: 50},
{index: 1, x: 300, y:40, width: 40, height: 40},
{index: 2, x: 200, y:20, width: 40, height: 40}];

exampleNodes.forEach(node => store.dispatch(actions.addNode(node)))

setTimeout(() => {
  store.dispatch(actions.addEdge({source: {index: 2, x: 200, y:20, width: 40, height: 40},
target: {index: 0, x: 400, y:50, width: 50, height: 50}}))
}, 3000);






