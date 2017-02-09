/**
 * This handles the save logic.
 */

/**
 * Takes a filename and data as a string.
 */
function saveStore (filename, data) {
    var blob = new Blob([data], {type: 'text/json'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
        // Remove the url after 15 seconds.
        setTimeout(() => {window.URL.revokeObjectURL(elem.href)}, 15000);
    }
}

export default saveStore;