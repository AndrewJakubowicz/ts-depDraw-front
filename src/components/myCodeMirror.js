import {connect} from 'react-redux';
import React from 'react'

import {getFileText} from '../reducers';
import * as actions from '../actions';

var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');



// Component for CodeMirror
const CodeMapComponent = React.createClass({
    componentDidMount: function () {
        // This runs after the component mounts.
        // var codeEditorNode = ReactDOM.findDOMNode(this);
        
    },
    componentWillReceiveProps: function(newProps) {
        console.log('OI BUDDY');
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

        this.myCodeMirror.on('cursorActivity', (event) => {this.props.cursorActivity(this.myCodeMirror, event)});
    },
    render: function() {
        return (<div>
            <h2>File: {this.props.filePath}</h2>
            <div ref={this.receiveRef}></div>
        </div>)
    }
});

const mapStateToProps = state => {
    console.log("STATE UPDATING SUCKER!")
    return {
        filePath: getFileText(state).file,
        fileText: getFileText(state).text
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cursorActivity: (editor, event) => {
            console.log(editor.getCursor(event));
        }
    }
}


export const CodeDisplayEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(CodeMapComponent);




