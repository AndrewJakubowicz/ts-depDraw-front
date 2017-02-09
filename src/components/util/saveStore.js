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

function removeCircularReferenceNode (node) {
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
            /**
             * It is not ideal to store these.
             * This is because the final nodestore will not have
             * these nodes included.
             * It is better to recreate the diagram with only
             * nodes we want.
             * This could create edge cases where the diagram
             * is slightly different.
             * Todo (HARD - not possible with prototype): solve this by
             *      making sure dependencies and dependents
             *      behave exactly the same (which they don't always)
             */
            // case actions.REMOVE_NODE:
            //     return {
            //         ...v,
            //         node: hashNodeToString(v.node)
            //     }
            default:
                console.error("An action was unhandled")
                return {
                    ...v
                }
        }
    })
}