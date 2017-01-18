import * as actions from './actions';

import {combineReducers} from 'redux';
import Immutable from "immutable";


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


/**
 * Reducer for keeping track of the file list.
 */
const openFileListRecord = Immutable.Record({ fileName: "default", openInEditor: true });
const openFileListReducer = (openFileList = Immutable.List([]), action) => {
    switch(action.type){
        case actions.ADD_OPEN_FILE_NAME:
            if (!(action.fileName || typeof action.fileName === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            return openFileList.push(new openFileListRecord({fileName: action.fileName, openInEditor: true}));

        case actions.REMOVE_OPEN_FILE_NAME:
            if (!(action.fileName || typeof action.fileName === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            return openFileList.filter(v => v.fileName !== action.fileName);
        default:
            return openFileList;
    }
}

/**
 * Returns list of open files.
 * 
 * They have the keys: fileName and openInEditor
 */
export const getOpenFileList = state => state.openFileList;

// rootReducer is the base of the store.
export const rootReducer = combineReducers({
    currentFile: fileTextReducer,
    openFileList: openFileListReducer
});