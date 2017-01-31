import {connect} from 'react-redux';
import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import {hashNodeToString} from '../d3Network/util/hashNode';

import {getFocussedTokenFromState, getFilteredDependencies, getFilteredDependents, getLeftFilterText, getRightFilterText} from '../reducers';
import * as actions from '../actions';

import './dragonfly.css'

const textInputStyles = {
    padding: "0 5px 0 5px"
}


const populateList = (dropDownList, callback) => {
    if (!(dropDownList && dropDownList.length !== 0)){
        return <span></span>
    }
    return dropDownList.map(v => (
        <ListItem
            key={hashNodeToString(v) + '-ListItem'}
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
        </ListItem>
    ));
}


const DragonFlyComponent =  React.createClass ({
    render: function() {
        const props = this.props;
        const attributes = {...(!(props.leftList)) && {style: {display: "none"}}};
        return (<div id="dragonFly">
            <div id="leftBox" {...attributes} >
                <Paper zDepth={2}>
                    <TextField
                        style={textInputStyles}
                        hintText="Filter dependents"

                        onClick={e => e.stopPropagation()}
                        onInputCapture = {e => props.leftInput(e.target.value)}
                        value={props.leftFilterField}

                        />
                    <List className="overflowy">
                        {populateList(props.leftList, node => props.addDepnt({source: node, target: props.centreData}))}
                    </List>
                </Paper>
            </div>
            <div id="centreBox">
                    <Paper zDepth={4}>
                    <div onClick={e => {
                        e.stopPropagation();
                        props.addSelectedNode(props.centreData);
                    }}>
                        <span>{props.centreData.kind}<br /></span>
                        <span>{props.centreData.displayString}</span>
                    </div>
                    </Paper>
                    <div id="dependency-list">
                        <Paper>
                        <List>
                            <ListItem>TAIL ATTEMPT</ListItem>
                            <ListItem>LOOK AT TAIL </ListItem>
                            <ListItem>more tail</ListItem>
                        </List>
                        </Paper>
                    </div>
                    <div id="dep-group-list">
                        <Paper>
                        <List>
                            <ListItem>Where we group the dependencies</ListItem>
                            <ListItem>LOOK AT TAIL </ListItem>
                            <ListItem>more tail</ListItem>
                        </List>
                        </Paper>
                    </div>
            </div>
            <div id="rightBox">
                <Paper zDepth={2}>
                <TextField
                    style={textInputStyles}
                    hintText="Filter dependencies"
                    onClickCapture={e => e.stopPropagation()}
                    onInputCapture = {e => props.rightInput(e.target.value)}
                    value={props.rightFilterField}
                    />
                <List className="overflowy">
                    {populateList(props.rightList, (node) => props.addDep({source: props.centreData, target: node}))}
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
    rightFilterField: getRightFilterText(state)
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