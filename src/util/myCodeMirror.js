export function createCodeBlock(filePath){
    let myCodeMirror = CodeMirror(document.getElementById("code-box"), {
        value: "function myScript(){return 100;}\n",
        mode:  "text/typescript",
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true
    }).on('cursorActivity', function(data){
        // 0 based (need to add 1 to line and offset)
        console.log(data.getCursor());
    })
}