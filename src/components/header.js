import {connect} from 'react-redux';
import React from 'react'

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';





const AppHeaderComponent =  React.createClass({
    handleSaveClick: function(){
        alert("Clicked on save!");
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
});

const mapDispatchToProps = dispatch => ({
});

export const AppHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeaderComponent)