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


/**
 * PROOF OF CONCEPT DATA.
 */


let exampleNodePressed = { kind: 'function',
                    kindModifiers: '',
                    start: { line: 7, offset: 9 },
                    end: { line: 7, offset: 10 },
                    displayString: 'function D(): void',
                    "file": "examples/ex7_deepNesting.ts",
                    documentation: '' };

let exampleDependents = [
    { kind: 'module',
        kindModifiers: '',
        start: { line: 1, offset: 13 },
        end: { line: 1, offset: 20 },
        displayString: '"ex4"',
        documentation: '',
        file: 'examples/ex4.ts' },
    { kind: 'function',
        kindModifiers: 'export',
        start: { line: 4, offset: 17 },
        end: { line: 4, offset: 28 },
        displayString: 'function betterAdder(c: any, d: any): any',
        documentation: '',
        file: 'examples/ex4.ts' },
    { kind: 'module',
        kindModifiers: '',
        start: { line: 1, offset: 13 },
        end: { line: 1, offset: 16 },
        displayString: '"ex3"',
        documentation: '',
        file: 'examples/ex3.ts' } ]

let exampleDependencies = [
    { kind: 'local function',
        kindModifiers: '',
        start: { line: 5, offset: 14 },
        end: { line: 5, offset: 15 },
        displayString: '(local function) B(): void',
        "file": "examples/ex7_deepNesting.ts",
        documentation: '' },
    { kind: 'local function',
        kindModifiers: '',
        start: { line: 10, offset: 18 },
        end: { line: 10, offset: 19 },
        displayString: '(local function) C(): void',
        "file": "examples/ex7_deepNesting.ts",
        documentation: '' } ]


store.dispatch(actions.addNode(exampleNodePressed));

exampleDependents.forEach(currentNode => {
  store.dispatch(actions.addNode(currentNode));
  store.dispatch(actions.addEdge({source: exampleNodePressed,
                  target: currentNode}))
});

exampleDependencies.forEach(currentNode => {
  store.dispatch(actions.addNode(currentNode));
  store.dispatch(actions.addEdge({source: exampleNodePressed,
                                 target: currentNode}))
});

setTimeout(() => {
  store.dispatch(actions.removeNode(exampleNodePressed))
}, 3000)

setTimeout(() => {
  console.log(exampleDependencies)
  store.dispatch(actions.removeNode(exampleDependencies[1]))
}, 3400)

setTimeout(() => {
  store.dispatch(actions.removeNode(exampleDependencies[0]))
}, 4000)

exampleDependencies.forEach(currentNode => {
  store.dispatch(actions.addNode(currentNode));
  store.dispatch(actions.addEdge({source: exampleNodePressed,
                                 target: currentNode}))
});
exampleDependencies.forEach(currentNode => {
  store.dispatch(actions.addNode(currentNode));
  store.dispatch(actions.addEdge({source: exampleNodePressed,
                                 target: currentNode}))
});
exampleDependencies.forEach(currentNode => {
  store.dispatch(actions.addNode(currentNode));
  store.dispatch(actions.addEdge({source: exampleNodePressed,
                                 target: currentNode}))
});
