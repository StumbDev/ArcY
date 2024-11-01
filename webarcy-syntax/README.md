# WebArcy Language Support

VS Code extension providing syntax highlighting and language support for WebArcy files.

## Features

- Syntax highlighting for .warcy files
- Code snippets for common WebArcy patterns
- Auto-closing pairs for brackets and quotes
- Smart indentation
- Code completion for WebArcy directives

## Syntax Highlighting

The extension provides highlighting for:
- WebArcy directives (@page, @component, etc.)
- Style blocks
- Strings and comments
- Control flow keywords
- CSS properties in style blocks

## Snippets

Quick snippets for common patterns:
- @page
- @component
- @style
- @if
- @foreach

## Installation

1. Copy these files into a new directory named `webarcy-syntax`
2. Run `npm install` in the directory
3. Package the extension:
   ```bash
   npm install -g vscode-ext
   vsce package
   ```
4. Install the generated .vsix file in VS Code

## Usage

Files with the `.warcy` extension will automatically use the WebArcy syntax highlighting.

## Contributing

Feel free to submit issues and enhancement requests! 