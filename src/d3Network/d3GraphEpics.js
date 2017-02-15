import * as Rx from 'rxjs';
import { combineEpics } from 'redux-observable';

import * as actions from '../actions';
import {hashNodeToString} from './util/hashNode';
import * as s from '../reducers';

import {getTokenTypeURL, getTokenDependencies, getTokenDependents} from './util/requests';

// D3
var d3Graph = require('./d3Graph');

const {ajax} = Rx.Observable;

/**
 * Stores the nodes in a map, allowing easy removing of nodes.
 * 
 * exported so that we can save it.
 */
const NODESTORE = new Map();

export const NODESTORE_REF = NODESTORE;



/**
 * This gives a clean interface to interact with the
 * very side effecty d3Graph module.
 * 
 * Nodes can only be added in a side effect manner. :/
 * 
 * Whenever a node is added we need to add edges with all other nodes drawn.
 */
const addNodeEpic = (action$, store) =>
    action$.ofType(actions.ADD_NODE)
        .filter(action => !(NODESTORE.has(hashNodeToString(action.node))))
        .do(action => NODESTORE.set(hashNodeToString(action.node), JSON.parse(JSON.stringify(action.node))))
        .do(action => d3Graph.pushNode(NODESTORE.get(hashNodeToString(action.node))))
        .do(action => store.dispatch(actions.addActionHistory(action)))
        // Now that we have added the node. We need to add all dependency edges
        .mergeMap(action => {
            const v = action.node;
            let defEdge = ajax.getJSON(getTokenDependencies(v.file, v.start.line, v.start.offset))
                .map(listOfDeps => listOfDeps.map(deps => ({
                                        source: action.node,
                                        target: deps}))
                                        .map(actions.addEdge));
            let depEdge = ajax.getJSON(getTokenDependents(v.file, v.start.line, v.start.offset))
                .map(listOfDepnts => listOfDepnts.map(depnts => ({
                                        target: action.node,
                                        source: depnts}))
                                        .map(actions.addEdge));
            return defEdge.merge(depEdge);
        })
        .flatMap(v => v)
        // Now add dependents
        .catch(err => {
            console.error(`Error in addNodeEpic:`, err);
            return Rx.Observable.empty();
        });

/**
 * Both nodes need to exist otherwise the operation cancels.
 */
const addEdgeEpic = (action$, store) =>
    action$.ofType(actions.ADD_EDGE)
        .map(({edge: {source, target}}) => ({
                source: hashNodeToString(source),
                target: hashNodeToString(target)
            }))
        .do(({source, target}) => {
            if (NODESTORE.has(source) &&  NODESTORE.has(target)) {
                /**
                 * Here is where we add the edge and also keep a history of the mutation.
                 */
                d3Graph.pushLink({source: NODESTORE.get(source),
                                    target: NODESTORE.get(target)})
                store.dispatch(actions.addActionHistory(actions.addEdge({source: NODESTORE.get(source),
                                                                            target: NODESTORE.get(target)})))
            } else {
                console.error("Those nodes don't exist!!!")
            }
        })
        .mergeMap(_ => Rx.Observable.empty())
        .catch(err => {
            console.error(`Error in addEdgeEpic:`, err);
            return Rx.Observable.empty();
        });

/**
 * This will also remove all the edges associated with that node.
 */
const removeNodeEpic = (actions$, store) =>
    actions$.ofType(actions.REMOVE_NODE)
        .do(action => {
            if (NODESTORE.delete(action.node)){
                d3Graph.removeNode(action.node);
            } else {
                console.error(`Error removing node: tried to remove(${action.node}) from ${NODESTORE}`, action.node, NODESTORE)
            }
        })
        .mergeMap(_ => Rx.Observable.empty())
        .catch(err => {
            console.error(`Error in removeNodeEpic:`, err);
            return Rx.Observable.empty();
        });


const addTokenTypeEpic = actions$ =>
    actions$.ofType(actions.ADD_D3_TOKEN_TYPE)
        .throttleTime(50)
        .mergeMap(({file, line, offset}) => ajax.getJSON(getTokenTypeURL(file, line, offset))
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
        });


/**
 * Gets the root token type, used as helper function.
 */
const chainGetRootTokenType = ({file, line, offset}) => 
            ajax.getJSON(getTokenTypeURL(file, line, offset))
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
        }))
        .catch(err => {
            console.error(`Error in chainGetRootTokenType:`, err);
            return Rx.Observable.empty();
        });

