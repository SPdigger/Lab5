"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    let timeout = undefined;
    let activeEditor = vscode.window.activeTextEditor;
    const decTypeArray = [];
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const regHex = /(?:\#|\b0x)([a-f0-9]{6}([a-f0-9]{2})?)/gi;
        const text = activeEditor.document.getText();
        const bigArray = [];
        let match;
        while ((match = regHex.exec(text))) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = {
                range: new vscode.Range(startPos, endPos)
            };
            let matchHex = '#' + match[1];
            console.log(matchHex);
            const hexDecorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: matchHex
            });
            const tmp = [];
            tmp.push(decoration);
            console.log(match[0].length);
            bigArray.push(tmp);
            decTypeArray.push(hexDecorationType);
        }
        console.log(decTypeArray.length);
        console.log(bigArray.length);
        for (let i = 0; i < decTypeArray.length; i++) {
            activeEditor.setDecorations(decTypeArray[i], bigArray[i]);
        }
    }
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map