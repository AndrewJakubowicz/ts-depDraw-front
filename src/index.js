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

// D3
var d3Graph = require('./components/d3Graph')();

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
const node1 = {index: 0, x: 400, y:50, width: 50, height: 50};
const node2 = {index: 1, x: 300, y:40, width: 40, height: 40};
const node3 = {index: 2, x: 200, y:20, width: 40, height: 40};


d3Graph.restart();

var a = {id: "a"},
    b = {id: "b"},
    c = {id: "c"},
    temp = [a,b,c];
temp.forEach(v => d3Graph.pushNode(v));
setTimeout(d3Graph.pushLink({source: a, target: c}), 200);



