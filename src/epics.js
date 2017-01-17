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
                .map(actions.receiveFileText)
        )
        .takeUntil(action$.ofType(actions.CANCEL_FETCH_FILE_TEXT))
        .catch(err => {
            console.error(`Error in getFileTextEpic:`, err);
            return Rx.Observable.empty();
        });

// stub
export const rootEpic = combineEpics(
    getFileTextEpic
)