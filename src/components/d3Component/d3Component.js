var d3 = require('d3');
var D3Chart = {};

D3Chart.create = function(el, props, state) {
    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height);
    
    svg.append('g')
        .attr('class', 'd3-points');

    this.update(el, state);
};


D3Chart.update = function(el, state) {
    this._drawPoints(el, state.data);
};

D3Chart.destroy = function(el, state) {

};

D3Chart._drawPoints = function(el, data){
    var g = d3.select(el).selectAll('.d3-points');

    var point = g.selectAll('.data-point')
        .data(data, d => d.id);

    point.enter().append('circle')
        .attr('class', 'd3-point')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.z);

    point.exit().remove();
};

export const d3Chart = D3Chart;