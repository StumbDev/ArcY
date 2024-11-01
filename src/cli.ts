#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { shell } from './scripts/Shell';
import { WebArcyLang } from './scripts/WebArcyLang';
import { WebScript } from './scripts/WebScript';
import { createServer } from 'vite';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const program = new Command();

program
    .name('arcy')
    .description('A modern CLI tool for web development')
    .version('1.0.0');

// ... rest of the CLI code ...

program.parse(process.argv); 