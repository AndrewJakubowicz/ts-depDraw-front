import {d3Chart} from './d3Component';
import React from 'react';
import ReactDOM from 'react-dom'

export var Chart = React.createClass({
    propTypes: {
        data: React.PropTypes.array
    },

    componentDidMount: function(){
        d3Chart.create(this.el, {
            width: '100%',
            height: '100%'
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
