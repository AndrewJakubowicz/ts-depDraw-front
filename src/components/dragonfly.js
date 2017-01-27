import {connect} from 'react-redux';
import React from 'react';

import {getFocussedTokenFromState, getDependenciesFromState} from '../reducers';

import './dragonfly.css'

const populateList = dropDownList => {
    if (!(dropDownList || dropDownList.length !== 0)){
        return <p>EMPTY</p>
    }
    return dropDownList.map(v => (
        <div className="dropdownItem"><a href="#">{v.file}</a></div>
    ));
}


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
            {populateList(props.rightList)}
        </div>
    </div>
)


const mapStateToProps = state => ({
    leftList: [{file: "RaR", kind: "function"}, {file: "rar", kind: "function"}],
    rightList: getDependenciesFromState(state),
    centreData: getFocussedTokenFromState(state)
});

const mapDispatchToProps = dispatch => ({
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)