/**
 * Adds all the token dependency nodes and edges.
 */
const addAllTokenDependenciesEpic = actions$ =>
    actions$.ofType(actions.ADD_D3_TOKEN_DEPS)
        .mergeMap(chainGetRootTokenType)
        .flatMap(v => 
            ajax.getJSON(getTokenDependencies(v.file, v.start.line, v.start.offset))
                .map(listOfDeps => listOfDeps.map(deps => ({
                                        source: v,
                                        target: deps})))
        ).flatMap(v => v)
        .flatMap(v => Rx.Observable.from([actions.addNode(v.target), actions.addEdge(v)]))
        .catch(err => {
            console.error(`Error in addAllTokenDependenciesEpic:`, err);
            return Rx.Observable.empty();
        });

/**
 * This adds all the edges that exist.
 */
const addAllTokenDependenciesEdgesEpic = actions$ =>
    actions$.ofType(actions.ADD_D3_ALL_TOKEN_DEP_EDGES)
        .mergeMap(chainGetRootTokenType)
        .flatMap(v => 
            ajax.getJSON(getTokenDependencies(v.file, v.start.line, v.start.offset))
                .map(listOfDeps => listOfDeps.map(deps => ({
                                        source: v,
                                        target: deps})))
        ).flatMap(v => v)
        .flatMap(v => Rx.Observable.from([actions.addNode(v.target), actions.addEdge(v)]))
        .catch(err => {
            console.error(`Error in addAllTokenDependenciesEpic:`, err);
            return Rx.Observable.empty();
        });

const addAllTokenDependentsEpic = actions$ =>
    actions$.ofType(actions.ADD_D3_TOKEN_DEPNDTS)
        .mergeMap(chainGetRootTokenType)
        .flatMap(v => 
            ajax.getJSON(getTokenDependents(v.file, v.start.line, v.start.offset))
                .map(listOfDeps => listOfDeps.map(depnts => ({
                                        source: depnts,
                                        target: v})))
        )
        .flatMap(v => v)
        .flatMap(v => Rx.Observable.from([actions.addNode(v.source), actions.addEdge(v)]))
        .catch(err => {
            console.error(`Error in addAllTokenDependentsEpic:`, err);
            return Rx.Observable.empty();
        });




const focusTokenTextEpic = (actions$, store) =>
    actions$.ofType(actions.FOCUS_TOKEN_CLICKED)
        .mergeMap(({file,
            openFile,
            codeMirrorInstance,
            anchor,
            head}) => {
                let opList = [];
                if (openFile !== file){
                    opList.push(actions.addOpenFileName(file));
                    opList.push(actions.getTextForOpenFile(file))
                }
                setTimeout(() => {store.dispatch(actions.highlightCodeMirrorRegion(codeMirrorInstance, anchor, head))},
                180)
                
                return Rx.Observable.from(opList)
            })
            .catch(err => {
                console.error(`Error in focusTokenTextEpic:`, err);
                return Rx.Observable.empty();
            });
const highlightCodeMirrorRegionEpic = actions$ =>
    actions$.ofType(actions.HIGHLIGHT_CODEMIRROR_REGION)
        .do(({codeMirrorInstance, anchor, head}) => {
            codeMirrorInstance.setSelection({line: anchor.line - 1, ch: anchor.offset - 1},
                                    {line: head.line - 1, ch: head.offset - 1})
        })
        .mergeMap(() => Rx.Observable.empty())
        .catch(err => {
            console.error(`Error in highlightCodeMirrorRegionEpic:`, err);
            return Rx.Observable.empty();
        });

/** 
 * Here is were mutations are initiated.
 */
const applyD3MutationsEpic = (actions$, store) =>
    actions$.ofType(actions.APPLY_D3_MUTATION_HISTORY)
        .mergeMap(_ => {
            return Rx.Observable.from([...s.getUnplayedMutations(store.getState()), actions.clearD3UnplayedHistory()])
        });


export const rootD3Epics = combineEpics(
    addNodeEpic,
    addEdgeEpic,
    removeNodeEpic,
    addTokenTypeEpic,
    addAllTokenDependenciesEpic,
    addAllTokenDependentsEpic,
    addAllTokenDependenciesEdgesEpic,
    focusTokenTextEpic,
    highlightCodeMirrorRegionEpic,
    applyD3MutationsEpic
)