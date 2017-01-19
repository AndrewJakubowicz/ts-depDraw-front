let d3 = require('d3');

module.exports = (json) => {
    let myObj = {};

    const width = '100%',
        height = '400px',
        margin = {top: 40, right: 20, left: 20, bottom: 40};

    let graphData;

    var webcola;


    let svg = d3.select('#graph').append('svg')
                .attr('width', width)
                .attr('height', height);

    
    function updateVisuals(){
        console.log("UPDATE!")
        // Links
        let link = svg.selectAll("line.link")
            .data(webcola.links())
        let newLink = link.enter().insert('line', 'rect.node')
                .attr("class", "link")
                .attr("stroke", 'black')
                .attr("stroke-width", 2);
        link.exit().remove();


        let pad = 3;
        let node = svg.selectAll('rect.node')
            .data(webcola.nodes(), d => d.name )
        
        let nodeEnter = node.enter().append('rect')
                .attr('class', 'node')
                .attr('width', 40)  // TODO make based on data
                .attr('height', 40) // TODO make based on data
                .attr('fill', 'red')
                .call(webcola.drag);
        node.exit().remove();
        
        
        webcola.on('tick', function(){
            newLink.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            nodeEnter.attr("x", function (d) { return d.x - d.width / 2 + pad; })
                .attr("y", function (d) { return d.y - d.height / 2 + pad; });
            
        });

        // This adds metaData to the Layout
        webcola.start();
    }

    (function init (){
        graphData = json;
        console.log('nodes-init', graphData.nodes);
        console.log('links-init', graphData.links);
        webcola = window.cola.d3adaptor(d3)
                .linkDistance(120)
                .avoidOverlaps(true)
                .handleDisconnected(false)
                .size([width, height])
                .nodes(graphData.nodes)
                .links(graphData.links)
                .start();
        updateVisuals();
    })()
    myObj.graphData = graphData;
    myObj.update = updateVisuals;
    return myObj
}