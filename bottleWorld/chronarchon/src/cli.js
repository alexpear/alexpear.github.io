// Command-line utility for testing the Chronarchon bottle world game backend.
// Execute this node script to interact with the game state.

// LATER require World

const Group = require('./group.js');
const World = require('./world.js');

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

    parseCommand (parameters = []) {
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
            help: this.help,
        };

        const command = COMMANDS[parameters[0]];

        if (! command) {
            // LATER check if there is already a world in the save file.
            return this.demo();
        }

        command.call(this, parameters.slice(1));
    }

    demo () {
        this.newWorld();

        // LATER put 3 entities into player's warband somehow 

        // TODO on load, generate the candidate & display their toString() in the #candidateTextBox.
    }

    newWorld () {
        this.world = new World();

        const pop = 3;
        console.log(`New world created with ${pop} entities. \n`);

        for (let i = 0; i < pop; i++) {
            const g = Group.random();
            g.place = this.world.places[0];
            this.world.entities.push(g);
            // LATER function in World that combines Group.random() and entities.push()

            console.log(g.toString());
            console.log();
        }

        this.save();
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

    help () {
        console.log(`Usage: node cli.js <command> \n  Possible commands include: 
    look ([subparam]) 
    explore 
    confront (person)
    take (item) 
    hide (item) 
    give (item person) 
    command (person command) 
    come (person) 
    stay (person)
    help`);
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
