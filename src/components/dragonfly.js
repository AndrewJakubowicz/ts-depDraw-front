import {connect} from 'react-redux';
import React from 'react';

import './dragonfly.css'

const DragonFlyComponent = React.createClass({
    render: function () {
        return <div className = "dragonFly">
            <div id="leftBox"></div>
            <div id="centreBox"></div>
            <div id="rightBox"></div>
        </div>
    }
});


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)