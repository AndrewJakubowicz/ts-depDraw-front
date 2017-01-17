
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
