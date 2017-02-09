import {connect} from 'react-redux';
import React from 'react'

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import saveStore, {strMapToObj, flattenActionHistory} from './util/saveStore';

import * as sel from '../reducers';

import {NODESTORE_REF} from '../d3Network/d3GraphEpics';



class AppHeaderComponent extends React.Component {
    state = {
        saveModalOpen: false,
        fileName: "Example Name",
        errText: ""
    }
    handleSave = () => {
        const saveData = {
            nodeStore: strMapToObj(NODESTORE_REF),
            actionHistory: flattenActionHistory(this.props.actionHistory),
            openFileText: this.props.openFileText,
            openFileList: this.props.openFileList,
            linkedTokens: this.props.linkedTokens,
            unplayedHistory: this.props.unplayedHistory,
            filters: this.props.filters
        }
        this.closeSaveDialog();
        saveStore(`${this.state.fileName}.tsDepDraw`,JSON.stringify(saveData));
        
    };
    openSaveDialog = () => {
        this.setState({saveModalOpen: true});
    };

    closeSaveDialog = () => {
        this.setState({saveModalOpen: false});
    }

    handleChange = (e) => {
        this.setState({
            fileName: e.target.value
        });
        if (e.target.value.length === 0){
            this.setState({errText: "File must have a name"});
        } else {
            this.setState({errText: ""});
        }
    };

    render = function() {
        const dialogButtons = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.closeSaveDialog}
            />,
            <FlatButton
                label="Save"
                disabled={!!(this.state.errText)}
                primary={true}
                onTouchTap={this.handleSave}
            />
        ]
        return (
            <div>
            <AppBar
                showMenuIconButton={false}
                title={<span>Typescript Dependency Draw - Prototype</span>}
                iconElementRight={<FlatButton onClick={this.openSaveDialog} label="Save Diagram" />}
            />
            <Dialog
                title="Name your save file"
                actions={dialogButtons}
                modal={true}
                open={this.state.saveModalOpen}
            >
                <TextField
                    id="save-modal-textfield"
                    value={this.state.fileName}
                    onChange={this.handleChange}
                    errorText={this.state.errText}
                    />
            </Dialog>
            </div>
    )}
}

const mapStateToProps = state => ({
    actionHistory: sel.getPlayedD3History(state),
    openFileText: sel.getFileText(state),
    openFileList: sel.getOpenFileList(state),
    linkedTokens: state.linkedTokens,
    unplayedHistory: sel.getUnplayedMutations(state),
    filters: state.filters
});

const mapDispatchToProps = dispatch => ({
});

export const AppHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeaderComponent)