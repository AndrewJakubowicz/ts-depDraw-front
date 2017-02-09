import {connect} from 'react-redux';
import React from 'react'

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import saveStore, {strMapToObj, flattenActionHistory} from './util/saveStore';

import {getPlayedD3History} from '../reducers';

import {NODESTORE_REF} from '../d3Network/d3GraphEpics';



const AppHeaderComponent =  React.createClass({
    handleSaveClick: function(){
        const saveData = {
            nodeStore: strMapToObj(NODESTORE_REF),
            actionHistory: flattenActionHistory(this.props.actionHistory)
        }
        console.log(JSON.stringify(saveData))
        
    },
    render: function() {
        return (
            <AppBar
                showMenuIconButton={false}
                title={<span>Typescript Dependency Draw - Prototype</span>}
                iconElementRight={<FlatButton onClick={this.handleSaveClick} label="Save Diagram" />}
            />
    )}
})

const mapStateToProps = state => ({
    actionHistory: getPlayedD3History(state),

});

const mapDispatchToProps = dispatch => ({
});

export const AppHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeaderComponent)