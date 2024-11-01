import fs from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';

/**
 * WebArcy Language Specification
 * 
 * Syntax Examples:
 * 
 * @page Home {
 *   @title "My Website"
 *   @meta description="Welcome to my site"
 *   
 *   @component Header {
 *     @style {
 *       bg: #333
 *       text: white
 *       padding: 20px
 *     }
 *     
 *     "Welcome to " + @title
 *     
 *     @button primary {
 *       "Click Me"
 *       @onClick { alert("Hello!") }
 *     }
 *   }
 *   
 *   @section main {
 *     @foreach item in items {
 *       @card {
 *         @title: item.title
 *         @content: item.description
 *       }
 *     }
 *   }
 * }
 */

export class WebArcyLang {
    constructor() {
        this.components = new Map();
        this.styles = new Map();
        this.scripts = new Map();
    }

    /**
     * Tokens and Keywords
     */
    static KEYWORDS = {
        PAGE: '@page',
        COMPONENT: '@component',
        STYLE: '@style',
        TITLE: '@title',
        META: '@meta',
        BUTTON: '@button',
        SECTION: '@section',
        FOREACH: '@foreach',
        IF: '@if',
        ELSE: '@else',
        ONCLICK: '@onClick',
        IMPORT: '@import'
    };

    /**
     * Parse WebArcy code to AST
     */
    parse(code) {
        const lines = code.split('\n').map(line => line.trim());
        const ast = {
            type: 'Program',
            body: []
        };

        let currentNode = ast;
        let scope = [ast];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith('@page')) {
                const pageName = line.match(/@page\s+(\w+)/)[1];
                const pageNode = {
                    type: 'Page',
                    name: pageName,
                    children: []
                };
                currentNode.body.push(pageNode);
                scope.push(pageNode);
            }
            else if (line.startsWith('@component')) {
                const componentName = line.match(/@component\s+(\w+)/)[1];
                const componentNode = {
                    type: 'Component',
                    name: componentName,
                    children: []
                };
                currentNode.body.push(componentNode);
                scope.push(componentNode);
            }
            else if (line.startsWith('@style')) {
                const styleNode = {
                    type: 'Style',
                    rules: this.parseStyles(lines.slice(i + 1))
                };
                currentNode.body.push(styleNode);
            }
            // Add more parsing rules...
        }

        return ast;
    }

    /**
     * Convert WebArcy to HTML
     */
    toHTML(ast) {
        let html = '';
        
        const processNode = (node) => {
            switch (node.type) {
                case 'Page':
                    return `
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <title>${node.title || node.name}</title>
                                ${node.meta ? this.generateMeta(node.meta) : ''}
                                ${this.generateStyles()}
                            </head>
                            <body>
                                ${node.children.map(processNode).join('\n')}
                                ${this.generateScripts()}
                            </body>
                        </html>
                    `;
                
                case 'Component':
                    return `
                        <div class="component-${node.name.toLowerCase()}">
                            ${node.children.map(processNode).join('\n')}
                        </div>
                    `;
                
                case 'Button':
                    return `
                        <button class="btn-${node.variant || 'default'}"
                                onclick="${node.onClick || ''}">
                            ${node.content}
                        </button>
                    `;
                
                // Add more conversion rules...
            }
        };

        return prettier.format(processNode(ast), { parser: 'html' });
    }

    /**
     * Convert WebArcy to React/JSX
     */
    toReact(ast) {
        let jsx = '';
        
        const processNode = (node) => {
            switch (node.type) {
                case 'Page':
                    return `
                        export default function ${node.name}() {
                            return (
                                <div className="page-${node.name.toLowerCase()}">
                                    ${node.children.map(processNode).join('\n')}
                                </div>
                            );
                        }
                    `;
                
                case 'Component':
                    return `
                        function ${node.name}() {
                            return (
                                <div className="component-${node.name.toLowerCase()}">
                                    ${node.children.map(processNode).join('\n')}
                                </div>
                            );
                        }
                    `;
                
                // Add more conversion rules...
            }
        };

        return prettier.format(processNode(ast), { parser: 'babel' });
    }

    /**
     * Generate CSS from WebArcy styles
     */
    generateStyles() {
        let css = '';
        
        for (const [selector, rules] of this.styles) {
            css += `
                ${selector} {
                    ${Object.entries(rules)
                        .map(([prop, value]) => `${prop}: ${value};`)
                        .join('\n')}
                }
            `;
        }

        return prettier.format(css, { parser: 'css' });
    }

    /**
     * Compile WebArcy file
     */
    async compile(filePath, options = {}) {
        const source = await fs.promises.readFile(filePath, 'utf8');
        const ast = this.parse(source);
        
        const output = {
            html: this.toHTML(ast),
            react: this.toReact(ast),
            css: this.generateStyles(),
            ast: ast
        };

        if (options.outDir) {
            const basename = path.basename(filePath, '.warcy');
            await fs.promises.mkdir(options.outDir, { recursive: true });
            
            await Promise.all([
                fs.promises.writeFile(
                    path.join(options.outDir, `${basename}.html`),
                    output.html
                ),
                fs.promises.writeFile(
                    path.join(options.outDir, `${basename}.jsx`),
                    output.react
                ),
                fs.promises.writeFile(
                    path.join(options.outDir, `${basename}.css`),
                    output.css
                )
            ]);
        }

        return output;
    }
}

// Example usage:
/*
const webArcy = new WebArcyLang();

const code = `
@page Home {
    @title "My Website"
    
    @component Header {
        @style {
            bg: #333
            color: white
            padding: 20px
        }
        
        "Welcome to my site"
        
        @button primary {
            "Click Me"
            @onClick { alert("Hello!") }
        }
    }
}
`;

const result = await webArcy.compile('example.warcy', {
    outDir: './build'
});
*/

export default WebArcyLang; 