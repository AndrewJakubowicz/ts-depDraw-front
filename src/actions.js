
export const INIT_PROGRAM = "INIT_PROGRAM";


/**
 * GET FILE DATA
 */
export const FETCH_FILE_TEXT = "FETCH_FILE_TEXT";
export const RECEIVE_FILE_TEXT = "RECEIVE_FILE_TEXT";
export const CANCEL_FETCH_FILE_TEXT = "CANCEL_FETCH_FILE_TEXT"

export const fetchFileText = filePath => ({
    type: FETCH_FILE_TEXT,
    file: filePath
});


export const receiveFileText = filePathAndText => ({
    type: RECEIVE_FILE_TEXT,
    file: filePathAndText.file,
    text: filePathAndText.text
})

/**
 * FILE OPEN LIST OPERATIONS
 */

export const ADD_OPEN_FILE_NAME = "ADD_OPEN_FILE_NAME";
export const REMOVE_OPEN_FILE_NAME = "REMOVE_OPEN_FILE_NAME";
export const CHANGE_OPEN_FILE_TAB = "CHANGE_OPEN_FILE_TAB";

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
})

