const vscode = require('vscode');

function activate(context) {
    console.log('WebArcy extension is now active!');

    // Register code completion provider
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('webarcy', {
            provideCompletionItems(document, position) {
                const completionItems = [
                    // Directives
                    new vscode.CompletionItem('@page', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@component', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@style', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@title', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@meta', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@button', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@section', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@foreach', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@if', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@else', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@onClick', vscode.CompletionItemKind.Keyword),
                    new vscode.CompletionItem('@import', vscode.CompletionItemKind.Keyword),

                    // Common snippets
                    createSnippet('@page', '@page ${1:Name} {\n\t$0\n}'),
                    createSnippet('@component', '@component ${1:Name} {\n\t$0\n}'),
                    createSnippet('@style', '@style {\n\t${1:property}: ${2:value}\n}'),
                    createSnippet('@if', '@if ${1:condition} {\n\t$0\n}'),
                    createSnippet('@foreach', '@foreach ${1:item} in ${2:items} {\n\t$0\n}')
                ];

                return completionItems;
            }
        })
    );
}

function createSnippet(label, snippetText) {
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString(snippetText);
    return item;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 