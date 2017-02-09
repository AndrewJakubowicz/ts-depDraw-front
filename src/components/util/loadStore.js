import {hashNodeToString} from '../../d3Network/util/hashNode';
import * as actions from '../../actions';

// nodeStore: strMapToObj(NODESTORE_REF),
//             actionHistory: flattenActionHistory(this.props.actionHistory),
//             openFileText: this.props.openFileText,
//             openFileList: this.props.openFileList,
//             linkedTokens: this.props.linkedTokens,
//             unplayedHistory: this.props.unplayedHistory,
//             filters: this.props.filters

/**
 * Returns a stream of actions to dispatch,
 * initialising the store.
 */
const loadStore = (saveData) => {
    const tempNodeStore = objToStrMap(saveData.nodeStore);
    console.log(tempNodeStore);
    const newActionHistory = expandActionHistory(saveData.actionHistory, tempNodeStore);
    return newActionHistory
}

export default loadStore;



/**
 * Converts the past object back into a Map.
 * 
 * Coutesy of: http://www.2ality.com/2015/08/es6-map-json.html
 */
export function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

/**
 * Returns action history with nodes filled in.
 */
function expandActionHistory(flatHistory, nodeMap){
    return flatHistory.map(v => {
        switch(v.type){
            case actions.ADD_EDGE:
                return {
                    ...v,
                    edge: {
                        source: nodeMap.get(v.edge.source),
                        target: nodeMap.get(v.edge.target)
                    }
                }
            case actions.ADD_NODE:
                return {
                    ...v,
                    node: nodeMap.get(v.node)
                }
            default:
                console.error("An action was unhandled")
                return {
                    ...v
                }
        }
    })
}