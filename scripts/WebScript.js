import { JSDOM } from 'jsdom';
import node:fs from 'node:fs';
import node:path from 'node:path';
import prettier from 'prettier';
import postcss from 'postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import { parse as parseHTML } from 'node-html-parser';

export class WebScript {
    /**
     * Parses and analyzes an HTML file
     * @param {string} filePath - Path to the HTML file
     * @returns {Object} Analysis results
     */
    static async analyzeHTML(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const root = parseHTML(content);
        
        return {
            title: root.querySelector('title')?.text || 'No title',
            metadata: {
                description: root.querySelector('meta[name="description"]')?.getAttribute('content'),
                keywords: root.querySelector('meta[name="keywords"]')?.getAttribute('content'),
            },
            structure: {
                headings: {
                    h1: root.querySelectorAll('h1').length,
                    h2: root.querySelectorAll('h2').length,
                    h3: root.querySelectorAll('h3').length,
                },
                links: root.querySelectorAll('a').length,
                images: root.querySelectorAll('img').length,
                forms: root.querySelectorAll('form').length,
                scripts: root.querySelectorAll('script').length,
                styles: root.querySelectorAll('style,link[rel="stylesheet"]').length
            },
            accessibility: {
                imgAltTags: root.querySelectorAll('img[alt]').length,
                ariaLabels: root.querySelectorAll('[aria-label]').length,
                roles: root.querySelectorAll('[role]').length
            }
        };
    }

    /**
     * Optimizes CSS content
     * @param {string} cssContent - CSS content to optimize
     * @param {Object} options - Optimization options
     * @returns {Promise<string>} Optimized CSS
     */
    static async optimizeCSS(cssContent, options = {}) {
        const plugins = [
            autoprefixer,
            ...(options.minify ? [cssnano] : [])
        ];

        const result = await postcss(plugins).process(cssContent, {
            from: undefined
        });

        return result.css;
    }

    /**
     * Validates HTML content
     * @param {string} htmlContent - HTML content to validate
     * @returns {Object} Validation results
     */
    static validateHTML(htmlContent) {
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        const errors = [];
        const warnings = [];

        // Basic structure validation
        if (!document.doctype) {
            errors.push('Missing DOCTYPE declaration');
        }

        if (!document.head) {
            errors.push('Missing <head> element');
        }

        if (!document.title) {
            warnings.push('Missing <title> element');
        }

        // Meta tags validation
        if (!document.querySelector('meta[charset]')) {
            warnings.push('Missing charset meta tag');
        }

        if (!document.querySelector('meta[name="viewport"]')) {
            warnings.push('Missing viewport meta tag');
        }

        // Accessibility checks
        const images = document.getElementsByTagName('img');
        for (const img of images) {
            if (!img.hasAttribute('alt')) {
                warnings.push(`Image missing alt attribute: ${img.src}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Converts HTML to JSX
     * @param {string} htmlContent - HTML content to convert
     * @returns {string} Converted JSX
     */
    static htmlToJSX(htmlContent) {
        // Basic HTML to JSX conversion rules
        const jsxContent = htmlContent
            .replace(/class=/g, 'className=')
            .replace(/for=/g, 'htmlFor=')
            // Handle self-closing tags
            .replace(/<(img|br|input|hr)([^>]*)>/g, '<$1$2 />')
            // Handle style attributes
            .replace(/style="([^"]*)"/g, (match, styles) => {
                const cssProperties = styles.split(';')
                    .filter(style => style.trim())
                    .map(style => {
                        const [property, value] = style.split(':').map(s => s.trim());
                        return `${this.camelCase(property)}: '${value}'`;
                    });
                return `style={{${cssProperties.join(', ')}}}`;
            });

        return jsxContent;
    }

    /**
     * Creates a React component template
     * @param {string} name - Component name
     * @param {string} type - Component type (functional/class)
     * @returns {string} Component template
     */
    static createReactComponent(name, type = 'functional') {
        if (type === 'class') {
            return `
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ${name} extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="${name.toLowerCase()}-container">
                <h1>${name}</h1>
            </div>
        );
    }
}

${name}.propTypes = {};

${name}.defaultProps = {};

export default ${name};
`;
        }

        return `
import React from 'react';
import PropTypes from 'prop-types';

function ${name}(props) {
    return (
        <div className="${name.toLowerCase()}-container">
            <h1>${name}</h1>
        </div>
    );
}

${name}.propTypes = {};

${name}.defaultProps = {};

export default ${name};
`;
    }

    /**
     * Extracts CSS statistics
     * @param {string} cssContent - CSS content to analyze
     * @returns {Object} CSS statistics
     */
    static analyzeCSSStats(cssContent) {
        const selectors = cssContent.match(/[^}]+{/g) || [];
        const declarations = cssContent.match(/\{[^}]+\}/g) || [];
        const mediaQueries = cssContent.match(/@media[^{]+\{/g) || [];
        const colors = cssContent.match(/#[a-fA-F0-9]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g) || [];
        
        return {
            selectors: {
                total: selectors.length,
                unique: new Set(selectors).size
            },
            declarations: {
                total: declarations.length,
                unique: new Set(declarations).size
            },
            mediaQueries: mediaQueries.length,
            colors: {
                total: colors.length,
                unique: new Set(colors).size
            },
            size: {
                original: cssContent.length,
                formatted: prettier.format(cssContent, { parser: 'css' }).length
            }
        };
    }

    /**
     * Helper method to convert kebab-case to camelCase
     * @private
     */
    static camelCase(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
}

// Export individual methods for convenience
export const {
    analyzeHTML,
    optimizeCSS,
    validateHTML,
    htmlToJSX,
    createReactComponent,
    analyzeCSSStats
} = WebScript; 