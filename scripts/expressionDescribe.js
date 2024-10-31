import chalk from 'chalk';
import hljs from 'highlight.js';
import readline from 'readline';

export { describer };

// Function to describe different JavaScript expressions
function describer() {
    function describeExpression(expression) {
        const description = [];
    
        // Check for variable declarations
        if (/^(const|let|var)\s+\w+\s*=/.test(expression)) {
            description.push(chalk.blue('Variable Declaration'));
        }
    
        // Check for function declaration or expression
        if (/function\s+\w*\(|\w+\s*=>\s*\{?/.test(expression)) {
            description.push(chalk.green('Function Declaration/Expression'));
        }
    
        // Check for object literals
        if (/^\{\s*.*\s*\}$/.test(expression)) {
            description.push(chalk.magenta('Object Literal'));
        }
    
        // Check for array literals
        if (/^\[\s*.*\s*\]$/.test(expression)) {
            description.push(chalk.cyan('Array Literal'));
        }
    
        // Check for conditional statements
        if (/if\s*\(.*\)\s*\{?/.test(expression)) {
            description.push(chalk.yellow('Conditional Statement (if)'));
        }
    
        // Check for loops (for, while)
        if (/for\s*\(.*\)\s*\{?/.test(expression)) {
            description.push(chalk.red('For Loop'));
        }
        if (/while\s*\(.*\)\s*\{?/.test(expression)) {
            description.push(chalk.red('While Loop'));
        }
    
        // Check for class declarations
        if (/class\s+\w+/.test(expression)) {
            description.push(chalk.magenta('Class Declaration'));
        }
    
        // Default if no matches
        if (description.length === 0) {
            description.push(chalk.gray('Unknown Expression Type'));
        }
    
        return description.join('\n');
    }
    
    // Highlighting function for syntax
    function highlightSyntax(expression) {
        const highlighted = hljs.highlight(expression, { language: 'javascript' }).value;
        return highlighted;
    }
    
    // CLI Setup
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question(chalk.white('Enter a JavaScript expression to describe: '), (expression) => {
        // Apply syntax highlighting and output the highlighted expression
        console.log('\n' + chalk.reset('Highlighted Expression:\n') + highlightSyntax(expression));
    
        // Describe the expression
        console.log('\nDescription:\n' + describeExpression(expression));
        rl.close();
    });    
}

module.exports('shell')