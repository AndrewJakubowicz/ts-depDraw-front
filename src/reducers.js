import * as actions from './actions';

import {combineReducers} from 'redux';
import Immutable from "immutable";


/**
 * Reducer for receiving file text data.
 */
const fileTextReducer = (fileText = "//", action) => {
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


/**
 * D3 node data reducer
 */
const graphDataReducer = (graphData = {nodes: [{index: 0, x: 400, y:50, width: 50, height: 50},
                                               {index: 1, x: 300, y:40, width: 40, height: 40}],
                                       links: []},
                          action) => {
    switch(action.type){
        default:
            return graphData
    }
}

export const getGraphData = state => state.graphData;

// rootReducer is the base of the store.
export const rootReducer = combineReducers({
    openFileText: fileTextReducer,
    openFileList: openFileListReducer,
    graphData: graphDataReducer
});