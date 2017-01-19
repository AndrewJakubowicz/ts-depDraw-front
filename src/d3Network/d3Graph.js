let d3 = require('d3');

module.exports = (()=> {
    const width = 1000,
          height = 400,
          color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#graph").append("svg")
            .attr("width", width)
            .attr("height",height);


var nodes = [],
    links = [];

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links).distance(200))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(1)
    .on("tick", ticked);

var g = svg.append("g").attr("transform", `translate(${width / 2},${height/2})`),
    link = g.append("g").attr("stroke", "#bbb").attr("stroke-width", 1.5).selectAll(".link"),
    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

function ticked() {
        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
}

return {
    restart: function() {
        node = node.data(nodes, d => d.id);
        node.exit().remove();
        link = link.data(links, d => d.source.id + '-' + d.target.id);
        link.exit().remove();
        node = node.enter().append("circle").attr("fill", d => color(d.id)).attr("r", 8).merge(node);
        link = link.enter().append("line").merge(link);

        simulation.nodes(nodes);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
    },
    ticked: ticked,
    /**
     * Use an external hash map. Push the node object in here, but you'll
     * need a hash to remove the node.
     */
    pushNode: function(node) {
        // TODO: remove this safety
        if (node.length > 2){
            return
        }
        nodes.push(node);
        this.restart();
    },
    /**
     * It is recommended to use an external hash map to keep track of the objects.
     * Pass them in here, and use the hash to remove them.
     */
    pushLink: function(link){
        links.push(link);
        this.restart();
    },
    /**
     * links are traversed and all links with the given node hash are destroyed.
     * Try to only use removeNode.
     */
    removeLink: function(nodeHash){
        links.pop();
        this.restart();
    },
    /**
     * Pass in the hash code of the node, and it'll splice the correct one based on
     * the hashing function.
     */
    removeNode: function(nodeHash){
        nodes.pop();
        this.restart();
    },


}
})()