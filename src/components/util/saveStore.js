import {hashNodeToString} from '../../d3Network/util/hashNode';
import * as actions from '../../actions';

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

export function removeCircularReferenceNode (node) {
    return {
        displayString: node.displayString,
        documentation: node.documentation,
        end: {line: node.end.line,
              offset: node.end.offset},
        file: node.file,
        height: node.height,
        kind: node.kind,
        kindModifiers: node.kindModifiers,
        start: {line: node.start.line,
                offset: node.start.offset},
        width: node.width,
        x: node.x,
        y: node.y
    }
}

/**
 * Can be used to convert a map with only string keys into an object to
 * be converted into JSON.
 * 
 * Coutesy of: http://www.2ality.com/2015/08/es6-map-json.html
 */
export function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = removeCircularReferenceNode(v);
    }
    return obj;
}



/**
 * Removes circular dependencies from action history.
 * 
 * We don't care about storing deleted actions, because
 * deleting nodes deletes them from the node MAP.
 * Before loaded nodes are drawn they are retrieved from the MAP.
 * If that fails they're assumed to have been deleted. 
 */
export function flattenActionHistory(actionHistory){
    return actionHistory.map(v => {
        switch(v.type){
            case actions.ADD_EDGE:
                return {
                    ...v,
                    edge: {
                        source: hashNodeToString(v.edge.source),
                        target: hashNodeToString(v.edge.target)
                    }
                }
            case actions.ADD_NODE:
                return {
                    ...v,
                    node: hashNodeToString(v.node)
                }
            default:
                console.error("An action was unhandled")
                return {
                    ...v
                }
        }
    })
}