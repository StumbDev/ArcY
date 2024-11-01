#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import shell from './scripts/Shell.js';
import { WebArcyLang } from './scripts/WebArcyLang.js';
import { WebScript } from './scripts/WebScript.js';
import { createServer } from 'vite';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
    .name('arcy')
    .description('A modern CLI tool for web development')
    .version('1.0.0');

// Shell commands
program
    .command('shell')
    .description('Start the interactive Arcy shell')
    .action(() => {
        console.log(chalk.blue('Starting Arcy Shell...'));
        shell();
    });

// WebArcy commands
program
    .command('compile <file>')
    .description('Compile a WebArcy file')
    .option('-o, --out-dir <dir>', 'Output directory', './build')
    .action(async (file, options) => {
        try {
            const compiler = new WebArcyLang();
            const result = await compiler.compile(file, options);
            console.log(chalk.green(`Successfully compiled ${file}`));
        } catch (error) {
            console.error(chalk.red(`Error compiling ${file}: ${error.message}`));
        }
    });

// Web development commands
program
    .command('analyze <file>')
    .description('Analyze HTML structure')
    .action(async (file) => {
        try {
            const result = await WebScript.analyzeHTML(file);
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error(chalk.red(`Error analyzing ${file}: ${error.message}`));
        }
    });

program
    .command('optimize <file>')
    .description('Optimize CSS file')
    .option('-m, --minify', 'Minify the CSS output')
    .action(async (file, options) => {
        try {
            const css = await WebScript.optimizeCSS(file, options);
            console.log(chalk.green('CSS optimization complete'));
        } catch (error) {
            console.error(chalk.red(`Error optimizing ${file}: ${error.message}`));
        }
    });

program
    .command('create-component <name>')
    .description('Create a new React component')
    .option('-t, --type <type>', 'Component type (functional/class)', 'functional')
    .action((name, options) => {
        try {
            const component = WebScript.createReactComponent(name, options.type);
            console.log(chalk.green(`Component ${name} created successfully`));
        } catch (error) {
            console.error(chalk.red(`Error creating component: ${error.message}`));
        }
    });

// HTTP utilities
program
    .command('http-get <url>')
    .description('Make an HTTP GET request')
    .action(async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(chalk.red(`Error: ${error.message}`));
        }
    });

program
    .command('http-post <url>')
    .description('Make an HTTP POST request')
    .option('-d, --data <data>', 'JSON data to send')
    .action(async (url, options) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: options.data
            });
            const data = await response.json();
            console.log(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(chalk.red(`Error: ${error.message}`));
        }
    });

// Web UI commands
program
    .command('ui')
    .description('Start the Arcy Web UI')
    .option('-p, --port <number>', 'Port number', '3000')
    .option('-h, --host <host>', 'Host address', 'localhost')
    .action(async (options) => {
        try {
            console.log(chalk.blue('Starting Arcy Web UI...'));
            
            const viteServer = await createServer({
                configFile: path.join(__dirname, 'web', 'vite.config.js'),
                root: path.join(__dirname, 'web'),
                server: {
                    port: parseInt(options.port),
                    host: options.host
                }
            });

            await viteServer.listen();
            
            console.log(chalk.green(`
🚀 Arcy Web UI is running!
   Local: http://${options.host}:${options.port}
   
   Press Ctrl+C to stop
            `));
        } catch (error) {
            console.error(chalk.red(`Failed to start Web UI: ${error.message}`));
            process.exit(1);
        }
    });

program.parse();