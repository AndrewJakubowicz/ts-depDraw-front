let d3 = require('d3');

const width = '100%',
    height = '400px',
    margin = {top: 40, right: 20, left: 20, bottom: 40};

var webcola = window.cola.d3adaptor(d3)
            .linkDistance(80)
            .avoidOverlaps(true)
            .handleDisconnected(false)
            .size([width, height]);


let svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height);

function update(graphData){
    // Links
    let link = svg.selectAll("line.link")
        .data(graphData.links)
    let newLink = link.enter().insert('line', 'rect.node')
            .attr("class", "link")
            .attr("stroke", 'black')
            .attr("stroke-width", 2);
    link.exit().remove();


    let pad = 3;
    let node = svg.selectAll('rect.node')
        .data(graphData.nodes, d => d.name )
    
    let nodeEnter = node.enter().append('rect')
            .attr('class', 'node')
            .attr('width', 40)  // TODO make based on data
            .attr('height', 40) // TODO make based on data
            .attr('fill', 'red')
            .call(webcola.drag);
    node.exit().remove();
    
    
    webcola.on('tick', function(){
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("x", function (d) { return d.x - d.width / 2 + pad; })
            .attr("y", function (d) { return d.y - d.height / 2 + pad; });
        
        group.attr("x", function (d) { return d.bounds.x; })
            .attr("y", function (d) { return d.bounds.y; })
            .attr("width", function (d) { return d.bounds.width(); })
            .attr("height", function (d) { return d.bounds.height(); });
    });

    // This adds metaData to the Layout
    webcola.start();
}


