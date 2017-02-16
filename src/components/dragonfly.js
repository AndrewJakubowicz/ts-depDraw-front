import {connect} from 'react-redux';
import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import {hashNodeToString} from '../d3Network/util/hashNode';

import {getFocussedTokenFromState, getFilteredDependencies, getFilteredDependents, getLeftFilterText, getRightFilterText,
    getDragonflyTail} from '../reducers';

import * as actions from '../actions';

import './dragonfly.css'

const textInputStyles = {
    padding: "0 5px 0 5px"
}

const moduleStyle = {
    backgroundColor: "#FAFAFA",
    borderWidth: '2px',
    borderColor: '#EEEEEE',
    borderStyle: 'solid',
    color: '#757575'
}

const fileName = {
    color: "#B0BEC5"
}

const populateList = (dropDownList, callback, uniqueKey) => {
    if (!(dropDownList && dropDownList.length !== 0)){
        return <span></span>
    }
    return dropDownList.map(v => (
        <ListItem
            key={hashNodeToString(v) + '-ListItem' + uniqueKey}
            leftIcon={<span style={moduleStyle}>{v.kind[0].toUpperCase()}</span>}
            className="dropdownItem"
            onClick={e => {
                e.stopPropagation();
                callback(v);
            }}
        >
            <span
                key={hashNodeToString(v) + '-span' + uniqueKey}
            >
                {v.displayString}<br />
                <span style={fileName} key={hashNodeToString(v) + '-span2' + uniqueKey}>{v.file}</span>
            </span>
        </ListItem>
    ));
}

const populateTail = (dropDownList) => {
    if (!(dropDownList && dropDownList.length !== 0)){
        return <span></span>
    }
    let currentOffset = 0;
    return dropDownList.map(v => {
        if (v.isDep) {
            currentOffset += 5;
        } else {
            currentOffset -= 5;
        }
        return (<div
            key={hashNodeToString(v) + '-ListItem' + Math.random()}
            className="tail"
            style={{left: currentOffset + 'px'}}
        >
            <span
                key={hashNodeToString(v) + '-span' + Math.random()}
            >
                {v.kind + ',' + v.displayString + ',' + v.file}
            </span>
        </div>
    )});
}

const DragonFlyComponent = _ => ({
    render: function () {
        const props = this.props;
        const attributes = {...(!(props.leftList)) && {style: {display: "none"}}};
        return (<div id="dragonFly">
            <div id="leftBox" {...attributes} >
                <Paper zDepth={0}>
                    <TextField
                        style={textInputStyles}
                        hintText="Filter dependents"

                        onClick={e => e.stopPropagation()}
                        onInputCapture={e => props.leftInput(e.target.value)}
                        value={props.leftFilterField}

                        />
                    <List className="overflowy">
                        {populateList(props.leftList, node => {
                            props.addDepnt({source: node, target: props.centreData})
                        }, "left")}
                    </List>
                </Paper>
            </div>
            <div id="centreBox">
                    <Paper zDepth={0}>
                    <div>
                        <span>{props.centreData.kind}<br /></span>
                        <span>{props.centreData.displayString}</span>
                    </div>
                    </Paper>
                    <div id="dependency-list">
                        <ul style={{position: "relative"}}
                            onClick={e => {
                                e.stopPropagation();
                                props.clickOnTail();
                            }}>
                            {populateTail(props.tail)}
                        </ul>
                    </div>
            </div>
            <div id="rightBox">
                <Paper zDepth={0}>
                <TextField
                    style={textInputStyles}
                    hintText="Filter dependencies"
                    onClickCapture={e => e.stopPropagation()}
                    onInputCapture={e => props.rightInput(e.target.value)}
                    value={props.rightFilterField}
                    />
                <List className="overflowy">
                    {populateList(props.rightList, (node) => {
                        props.addDep({source: props.centreData, target: node})
                }, "right")}
                    
                </List>
                </Paper>
            </div>
        </div>)
    }
})


const mapStateToProps = state => ({
    leftList: getFilteredDependents(state),
    rightList: getFilteredDependencies(state),
    centreData: getFocussedTokenFromState(state),
    leftFilterField: getLeftFilterText(state),
    rightFilterField: getRightFilterText(state),
    tail: getDragonflyTail(state)
});

const mapDispatchToProps = dispatch => ({
    leftInput: filterText => dispatch(actions.updateLeftFilter(filterText)),
    rightInput: filterText => dispatch(actions.updateRightFilter(filterText)),
    addDep: ({source, target}) => {
        dispatch(actions.addD3MutationHistory(actions.addNode(source)));
        dispatch(actions.addD3MutationHistory(actions.addNode(target)));
        dispatch(actions.addNodeHistory(true, source));
        dispatch(actions.fetchSelected(target.file, target.start.line, target.start.offset))
    },
    addDepnt: ({source, target}) => {
        dispatch(actions.addNodeHistory(false, target));
        dispatch(actions.addD3MutationHistory(actions.addNode(source)));
        dispatch(actions.addD3MutationHistory(actions.addNode(target)));
        dispatch(actions.fetchSelectedToken(source))
    },
    clickOnTail: () => {
        dispatch(actions.applyD3MutationHistory());
        dispatch(actions.clearTailHistory());
    }
});

export const DragonFly = connect(
    mapStateToProps,
    mapDispatchToProps
)(DragonFlyComponent)