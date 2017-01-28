import {connect} from 'react-redux';
import React from 'react';

import {hashNodeToString} from '../d3Network/util/hashNode';

import {getFocussedTokenFromState, getFilteredDependencies, getFilteredDependents} from '../reducers';
import * as actions from '../actions';

import './dragonfly.css'

const populateList = dropDownList => {
    if (!(dropDownList && dropDownList.length !== 0)){
        return <span></span>
    }
    return dropDownList.map(v => (
        <div
            key={hashNodeToString(v) + '-div'}
            className="dropdownItem"
        >
            <span
                key={hashNodeToString(v) + '-span'}
            >
                {v.kind + ',' + v.displayString + ',' + v.file}
            </span>
        </div>
    ));
}


const DragonFlyComponent = props => {
    const attributes = {...(!(props.leftList)) && {style: {display: "none"}}};
    return <div id = "dragonFly">
        <div id="leftBox" {...attributes} >
            <input
                onClick={e => e.stopPropagation()}
                onInputCapture = {e => props.leftInput(e.target.value)} />
            <div className="overflowy">
                {populateList(props.leftList)}
            </div>
        </div>
        <div id="centreBox">
            <div>
                <p>{props.centreData.displayString}</p>
            </div>
        </div>
        <div id="rightBox">
            <input
                onClickCapture={e => e.stopPropagation()}
                onInputCapture = {e => props.rightInput(e.target.value)} />
            <div className="overflowy">
                {populateList(props.rightList)}
            </div>
        </div>
    </div>
}


const mapStateToProps = state => ({
    leftList: getFilteredDependents(state),
    rightList: getFilteredDependencies(state),
    centreData: getFocussedTokenFromState(state)
});

const mapDispatchToProps = dispatch => ({
    leftInput: filterText => dispatch(actions.updateLeftFilter(filterText)),
    rightInput: filterText => dispatch(actions.updateRightFilter(filterText))
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)