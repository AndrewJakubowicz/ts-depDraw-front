
/**
 * Use to get a unique string for each node.
 */
export const hashNode = node =>
        Object.keys(node).map(key =>
                typeof node[key] === "object"
                ? hashNode(node[key])
                : String(key) +'-'+ String(node[key]))
            .join("|");