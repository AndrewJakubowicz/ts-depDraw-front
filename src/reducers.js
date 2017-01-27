import * as actions from './actions';

import {combineReducers} from 'redux';
import Immutable from "immutable";


/**
 * Reducer for receiving file text data.
 */
const fileTextReducer = (fileText = "// Trying to load initial file", action) => {
    switch(action.type){
        case actions.UPDATE_CODEMIRROR_TEXT:
            if (!(action.text || typeof action.text === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            return action.text

        default:
            return fileText;
    }
}
/**
 * Returns currentFile object with file and text properties.
 */
export const getFileText = state => state.openFileText


/**
 * Reducer for keeping track of the file list.
 */
const openFileListRecord = Immutable.Record({ fileName: "default", openInEditor: false });
const openFileListReducer = (openFileList = Immutable.List([]), action) => {
    switch(action.type){
        case actions.ADD_OPEN_FILE_NAME:
            if (!(action.fileName || typeof action.fileName === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            // Set all fileNames to openInEditor to false.
            openFileList = openFileList.map(({fileName}) => new openFileListRecord({fileName}));
            if (openFileList.contains(new openFileListRecord({fileName: action.fileName}))){
                return openFileList.map(({fileName}) => new openFileListRecord({fileName, openInEditor: fileName === action.fileName}));
            }
            return openFileList.push(new openFileListRecord({fileName: action.fileName, openInEditor: true}));

        case actions.REMOVE_OPEN_FILE_NAME:
            if (!(action.fileName || typeof action.fileName === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            return openFileList.filter(v => v.fileName !== action.fileName);
        
        case actions.CHANGE_OPEN_FILE_TAB:
            if (!(action.fileName || typeof action.fileName === 'string')){
                new Error("fileTextReducer action.filePath missing!");
            }
            return openFileList.map(({fileName}) => new openFileListRecord({fileName, openInEditor: fileName === action.fileName}));

        case actions.CHANGE_TO_LAST_FILE_TAB:
            return openFileList.butLast().concat(openFileList.takeLast(1).map(({fileName, openInEditor}) => ({fileName, openInEditor: true})));
        
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

export const getOpenFilename = state => {
    const fileName = state.openFileList
                          .find(f => f.openInEditor);
    return fileName ? fileName["fileName"] : "";
}


/**
 * Dependency list and dependent list.
 */
const dragonFlyRecord = new Immutable.Record({deps: [], depnts: [], selectedToken: {}})
const linkedTokenReducer = (state = new dragonFlyRecord(), action) => {
    switch (action.type){
        case actions.POPULATE_DRAGONFLY_TOKEN:
            return new dragonFlyRecord({
                deps: state.deps,
                depnts: state.depnts,
                selectedToken: action.selectedToken
            });
        default:
            return state;
    }
}

export const getDependenciesFromState = state => state.linkedTokens.deps;
export const getDependentsFromState = state => state.linkedTokens.depnts;
export const getFocussedTokenFromState = state => {
    console.log("FOCUSSED GETTING", state.linkedTokens.selectedToken)
    return state.linkedTokens.selectedToken;
}

// rootReducer is the base of the store.
export const rootReducer = combineReducers({
    openFileText: fileTextReducer,
    openFileList: openFileListReducer,
    linkedTokens: linkedTokenReducer 
});