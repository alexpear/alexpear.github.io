'use strict';

const Yaml = require('js-yaml');

const Alignment = require('../../dnd/alignment.js');

const Util = require('../../util/util.js');

class Person {
    constructor (options) {
        options = options || {};

        this.name = '<name>';
        this.alignment = Util.randomOf([
            'Lawful Radiant',
            'Lawful Dark',
            'Chaotic Radiant',
            'Chaotic Dark'
        ]);
        this.gender = Util.randomOf([
            'female',
            'male'
            // LATER expand
        ]);
        this.age = Util.randomIntBetween(4, 50);
        this.species = Util.randomOf([
            'human',
            'elf',
            // 'faerie',
            // 'vampire'
            // TODO vampires should not be radiant
        ]);
        this.class = Util.randomOf([
            'commoner',
            'noble',
            'warrior',
            'mage',
            'rogue',
            'ranger',
            'scholar'
        ]);
        this.org = undefined;
        this.role = undefined;
        // Rank number within org?
        this.relationships = [];
    }

    toString () {
        return JSON.stringify(this, undefined, '    ');
    }

    toPrettyString () {
        const povText = this.pov ?
            ', PoV character' :
            '';

        return `${this.name}, a ${this.gender} ${this.alignment} ${this.species} ${this.class} (age ${this.age}${povText})`;
    }

    toJson () {
        // return this; // omit circular reference via omitting relationships, maybe also orgs
    }

    static example () {
        return new Person();
    }

    static run () {
        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('person.js') ||
            ! process.argv[2].startsWith('test')) {
            // The following logic is for command-line use only.
            return;
        }

        Person.test();
    }

    static test () {
        console.log(`Person.test(): \n`);

        const person = new Person();

        Util.logDebug(person.toPrettyString());

        // Util.logDebug(
        //     '\n' + 
        //     Yaml.dump(

        //     )
        // );

        return person;
    }
}

module.exports = Person;

// Run
Person.run();
// Person.test();
