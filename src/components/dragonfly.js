import {connect} from 'react-redux';
import React from 'react';

import {getFocussedTokenFromState} from '../reducers';

import './dragonfly.css'

const DragonFlyComponent = props => (
    <div id = "dragonFly">
        <div id="leftBox">
            {props.leftList.map(v => (
                <div className="dropdownItem"><a href="#">{v.file}</a></div>
            ))}
        </div>
        <div id="centreBox">
            <p>{props.centreData.displayString}</p>
        </div>
        <div id="rightBox">
            {props.rightList.map(v => (
                    <div className="dropdownItem"><a href="#">{v.file}</a></div>
                ))}
        </div>
    </div>
)


const mapStateToProps = state => ({
    leftList: [{file: "RaR", kind: "function"}, {file: "rar", kind: "function"}],
    rightList: [{file: "rar2", kind: "function"}, {file: "rar3", kind: "function"}],
    centreData: getFocussedTokenFromState(state)
});

const mapDispatchToProps = dispatch => ({
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)