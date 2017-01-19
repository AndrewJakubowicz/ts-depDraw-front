/**
 * Many thanks to this post for helping get this off the ground:
 * http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
 * 
 */
var d3 = require('d3');
// Hack to get to cola from global window.
var cola = window.cola;
var D3Chart = {};

D3Chart.create = function(el, props, state) {
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

D3Chart._drawGraph = function(el, data){
    var g = d3.select(el).selectAll('.d3-nodes');

    var point = g.selectAll('.data-node')
        .data(data, d => d.id);

    point.enter().append('circle')
        .attr('class', 'data-node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.z);

    point.exit().remove();
};

export const d3Chart = D3Chart;