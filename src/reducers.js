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
const linkedTokenReducer = (state = {deps: [], depnts: [], selectedToken: {}}, action) => {
    switch (action.type){
        case actions.POPULATE_DRAGONFLY_TOKEN:
            return {
                ...state,
                selectedToken: action.selectedToken
            };
        case actions.POPULATE_DRAGONFLY_DEPS:
            return {
                ...state,
                deps: action.listOfDeps
            };
        case actions.POPULATE_DRAGONFLY_DEPNTS:
            return {
                ...state,
                depnts: action.listOfDepnts
            };
        default:
            return state;
    }
}

export const getDependenciesFromState = state => state.linkedTokens.deps;
export const getDependentsFromState = state => state.linkedTokens.depnts;
export const getFocussedTokenFromState = state => state.linkedTokens.selectedToken;

const filterStringsReducer = (state = {leftFilter: "", rightFilter: ""}, action) => {
    switch (action.type){
        case actions.UPDATE_LEFT_FILTER:
            return {
                ...state,
                leftFilter: action.text
            }
        case actions.UPDATE_RIGHT_FILTER:
            return {
                ...state,
                rightFilter: action.text
            }
        case actions.EMPTY_FILTERS:
            return {
                leftFilter: "",
                rightFilter: ""
            }
        default:
            return state;
    }
}

/**
 * assuming dependencies are the right filter.
 */
export const getFilteredDependencies = ({filters: {rightFilter}, linkedTokens: {deps}}) => {
    if (!(rightFilter && rightFilter.length !== 0)) {
        return deps
    }
    if (!(deps && deps.length !== 0)) {
        return deps
    }
    /**
     * This filter deliminates on whitespace and filters accordingly.
     */
    return rightFilter.split(" ").reduce((prevDeps, currentVal) => {
        return prevDeps.filter(v => JSON.stringify(v).toUpperCase().indexOf(currentVal.toUpperCase()) > -1
        )
    }
    , deps)
}

export const getFilteredDependents = ({filters: {leftFilter}, linkedTokens: {depnts}}) => {
    if (!(leftFilter && leftFilter.length !== 0)) {
        return depnts
    }
    if (!(depnts && depnts.length !== 0)) {
        return depnts
    }
    /**
     * This filter deliminates on whitespace and filters accordingly.
     */
    return leftFilter.split(" ").reduce((prevDepnts, currentVal) => {
        return prevDepnts.filter(v => JSON.stringify(v).toUpperCase().indexOf(currentVal.toUpperCase()) > -1
        )
    }
    , depnts)
}

// rootReducer is the base of the store.
export const rootReducer = combineReducers({
    openFileText: fileTextReducer,
    openFileList: openFileListReducer,
    linkedTokens: linkedTokenReducer,
    filters: filterStringsReducer
});