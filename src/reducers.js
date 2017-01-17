import * as actions from './actions';

import {combineReducers} from 'redux';


/**
 * Reducer for receiving file text data.
 */
const fileTextReducer = (fileData = {file: "DEFAULT", text: "//DEFAULT"}, action) => {
    switch(action.type){
        case actions.RECEIVE_FILE_TEXT:
            if (!(action.filePath || typeof action.filePath === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            if (!(action.text || typeof action.text === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            console.log("received payload", action)
            return {
                file: action.filePath,
                text: action.text
            }
        default:
            return fileData;
    }
}
/**
 * Returns currentFile object with file and text properties.
 */
export const getFileText = state => state.currentFile

// rootReducer is the base of the store.
export const rootReducer = combineReducers({
    currentFile: fileTextReducer
});