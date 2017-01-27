import {connect} from 'react-redux';
import React from 'react';

import {hashNodeToString} from '../d3Network/util/hashNode';

import {getFocussedTokenFromState, getDependenciesFromState, getDependentsFromState} from '../reducers';

import './dragonfly.css'

const populateList = dropDownList => {
    if (!(dropDownList && dropDownList.length !== 0)){
        return <p>EMPTY</p>
    }
    return dropDownList.map(v => (
        <div key={hashNodeToString(v) + '-div'} className="dropdownItem"><span key={hashNodeToString(v) + '-span'}>{v.kind + ',' + v.displayString + ',' + v.file}</span></div>
    ));
}


const DragonFlyComponent = props => (
    <div id = "dragonFly">
        <div id="leftBox">
            {populateList(props.leftList)}
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
    leftList: getDependentsFromState(state),
    rightList: getDependenciesFromState(state),
    centreData: getFocussedTokenFromState(state)
});

const mapDispatchToProps = dispatch => ({
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)