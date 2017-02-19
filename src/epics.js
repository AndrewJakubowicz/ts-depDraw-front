import * as Rx from 'rxjs';
import { combineEpics } from 'redux-observable';

import * as actions from './actions';

import {rootD3Epics} from './d3Network/d3GraphEpics';
import {getTokenTypeURL, postTokenTypeURL, getTokenDependencies, getTokenDependents, getFileText, postTokenDependentsURL, postLoggingInformationURL} from './d3Network/util/requests';
import {loggingEnabled, getAllHistory, getGUID} from './reducers';

const {ajax} = Rx.Observable;

const initProgramEpic = action$ =>
    action$.ofType(actions.INIT_PROGRAM)
        .mergeMap(action => {
            console.log("Retrying connection to server....")
            return ajax.getJSON(getFileText())
                .catch(err => {
                    console.log('Failed to connect. Make sure server is running!');
                })
                .retryWhen(err => err.delayWhen(_ => Rx.Observable.timer(1500)))
                .mergeMap(jsonObj =>
                    Rx.Observable.from([actions.updateCodeMirrorText(jsonObj.text),
                                        actions.addOpenFileName(jsonObj.file)]))
            })



export const getFileTextEpic = (action$) =>
    action$.ofType(actions.FETCH_FILE_TEXT)
        .mergeMap(action => 
            (action.file
            ? ajax.getJSON(getFileText(action.file))
            : ajax.getJSON(getFileText()))
                .mergeMap(jsonObj =>
                    Rx.Observable.from([actions.updateCodeMirrorText(jsonObj.text),
                                        actions.addOpenFileName(jsonObj.file)])))
        .takeUntil(action$.ofType(actions.CANCEL_FETCH_FILE_TEXT))
        .catch(err => {
            console.error(`Error in getFileTextEpic:`, err);
            return Rx.Observable.empty();
        });

// For getting text for files that are already open.
export const getOpenFileText = (action$) =>
    action$.ofType(actions.GET_TEXT_FOR_OPEN_FILE)
        .throttleTime(200)
        .mergeMap(action => 
            ajax.getJSON(getFileText(action.fileName))
                .mergeMap(jsonObj => Rx.Observable.from([actions.updateCodeMirrorText(jsonObj.text),
                                                        actions.changeOpenFileTab(jsonObj.file)])))
        .catch(err => {
            console.error(`Error in getOpenFileText:`, err);
            return Rx.Observable.empty();
        });

/** Dragonfly Epics */

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
            .map(quickTypeInfo => {
                if (quickTypeInfo.body){
                    return quickTypeInfo.body
                }
                if (quickTypeInfo.hasOwnProperty('success')) {
                    delete quickTypeInfo.success;
                }
                return quickTypeInfo
            })
            .map(typeBody => {
                if (!typeBody.hasOwnProperty('file')){
                    return {
                        ...typeBody,
                        file: file
                    }
                }
                return typeBody;
        })
        .catch(err => {
            console.error(`Error in chainGetRootTokenType:`, err);
            return Rx.Observable.empty();
        });

const openDragonflyEpic = actions$ =>
    actions$.ofType(actions.OPEN_DRAGONFLY)
        .do(_ => {
            const dragonfly = document.getElementById("dragonFly");
            dragonfly.style.display = "flex";
        })
        .map(actions.resetFilter)
        .catch(err => {
            console.error(`Error in openDragonflyEpic:`, err);
            return Rx.Observable.empty();
        });
        

const closeDragonflyEpic = actions$ =>
    actions$.ofType(actions.CLOSE_DRAGONFLY)
        .do(_ => {
            const dragonfly = document.getElementById("dragonFly");
            dragonfly.style.display = "none";
        })
        .mergeMap(_ => Rx.Observable.empty())
        .catch(err => {
            console.error(`Error in closeDragonflyEpic:`, err);
            return Rx.Observable.empty();
        });

const populateDragonflySelectedEpic = actions$ =>
    actions$.ofType(actions.FETCH_SELECTED)
        .mergeMap(chainGetRootTokenType)
        .mergeMap(token => {
                const op = [actions.openDragonfly(), actions.populateDragonflySelectedToken(token), actions.fetchDeps(token.file, token.start.line, token.start.offset), actions.fetchDepnts(token.file, token.start.line, token.start.offset)];
            return Rx.Observable.from(op);
            })
        .catch(err => {
            console.error(`Error in populateDragonflySelectedEpic:`, err);
            return Rx.Observable.empty();
        });

const populateDragonflySelectedTokenEpic = actions$ =>
    actions$.ofType(actions.FETCH_SELECTED_TOKEN)
        .mergeMap(({token}) => ajax.post(postTokenTypeURL(), token, {"Content-Type": "application/json"}))
        .mergeMap(respJson => {
                const token = respJson.response;
                console.log('thetoken:', token)
                const op = [actions.openDragonfly(),
                    actions.populateDragonflySelectedToken(token),
                    actions.fetchDeps(token.file, token.start.line, token.start.offset),
                    actions.fetchDepntsTOKEN(token)
                    ];
            return Rx.Observable.from(op);
            })
        .catch(err => {
            console.error(`Error in populateDragonflySelectedEpic:`, err);
            return Rx.Observable.empty();
        });
              

const populateDragonflyDepEpic = actions$ =>
 actions$.ofType(actions.FETCH_DEPS)
    .mergeMap(({file, line, offset}) =>
        ajax.getJSON(getTokenDependencies(file, line, offset)))
    .map(actions.populateDragonflyDeps)
    .catch(err => {
        console.error(`Error in populateDragonflyDepEpic:`, err);
        return Rx.Observable.empty();
    });

const populateDragonflyDepntsEpic = actions$ =>
 actions$.ofType(actions.FETCH_DEPNTS)
    .mergeMap(({file, line, offset}) =>
        ajax.getJSON(getTokenDependents(file,line,offset)))
    .map(actions.populateDragonflyDepnts)
    .catch(err => {
        console.error(`Error in populateDragonflyDepntsEpic:`, err);
        return Rx.Observable.empty();
    });

const populateDragonflyDepntsTokenEpic = actions$ =>
 actions$.ofType(actions.FETCH_DEPNTS_TOKEN)
    .mergeMap(({token}) =>
        ajax.post(postTokenDependentsURL(), token, {"Content-Type": "application/json"}))
    .map(respObj => {
        return actions.populateDragonflyDepnts(respObj.response);
    })
    .catch(err => {
        console.error(`Error in populateDragonflyDepntsEpic:`, err);
        return Rx.Observable.empty();
    });

const loggingEpic = (actions$, store) =>
    actions$.ofType(actions.SEND_LOG)
        .filter(_ => loggingEnabled(store.getState()))
        .mergeMap(_ => {
            const history = getAllHistory(store.getState());
            const userGUID = getGUID(store.getState());
            store.dispatch(actions.clearAllHistory());
            return ajax.post(postLoggingInformationURL(userGUID), history, {"Content-Type": "application/json"})
        })
        .catch(err => {
            console.error(`Error in loggingEpic:`, err);
            return Rx.Observable.empty();
        });


const dragonFlyEpics = combineEpics(
    openDragonflyEpic,
    closeDragonflyEpic,
    populateDragonflySelectedEpic,
    populateDragonflyDepEpic,
    populateDragonflyDepntsEpic,
    populateDragonflySelectedTokenEpic,
    populateDragonflyDepntsTokenEpic
)

export const rootEpic = combineEpics(
    initProgramEpic,
    getFileTextEpic,
    getOpenFileText,
    rootD3Epics,
    loggingEpic,
    dragonFlyEpics
)