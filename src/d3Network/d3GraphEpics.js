import * as Rx from 'rxjs';
import { combineEpics } from 'redux-observable';

import * as actions from '../actions';
import {hashNode} from './util/hashNode';

// D3
var d3Graph = require('./d3Graph');

const {ajax} = Rx.Observable;
const PORT = 8080;

/**
 * Stores the nodes in a map, allowing easy removing of nodes.
 */
const NODESTORE = new Map();



/**
 * This gives a clean interface to interact with the
 * very side effecty d3Graph module.
 * 
 * Nodes can only be added in a side effect manner. :/
 */

const addNodeEpic = action$ =>
    action$.ofType(actions.ADD_NODE)
        .do(action => NODESTORE.set(hashNode(action.node), action.node))
        .do(action => d3Graph.pushNode(NODESTORE.get(hashNode(action.node))))
        .mergeMap(_ => Rx.Observable.empty());




export const rootD3Epics = combineEpics(
    addNodeEpic
)