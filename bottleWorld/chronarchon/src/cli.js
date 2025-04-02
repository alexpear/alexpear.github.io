// Command-line utility for testing the Chronarchon bottle world game backend.
// Execute this node script to interact with the game state.

// LATER require World

const Yaml = require('js-yaml');
const FS = require('fs');

class CLI {
    constructor () {
        this.load();
    }

    save () {
        fs.writeFileSync(
            __dirname + '/' + CLI.SAVEFILE,
            this.world.toYml(),
            'utf8'
        );
    }

    load () {
        this.world = World.fromFile(CLI.SAVEFILE);
    }

    parseCommand (parametersSpaced) {
        const COMMANDS = {
            look: this.look,
            explore: this.explore,
            confront: this.confront,
            take: this.take,
            give: this.give,
            hide: this.hide,
            command: this.command,
            come: this.come,
            stay: this.stay,
        };

        const params = parametersSpaced.split('\s');

        const command = COMMANDS[params[0]];

        if (! command) {
            return console.log(`Usage: node cli.js <command> \n  Possible commands include: TODO`);
        }

        command.call(this, params.slice(1));

        // TODO look (optional subparam) help explore confront take (item) hide (item) give (item person) command (person command) come (person) stay (person)
    }

    look (params) {

    }

    explore (params) {

    }

    confront (params) {

    }

    take (params) {

    }

    give (params) {

    }

    hide (params) {

    }

    command (params) {

    }

    come (params) {

    }

    stay (params) {

    }

    static run () {
        const cli = new CLI();

        cli.parseCommand(
            process.argv.slice(2)
        );

        cli.save();
    }
}

CLI.SAVEFILE = '../world.yml';

CLI.run();
