const PORT = 8080;
const rootLocation = `http://localhost:${PORT}`;
const loggingServer = `http://localhost:8081`;

export function getTokenTypeURL(file, line, offset) {
    return rootLocation + `/api/getTokenType?filePath=${file}&line=${line}&offset=${offset}`;
}

export function postTokenTypeURL(){
    return rootLocation + `/api/getTokenType`;
}

export function getTokenDependencies(file, line, offset){
    return rootLocation + `/api/getTokenDependencies?filePath=${file}&line=${line}&offset=${offset}`;
}

export function getTokenDependents(file, line, offset){
    return rootLocation + `/api/getTokenDependents?filePath=${file}&line=${line}&offset=${offset}`;
}

export function postTokenDependentsURL(){
    return rootLocation + `/api/getTokenDependents`;
}

export function postLoggingInformationURL(GUID){
    return loggingServer + `/?ID=${GUID}`
}
/**
 * Gets file text.
 * If filepath isn't given, the default filepath is used.
 * Default filepath is the path that the server is started on.
 * @param {string} [file] - optional filepath parameter.
 */
export function getFileText(file){
    return file
        ? rootLocation + `/api/getFileText?filePath=${file}`
        : rootLocation + `/api/getFileText`;
}


