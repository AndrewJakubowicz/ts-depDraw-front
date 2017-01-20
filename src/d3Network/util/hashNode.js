
/**
 * Use to get a unique string for each node.
 */
export const hashNodeToString = node =>
    Object.keys(node).map(key => {
        switch(key){
            case "start":
            case "end":
                return hashNodeToString(node[key])
            case "file":
            case "line":
            case "offset":
                return String(node[key])
            default:
                return "";
        }
    }).filter(v => v.length !== 0).join("|");