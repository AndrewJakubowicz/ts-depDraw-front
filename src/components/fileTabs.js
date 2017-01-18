import {connect} from 'react-redux';
import React from 'react'

import {getOpenFileList} from '../reducers';
import * as actions from '../actions';

import './fileTabs.css';

const OpenFileTabsComponent = React.createClass({
    render: function(){
        return <ul className="fileTabs">
            {this.props.openFilesList.map(({fileName, openInEditor}) => 
                    <li key={fileName} onClick={() => {this.props.clickFileTab(fileName)}}
                    className={openInEditor ? "selected" : ""}>{fileName}</li>
                )}
        </ul>
    }
});


/**
 * clicking on a file tab dispatch code
 * 
 *  This handles updating the editor.
 *  This also handles updating the tabs.
 */
const clickTabLogic = (fileName, dispatch) => {
    dispatch(actions.changeOpenFileTab(fileName));
    dispatch(actions.getTextForOpenFile(fileName));
}


const mapStateToProps = state => ({
    openFilesList: getOpenFileList(state)
});

const mapDispatchToProps = dispatch => ({
    clickFileTab: fileName => clickTabLogic(fileName, dispatch)
});

export const OpenFileTabs = connect(
    mapStateToProps,
    mapDispatchToProps
)(OpenFileTabsComponent)