
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
export const ADD_D3_ALL_TOKEN_DEP_EDGES = "ADD_D3_ALL_TOKEN_DEP_EDGES";
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
 * Tries to add all the dependency edges.
 * If an edge doesn't exist it will fail.
 */
export const addD3AllTokenDepEdges = (file, line, offset) => ({
    type: ADD_D3_ALL_TOKEN_DEP_EDGES,
    file,
    line,
    offset
});

/**
 * Actions for mutating the d3 graph
 */
export const ADD_HISTORY = "ADD_HISTORY";
export const ADD_NODE = "ADD_NODE";
export const ADD_EDGE = "ADD_EDGE";
export const REMOVE_NODE = "REMOVE_NODE";
export const ADD_NODE_HISTORY = "dragonfly/ADD_NODE_HISTORY";
export const CLEAR_TAIL_HISTORY = "dragonfly/CLEAR_TAIL_HISTORY";
export const ADD_D3_MUTATION_HISTORY = "dragonfly/ADD_D3_MUTATION_HISTORY";
export const APPLY_D3_MUTATION_HISTORY = "dragonfly/APPLY_D3_MUTATION_HISTORY";
export const CLEAR_D3_UNPLAYED_HISTORY = "dragonfly/CLEAR_D3_UNPLAYED_HISTORY";

/**
 * These actions are stored into a history to be replayed if needed.
 */
export const addActionHistory = actionPayload => ({
    type: ADD_HISTORY,
    actionPayload
});

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

/**
 * This adds any given action to a history.
 */
export const addD3MutationHistory = actionPayload => ({
    type: ADD_D3_MUTATION_HISTORY,
    actionPayload
});

export const applyD3MutationHistory= _ => ({
    type: APPLY_D3_MUTATION_HISTORY
});

export const clearTailHistory = _ => ({
    type: CLEAR_TAIL_HISTORY
});

export const clearD3UnplayedHistory = _ => ({
    type: CLEAR_D3_UNPLAYED_HISTORY
});

/**
 * Appends centre token to the tail or head.
 * isDependency relates to the token clicked.
 * If the next token clicked is a dependency of the
 * centre token then isDependency should be true.
 * This helps keep the dragonfly tail.
 */
export const addNodeHistory = (isDependency, node) => ({
    type: ADD_NODE_HISTORY,
    isDependency,
     node
});

/**
 * DRAGONFLY
 */

export const OPEN_DRAGONFLY = "OPEN_DRAGONFLY";
export const CLOSE_DRAGONFLY = "CLOSE_DRAGONFLY";

export const POPULATE_DRAGONFLY_DEPS = "POPULATE_DRAGONFLY_DEPS";
export const POPULATE_DRAGONFLY_DEPNTS = "POPULATE_DRAGONFLY_DEPNTS";
export const POPULATE_DRAGONFLY_TOKEN = "POPULATE_DRAGONFLY_TOKEN";

export const FETCH_DEPS = "FETCH_DEPS";
export const FETCH_DEPNTS = "FETCH_DEPNTS";
export const FETCH_SELECTED = "FETCH_SELECTED";
export const FETCH_SELECTED_TOKEN = "dragonfly/FETCH_SELECTED_TOKEN";
export const FETCH_DEPNTS_TOKEN = "dragonfly/FETCH_DEPNTS_TOKEN";

export const UPDATE_LEFT_FILTER = "UPDATE_LEFT_FILTER";
export const UPDATE_RIGHT_FILTER = "UPDATE_RIGHT_FILTER";
export const EMPTY_FILTERS = "EMPTY_FILTERS";

export const ADD_DRAGONFLY_TAIL = "ADD_DRAGONFLY_TAIL";


export const openDragonfly = () => ({
    type: OPEN_DRAGONFLY
});

export const closeDragonfly = () => ({
    type: CLOSE_DRAGONFLY
});

export const fetchSelected = (file, line, offset) => ({
    type: FETCH_SELECTED,
    file,
    line,
    offset
});
export const fetchSelectedToken = token => ({
    type: FETCH_SELECTED_TOKEN,
    token
});

export const fetchDeps = (file, line, offset) => ({
    type: FETCH_DEPS,
    file,
    line,
    offset
});

/**
 * Fetch dependents by posting the json token.
 */
export const fetchDepntsTOKEN = token => ({
    type: FETCH_DEPNTS_TOKEN,
    token
});

export const fetchDepnts = (file, line, offset) => ({
    type: FETCH_DEPNTS,
    file,
    line,
    offset
});

export const populateDragonflyDeps = listOfDeps => ({
    type: POPULATE_DRAGONFLY_DEPS,
    listOfDeps
});

export const populateDragonflyDepnts = listOfDepnts => ({
    type: POPULATE_DRAGONFLY_DEPNTS,
    listOfDepnts
});

export const populateDragonflySelectedToken = selectedToken => ({
    type: POPULATE_DRAGONFLY_TOKEN,
    selectedToken
});

export const updateLeftFilter = text => ({
    type: UPDATE_LEFT_FILTER,
    text
});

export const updateRightFilter = text => ({
    type: UPDATE_RIGHT_FILTER,
    text
});

export const resetFilter = _ => ({
    type: EMPTY_FILTERS
});