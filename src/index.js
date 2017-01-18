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