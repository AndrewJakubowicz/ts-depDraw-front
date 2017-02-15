import {connect} from 'react-redux';
import React from 'react';

import {INIT_PROGRAM} from '../actions';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import loadStore from './util/loadStore';



/**
 * This dialog can only be closed if an action is selected.
 */
class DialogStartModalComponent extends React.Component {
    state = {
        open: true,
        loadDisabled: !(!(window.File && window.FileReader && window.FileList && window.Blob)),
        warningText: !(!(window.File && window.FileReader && window.FileList && window.Blob)) ? "" : "Your browser doesn't support loading files!",
        loadActions: []
    };

    handleFileChange(e){
        // Here we make sure the saved file is legitimate.
        var file = e.target.files[0];
        if (file && !(!(window.File && window.FileReader && window.FileList && window.Blob))) {
            if (file.name.slice(-9) === "tsDepDraw"){
                let reader = new FileReader();

                reader.readAsText(file);
                reader.onload = e => {
                    const fileText = e.target.result;
                    try {
                        this.setState({warningText: ""});
                        this.setState({loadDisabled: false})
                        const fileParsed = JSON.parse(fileText);
                        // Here we need to reconstruct the saved data.
                        // loadActions.map(this.props.dispatchAnAction);
                        this.setState({loadActions: loadStore(fileParsed)});
                    } catch(e) {
                        this.setState({warningText: "Your saved file is corrupt"});
                        this.setState({loadDisabled: true})
                        this.setState({loadActions: []});
                    }
                    
                }
            } else {
                this.setState({warningText: "Make sure your save file ends with '.tsDepDraw'"});
            }
        } else {
            this.setState({warningText: ""});
            this.setState({loadDisabled: true})
        }
        
    }
    shouldComponentUpdate = () => {
        return true;
    }
    handleOpen = () => {
        this.setState({open: true});
    };

    handleCloseWithLoad = () => {
        this.state.loadActions.map(this.props.dispatchAnAction)
        this.setState({open: false});

    };

    handleCloseWithContinue = () => {
        this.setState({open: false})
        this.props.clickContinue();
    }

    render() {
        const actions = [
            <FlatButton
                label="Load diagram from file"
                primary={!this.state.loadDisabled}
                disabled={this.state.loadDisabled}
                onTouchTap={this.handleCloseWithLoad}
            />,
            <FlatButton
                label="Continue"
                primary={true}
                onTouchTap={this.handleCloseWithContinue}
            />
        ];
        return (
            <Dialog
                title="Welcome to Typescript Dependency Draw!"
                actions={actions}
                modal={true}
                open={this.state.open}
                >
                Would you like to continue to a live server, or load a saved diagram?
                <br />
                <span style={{color: "red"}}>{this.state.warningText ? <span><br />{this.state.warningText}<br /></span> : ""}</span>
                <br />
                <input id="file" type="file" accept="tsDepDraw"
                    onChange={e => this.handleFileChange(e)}
                />
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    clickContinue: () => dispatch({type: INIT_PROGRAM}),
    dispatchAnAction: dispatch
});

export const StartModalBox = connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogStartModalComponent)