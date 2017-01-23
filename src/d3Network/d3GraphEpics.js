import * as Rx from 'rxjs';
import { combineEpics } from 'redux-observable';

import * as actions from '../actions';
import {hashNodeToString} from './util/hashNode';

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
        .filter(action => !(NODESTORE.has(hashNodeToString(action.node))))
        .do(action => NODESTORE.set(hashNodeToString(action.node), JSON.parse(JSON.stringify(action.node))))
        .do(action => d3Graph.pushNode(NODESTORE.get(hashNodeToString(action.node))))
        .mergeMap(_ => Rx.Observable.empty());

/**
 * Both nodes need to exist otherwise the operation cancels.
 */
const addEdgeEpic = action$ =>
    action$.ofType(actions.ADD_EDGE)
        .map(({edge: {source, target}}) => ({
                source: hashNodeToString(source),
                target: hashNodeToString(target)
            }))
        .do(({source, target}) =>
                NODESTORE.has(source)
                &&  NODESTORE.has(target)
                &&  (d3Graph.pushLink({source: NODESTORE.get(source),
                     target: NODESTORE.get(target)})
                     || true)
                ||  console.error("Those nodes don't exist!!!"))
        .mergeMap(_ => Rx.Observable.empty());

/**
 * This will also remove all the edges associated with that node.
 */
const removeNodeEpic = actions$ =>
    actions$.ofType(actions.REMOVE_NODE)
        .map(({node}) => hashNodeToString(node))
        .do(node => NODESTORE.delete(node)
                    && d3Graph.removeNode(node)
                    || console.error("Error removing node")
            )
        .mergeMap(_ => Rx.Observable.empty());


const addTokenTypeEpic = actions$ =>
    actions$.ofType(actions.ADD_D3_TOKEN_TYPE)
        .throttleTime(50)
        .mergeMap(({file, line, offset}) => ajax.getJSON(`http://localhost:${PORT}/api/getTokenType?filePath=${file}&line=${line}&offset=${offset}`)
            .filter(data => {
                if (data && data.hasOwnProperty('success')){
                    return data.success
                }
                throw Error("no type information")
            })
            .map(quickTypeInfo => quickTypeInfo.body)
            .map(quickTypeInfo => ({
                ...quickTypeInfo,
                file: file
            })))
        .map(actions.addNode)
        .catch(err => {
            console.log("no type info", err);
            return Rx.Observable.empty();
        })



/**
 * TODO: make sure that this always occurs in the correct order.
 */
const addAllTokenDependenciesEpic = actions$ =>
    actions$.ofType(actions.ADD_D3_TOKEN_DEPS)
        .mergeMap(({file, line, offset}) => 
            ajax.getJSON(`http://localhost:${PORT}/api/getTokenType?filePath=${file}&line=${line}&offset=${offset}`)
                .filter(data => {
                    if (data && data.hasOwnProperty('success')){
                        return data.success
                    }
                    return false;
                })
            .map(quickTypeInfo => quickTypeInfo.body)
            .map(typeBody => ({
                ...typeBody,
                file: file
        })))
        .flatMap(v => 
            ajax.getJSON(`http://localhost:${PORT}/api/getTokenDependencies?filePath=${v.file}&line=${v.start.line}&offset=${v.start.offset}`)
                .map(listOfDeps => listOfDeps.map(deps => ({
                                        source: v,
                                        target: deps})))
        ).flatMap(v => v)
        .flatMap(v => Rx.Observable.from([actions.addNode(v.target), actions.addEdge(v)]))
        .do(v => console.log('Piped: ', v));
                                                            

export const rootD3Epics = combineEpics(
    addNodeEpic,
    addEdgeEpic,
    removeNodeEpic,
    addTokenTypeEpic,
    addAllTokenDependenciesEpic
)