import {d3Chart} from './d3Component';
import React from 'react';
import {connect} from 'react-redux';
import {getGraphData} from '../../reducers';


// requires props.width, props.height, props.data
var Chart = React.createClass({
    propTypes: {
        data: React.PropTypes.object
    },

    componentDidMount: function(){
        d3Chart.create(this.el, {
            width: this.props.width,
            height: this.props.height
        }, this.getChartState());
    },

    componentDidUpdate: function() {
        d3Chart.update(this.el, this.getChartState())
    },

    getChartState: function() {
        return {
            data: this.props.data
        };
    },

    componentWillUnmount: function() {
        d3Chart.destroy(this.el);
    },

    receiveRef: function(node){
        this.el = node;
    },

    render: function() {
        return (
            <div className="Chart" ref={this.receiveRef}></div>
        );
    }
});

const mapStateToProps = state => ({
    data: getGraphData(state),
    width: '100%',
    height: '500px'
});

const mapDispatchToProps = dispatch => ({

});

export const Graph = connect(
    mapStateToProps,
    mapDispatchToProps
)(Chart);