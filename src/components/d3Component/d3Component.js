/**
 * Many thanks to this post for helping get this off the ground:
 * http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
 * 
 */
var d3 = require('d3');
// Hack to get to cola from global window.
var webcola = window.cola;
var cola = webcola.d3adaptor(d3);
var D3Chart = {};


/**
 * Requires props.width, props.height, state.data
 */

D3Chart.create = function(el, props, state) {
    cola.linkDistance(100)
        .avoidOverlaps(true)
        .handleDisconnected(false)
        .size([props.width, props.height]);

    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height);
    
    svg.append('g')
        .attr('class', 'd3-nodes');

    this.update(el, state);
};

// This is where data updates go!
D3Chart.update = function(el, state) {
    this._drawGraph(el, state.data);
};

D3Chart.destroy = function(el, state) {

};

D3Chart._drawGraph = function(el, graph){
    console.log(graph);
    var g = d3.select(el).selectAll('.d3-nodes');

    var node = g.selectAll('.data-node')
        .data(graph.nodes, d => d.index);

    node.enter().append('circle')
        .attr('class', 'data-node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', '20');

    node.exit().remove();
};

export const d3Chart = D3Chart;