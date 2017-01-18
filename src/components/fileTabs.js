import {connect} from 'react-redux';
import React from 'react'

import {getOpenFileList} from '../reducers';
import * as actions from '../actions';

const OpenFileTabsComponent = React.createClass({
    render: function(){
        return <ul className="fileTabs">
            {this.props.openFilesList.map(({fileName}) => 
                    <li key={fileName} onClick={() => {this.props.clickFileTab(fileName)}}>{fileName}</li>
                )}
        </ul>
    }
});

const mapStateToProps = state => ({
    openFilesList: getOpenFileList(state)
});

const mapDispatchToProps = dispatch => ({
    clickFileTab: fileName => dispatch(actions.removeOpenFileName(fileName))
});

export const OpenFileTabs = connect(
    mapStateToProps,
    mapDispatchToProps
)(OpenFileTabsComponent)