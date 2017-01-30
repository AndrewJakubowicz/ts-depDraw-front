import {connect} from 'react-redux';
import React from 'react';

import {hashNodeToString} from '../d3Network/util/hashNode';

import {getFocussedTokenFromState, getFilteredDependencies, getFilteredDependents} from '../reducers';
import * as actions from '../actions';

import './dragonfly.css'

const populateList = (dropDownList, callback) => {
    if (!(dropDownList && dropDownList.length !== 0)){
        return <span></span>
    }
    return dropDownList.map(v => (
        <div
            key={hashNodeToString(v) + '-div'}
            className="dropdownItem"
            onClick={e => {
                e.stopPropagation();
                callback(v);
            }}
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
    return <div id="dragonFly">
        <div id="leftBox" {...attributes} >
            <input
                onClick={e => e.stopPropagation()}
                onInputCapture = {e => props.leftInput(e.target.value)} />
            <div className="overflowy">
                {populateList(props.leftList, (node) => props.addDepnt({source: node, target: props.centreData}))}
            </div>
        </div>
        <div id="centreBox">
            <div onClick={e => {
                e.stopPropagation();
                props.addSelectedNode(props.centreData);
            }}>
                <span>{props.centreData.kind}<br /></span>
                <span>{props.centreData.displayString}</span>
            </div>
            <ul>
                <li>TAIL ATTEMPT</li>
                <li>LOOK AT TAIL </li>
                <li>more tail</li>
            </ul>
        </div>
        <div id="rightBox">
            <input
                onClickCapture={e => e.stopPropagation()}
                onInputCapture = {e => props.rightInput(e.target.value)} />
            <div className="overflowy">
                {populateList(props.rightList, (node) => props.addDep({source: props.centreData, target: node}))}
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
    rightInput: filterText => dispatch(actions.updateRightFilter(filterText)),
    addDep: ({source, target}) => {
        dispatch(actions.addNode(target));
        dispatch(actions.addEdge({source, target}));
        dispatch(actions.fetchSelected(target.file, target.start.line, target.start.offset))
    },
    addDepnt: ({source, target}) => {
        dispatch(actions.addNode(source));
        dispatch(actions.addEdge({source, target}));
        dispatch(actions.fetchSelected(source.file, source.start.line, source.start.offset))
    },
    addSelectedNode: node => dispatch(actions.addNode(node))
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)