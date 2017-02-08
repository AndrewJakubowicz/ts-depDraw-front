import {connect} from 'react-redux';
import React from 'react';

import {INIT_PROGRAM} from '../actions';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

/**
 * This dialog can only be closed if an action is selected.
 */
class DialogStartModalComponent extends React.Component {
    state = {
        open: true
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleCloseWithContinue = () => {
        this.setState({open: false})
        this.props.clickContinue();
    }

    render() {
        const actions = [
            <FlatButton
                label="Load previous diagram"
                primary={false}
                onTouchTap={this.handleClose}
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
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    clickContinue: () => dispatch({type: INIT_PROGRAM})
});

export const StartModalBox = connect(
    mapStateToProps,
    mapDispatchToProps
)(DialogStartModalComponent)