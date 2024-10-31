import readline from 'readline';
import chalk from 'chalk';
import axios from 'axios';
import ts from 'typescript';
import fs from 'fs';

export { shell as default}
// Mock interpreter function to handle Arcy commands
function shell() {
    async function interpretArcyCommand(command) {
        const [cmd, ...args] = command.split(' ');
    
        switch (cmd) {
            // HTTP commands
            case 'http-get':
                return await httpGet(args[0]);
            case 'http-post':
                return await httpPost(args[0], args[1] || '');
    
            // TypeScript commands
            case 'ts-compile':
                return tsCompile(args[0]);
            case 'ts-eval':
                return tsEval(args.join(' '));
    
            // General commands
            case 'show version':
                return chalk.green('Arcy version 1.0.0');
            case 'help':
                return showHelp();
            case 'exit':
                return null; // Indicates the user wants to exit
            default:
                return chalk.red(`Unknown command: ${command}`);
        }
    }
    
    // HTTP GET Request
    async function httpGet(url) {
        if (!url) return chalk.red('Usage: http-get <url>');
        try {
            const response = await axios.get(url);
            return chalk.green(`Response: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            return chalk.red(`Error: ${error.message}`);
        }
    }
    
    // HTTP POST Request
    async function httpPost(url, data) {
        if (!url) return chalk.red('Usage: http-post <url> <data>');
        try {
            const parsedData = JSON.parse(data || '{}');
            const response = await axios.post(url, parsedData);
            return chalk.green(`Response: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            return chalk.red(`Error: ${error.message}`);
        }
    }
    
    // TypeScript Compile Command
    function tsCompile(filePath) {
        if (!filePath) return chalk.red('Usage: ts-compile <file.ts>');
        if (!fs.existsSync(filePath)) return chalk.red('File does not exist.');
    
        const source = fs.readFileSync(filePath, 'utf8');
        const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
        const compiledPath = filePath.replace(/\.ts$/, '.js');
    
        fs.writeFileSync(compiledPath, result.outputText);
        return chalk.green(`Compiled to ${compiledPath}`);
    }
    
    // TypeScript Evaluation
    function tsEval(expression) {
        try {
            const compiled = ts.transpile(expression);
            const result = eval(compiled);
            return chalk.green(`Result: ${result}`);
        } catch (error) {
            return chalk.red(`Error: ${error.message}`);
        }
    }
    
    // Enhanced Help Command
    function showHelp() {
        return `
    ${chalk.bold.blue('ArcyShell - Command Help')}
    
    ${chalk.yellowBright('General Commands:')}
      ${chalk.cyan('show version')}    - Displays the current version of Arcy.
      ${chalk.cyan('help')}            - Shows this help message.
      ${chalk.cyan('exit')}            - Exits the ArcyShell.
    
    ${chalk.yellowBright('HTTP Commands:')}
      ${chalk.cyan('http-get <url>')}  - Sends an HTTP GET request to the specified URL.
      ${chalk.cyan('http-post <url> <data>')} - Sends an HTTP POST request to the specified URL with JSON data.
    
    ${chalk.yellowBright('TypeScript Commands:')}
      ${chalk.cyan('ts-compile <file.ts>')}  - Compiles a TypeScript file to JavaScript.
      ${chalk.cyan('ts-eval <expression>')}  - Evaluates a TypeScript expression in the shell.
    
    ${chalk.greenBright('Usage Example:')}
      ${chalk.white('Type')} ${chalk.cyan('http-get https://jsonplaceholder.typicode.com/todos/1')}
      ${chalk.white('or')} ${chalk.cyan('ts-eval let num: number = 42; num * 2;')}
    
    ${chalk.magentaBright('Enjoy using ArcyShell!')}
    `;
    }
    
    // Initialize the readline interface for user input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.green('ArcyShell> ')
    });
    
    // Welcome message
    console.log(chalk.blue('Welcome to ArcyShell! Type "help" for a list of commands.'));
    rl.prompt();
    
    // Handle each line of input
    rl.on('line', async (line) => {
        const command = line.trim();
        const output = await interpretArcyCommand(command);
    
        if (output === null) { // Null output indicates an exit command
            console.log(chalk.yellow('Exiting ArcyShell...'));
            rl.close();
            return;
        }
    
        // Display command output and re-prompt
        console.log(output);
        rl.prompt();
    });
    
    // Handle shell exit
    rl.on('close', () => {
        console.log(chalk.blue('Goodbye from ArcyShell!'));
        process.exit(0);
    });
}

shell();