var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');

export function createCodeBlock(filePath){
    console.log('calling codeMirror');
    let myCodeMirror = CodeMirror(document.getElementById("code-box"), {
        value: "function myScript(){return 100;}\n\t//A comment",
        mode:  "text/typescript",
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true
    }).on('cursorActivity', function(data){
        // 0 based (need to add 1 to line and offset)
        console.log(data.getCursor());
    })
}