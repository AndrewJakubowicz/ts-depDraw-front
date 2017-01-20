import {connect} from 'react-redux';
import React from 'react'

import {getFileText, getOpenFilename} from '../reducers';
import * as actions from '../actions';

var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');

import './myCodeMirror.css';



// Component for CodeMirror
const CodeMapComponent = React.createClass({
    componentDidMount: function () {
        // This runs after the component mounts.
        // var codeEditorNode = ReactDOM.findDOMNode(this);
        
    },
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

        this.myCodeMirror.on('cursorActivity', (event) => {this.props.cursorActivity(this.myCodeMirror,
                                                                                     event,
                                                                                     this.props.fileName)});
    },
    render: function() {
        console.log(this.props.fileName);
        return (<div className="row code-box">
            <div ref={this.receiveRef}></div>
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
            let {ch, line} = editor.getCursor(event);
            ch ++; line ++;
            dispatch(actions.selectToken(file, line, ch));
        }
    }
}


export const CodeDisplayEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(CodeMapComponent);




