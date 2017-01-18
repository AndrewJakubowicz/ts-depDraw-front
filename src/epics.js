import * as Rx from 'rxjs';
import { combineEpics } from 'redux-observable';

import * as actions from './actions';

const {ajax} = Rx.Observable;
const PORT = 8080;

export const getFileTextEpic = action$ =>
    action$.ofType(actions.FETCH_FILE_TEXT)
        .mergeMap(action => 
            (action.file
            ? ajax.getJSON(`http://localhost:${PORT}/api/getFileText?filePath=${action.file}`)
            : ajax.getJSON(`http://localhost:${PORT}/api/getFileText`))
                .mergeMap(jsonObj =>
                    Rx.Observable.from([actions.updateCodeMirrorText(jsonObj.text),
                                        actions.addOpenFileName(jsonObj.file)])))
        .takeUntil(action$.ofType(actions.CANCEL_FETCH_FILE_TEXT))
        .catch(err => {
            console.error(`Error in getFileTextEpic:`, err);
            return Rx.Observable.empty();
        });

export const getOpenFileText = action$ =>
    action$.ofType(actions.GET_TEXT_FOR_OPEN_FILE)
        .mergeMap(action => 
            ajax.getJSON(`http://localhost:${PORT}/api/getFileText?filePath=${action.fileName}`)
                .map(jsonObj => actions.updateCodeMirrorText(jsonObj.text)))


export const rootEpic = combineEpics(
    getFileTextEpic,
    getOpenFileText
)