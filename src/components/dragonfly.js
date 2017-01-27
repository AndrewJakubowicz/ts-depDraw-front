import {connect} from 'react-redux';
import React from 'react';

import './dragonfly.css'

const DragonFlyComponent = React.createClass({
    render: function () {
        return <div className = "dragonFly">
            <div id="leftBox">
                {this.props.leftList.map(v => (
                    <div className="dropdownItem"><a href="#">{v.file}</a></div>
                ))}
            </div>
            <div id="centreBox"></div>
            <div id="rightBox">
                {this.props.rightList.map(v => (
                        <div className="dropdownItem"><a href="#">{v.file}</a></div>
                    ))}
            </div>
        </div>
    }
});


const mapStateToProps = state => ({
    leftList: [{file: "RaR", kind: "function"}, {file: "rar", kind: "function"}],
    rightList: [{file: "rar2", kind: "function"}, {file: "rar3", kind: "function"}]
});

const mapDispatchToProps = dispatch => ({
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)