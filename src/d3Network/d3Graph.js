import {hashNodeToString} from './util/hashNode';

let d3 = require('d3');
let cola = window.cola;

module.exports = (()=> {
    /**
     * These are used to help the removal of nodes and edges.
     * They keep a modal of the state of the mutable store.
     */
    let hashNodes = [],
        hashLinks = [];
    
    const width = 1000,
          height = 400,
          color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#graph").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("pointer-events", "all");


    /**
     * Add the arrow heads for the lines.
     */
    svg.append('svg:defs').append('svg:marker')
        .attr("id", "end-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
          .append('svg:path')
            .attr("d", "M0,-5L10,0L0,5L2,0")
            .attr("stroke-width", "0px")
            .attr("fill", "#000");

    var nodes = [],
        links = [];
    
    var simulation = cola.d3adaptor(d3)
        .avoidOverlaps(true)
        .flowLayout('x', 50)
        .jaccardLinkLengths(50)
        .handleDisconnected(false)
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .on("tick", ticked);

    var g = svg.append("g"),
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

            node = node.data(nodes, d => {console.log(d); return d.index});
            node.exit().remove();

            link = link.data(links, d => d.source.index + '-' + d.target.index);
            link.exit().remove();

            node = node.enter()
                    .append("circle")
                    .attr("fill", (d, _) => color(hashNodes.indexOf(hashNodeToString(d))))
                    .attr("r", 8)
                    .call(simulation.drag)
                    .merge(node);

            link = link.enter()
                        .append("line")
                        .attr("class", "line")
                        .merge(link);
            
            // simulation.nodes(nodes);
            // simulation.links(links);
            simulation.start();
        },
        ticked: ticked,
        /**
         * Use an external hash map. Push the node object in here, but you'll
         * need a hash to remove the node.
         */
        pushNode: function(node) {
            node.width = 16;
            node.height = 16;
            nodes.push(node);
            hashNodes.push(hashNodeToString(node))
            this.restart();
        },
        /**
         * It is recommended to use an external hash map to keep track of the objects.
         * Pass them in here, and use the hash to remove them.
         */
        pushLink: function(link){
            links.push(link);
            hashLinks.push({source: hashNodeToString(link.source),
                            target: hashNodeToString(link.target)});
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
         * 
         * Returns true if everything completed successfully
         */
        removeNode: function(nodeHashToRemove){
            let i = hashNodes.indexOf(nodeHashToRemove);
            hashNodes.splice(i, 1);
            nodes.splice(i, 1);
            let _tempHashLinks = [];
            hashLinks.reduce((i, val) => {
                if (val.source === nodeHashToRemove || val.target === nodeHashToRemove){
                    // Remove this edge.
                    links.splice(i, 1);
                    return i
                }
                _tempHashLinks.push(val)
                return i + 1
            }, 0)

            hashLinks = _tempHashLinks;
            this.restart();
            return true
        },


    }
})()