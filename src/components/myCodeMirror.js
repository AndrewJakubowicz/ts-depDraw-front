import {connect} from 'react-redux';
import React from 'react'

import {getFileText, getOpenFilename} from '../reducers';
import * as actions from '../actions';

var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');

import './myCodeMirror.css';



// Component for CodeMirror
const CodeMapComponent = React.createClass({
    componentWillReceiveProps: function(newProps) {
        if (this.props.fileText === newProps.fileText){
            return undefined;
        }
        this.myCodeMirror.getDoc().setValue(newProps.fileText);
    },
    receiveRef: function (node) {
        if (!node){
            return null
        }
        this.myCodeMirror = CodeMirror(node, {
                value: this.props.fileText,
                mode:  "text/typescript",
                lineNumbers: true,
                matchBrackets: true,
                readOnly: true
        })
        /** ONE DAY WORK OUT HOW TO GET RID OF THIS! */
        window.myCodeMirror = this.myCodeMirror;
        /**TODO: GET RID OF THIS GLOBAL DEP. */

        this.myCodeMirror.on('cursorActivity', (event) => {
            this.props.cursorActivity(this.myCodeMirror,event,this.props.fileName)
        });
    },
    render: function() {
        return (
        <div className="code-box"
            onClick={e => e.stopPropagation()}>
            <div data-codeMirror={this.myCodeMirror} ref={this.receiveRef}></div>
        </div>)
    }
});

const mapStateToProps = state => {
    return {
        fileText: getFileText(state),
        fileName: getOpenFilename(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cursorActivity: (editor, event, file) => {
            if (file === ""){
                return undefined
            }
            let {ch, line} = editor.getCursor(event);
            ch ++; line ++;
            // TODO: put these in the appropriate places.
            if (!window.cursorInD3){
                dispatch(actions.closeDragonfly());
                dispatch(actions.fetchSelected(file, line, ch));
                // dispatch(actions.fetchDeps(file, line, ch));
                // dispatch(actions.fetchDepnts(file, line, ch));
                // dispatch(actions.selectToken(file, line, ch));
                // dispatch(actions.addD3TokenType(file,line,ch));
                // dispatch(actions.addD3TokenDeps(file,line,ch));
                // dispatch(actions.addD3TokenDependents(file,line,ch));
            }
            
        }
    }
}


export const CodeDisplayEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(CodeMapComponent);




