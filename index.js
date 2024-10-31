import express from "express";
import { Command } from "commander";
import path from "path";
import { describer } from "./scripts/expressionDescribe.js";
import shell from "./scripts/Shell.js";

function cli() {
    program
       .name('arcy')
       .description('The super-set of Arc')
       .version('0.0.1-beta.1')
    program.command('expression')
       .description('describe an expression')
       .action(() => {
            describer()
    });
    program.command('Shell')
       .description('Start an interactive shell')
       .action(() => {
        shell()
    });
    program.command('web')
       .description('Start Arcy Web UI')
       .action(() => {
        webApp()
    })
}

function webApp() {
const app = express();
const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/web/public/App.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
}