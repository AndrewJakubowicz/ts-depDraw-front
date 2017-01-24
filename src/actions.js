
export const INIT_PROGRAM = "INIT_PROGRAM";


/**
 * GET FILE DATA
 * 
 * Used for opening new files.
 * 
 * Do not use if file is already open.
 */
export const FETCH_FILE_TEXT = "FETCH_FILE_TEXT";
export const CANCEL_FETCH_FILE_TEXT = "CANCEL_FETCH_FILE_TEXT"

export const fetchFileText = filePath => ({
    type: FETCH_FILE_TEXT,
    file: filePath
});


/**
 * FILE OPEN LIST OPERATIONS
 * 
 */

export const ADD_OPEN_FILE_NAME = "ADD_OPEN_FILE_NAME";
export const REMOVE_OPEN_FILE_NAME = "REMOVE_OPEN_FILE_NAME";
export const CHANGE_OPEN_FILE_TAB = "CHANGE_OPEN_FILE_TAB";
export const GET_TEXT_FOR_OPEN_FILE = "GET_TEXT_FOR_OPEN_FILE";
export const CHANGE_TO_LAST_FILE_TAB = "CHANGE_TO_LAST_FILE_TAB";

export const addOpenFileName = fileName => ({
    type: ADD_OPEN_FILE_NAME,
    fileName
});

export const removeOpenFileName = fileName => ({
    type: REMOVE_OPEN_FILE_NAME,
    fileName
});

export const changeOpenFileTab = fileName => ({
    type: CHANGE_OPEN_FILE_TAB,
    fileName
});

export const getTextForOpenFile = fileName => ({
    type: GET_TEXT_FOR_OPEN_FILE,
    fileName
});

export const changeToLastFileTab = () => ({
    type: CHANGE_TO_LAST_FILE_TAB
});


/**
 * CODEMIRROR ACTIONS
 */

export const UPDATE_CODEMIRROR_TEXT = "UPDATE_CODEMIRROR_TEXT";
export const FOCUS_TOKEN_CLICKED = "FOCUS_TOKEN_CLICKED";

/** SIDE EFFECT ACTIONS */
export const SELECT_TOKEN = "SELECT_TOKEN";
export const ADD_D3_TOKEN_TYPE = "ADD_D3_TOKEN_TYPE";
export const ADD_D3_TOKEN_DEPS = "ADD_D3_TOKEN_DEPS";
export const ADD_D3_TOKEN_DEPNDTS = "ADD_D3_TOKEN_DEPNDTS";
export const HIGHLIGHT_CODEMIRROR_REGION = "HIGHLIGHT_CODEMIRROR_REGION";


export const updateCodeMirrorText = text => ({
    type: UPDATE_CODEMIRROR_TEXT,
    text
});

/**
 * opens new files and highlights token.
 */
export const focusTokenClicked = (file, openFile, codeMirrorInstance, anchor, head) =>
    ({
        type: FOCUS_TOKEN_CLICKED,
        file,
        openFile,
        codeMirrorInstance,
        anchor,
        head
    });

export const highlightCodeMirrorRegion = (codeMirrorInstance, anchor, head) => ({
    type: HIGHLIGHT_CODEMIRROR_REGION,
    codeMirrorInstance,
    anchor,
    head
});

export const selectToken = (file, line, offset) => ({
    type: SELECT_TOKEN,
    file,
    line,
    offset
});

export const addD3TokenType = (file, line, offset) => ({
    type: ADD_D3_TOKEN_TYPE,
    file,
    line,
    offset
});

export const addD3TokenDeps = (file, line, offset) => ({
    type: ADD_D3_TOKEN_DEPS,
    file,
    line,
    offset
});

export const addD3TokenDependents = (file, line, offset) => ({
    type: ADD_D3_TOKEN_DEPNDTS,
    file,
    line,
    offset
});


/**
 * Actions for mutating the d3 graph
 */

export const ADD_NODE = "ADD_NODE";
export const ADD_EDGE = "ADD_EDGE";
export const REMOVE_NODE = "REMOVE_NODE";

export const addNode = node => ({
    type: ADD_NODE,
    node
});

/**
 * Edge in the form of {source: obj, target: obj}
 */
export const addEdge = edge => ({
    type: ADD_EDGE,
    edge
});

export const removeNode = node => ({
    type: REMOVE_NODE,
    node
});