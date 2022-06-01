'use strict';

const Yaml = require('js-yaml');

const Alignment = require('../../dnd/alignment.js');

const Util = require('../../util/util.js');

class Person {
    constructor (options) {
        options = options || {};

        // TODO call that vowel-consonant name gen.
        this.name = this.simpleName();
        this.alignment = Util.randomOf([
            '📖 Lawful Radiant',
            '💎 Lawful Dark',
            '🔥 Chaotic Radiant',
            '👁  Chaotic Dark'
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
            // LATER ensure vampires should not be radiant
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

    simpleName () {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';

        let output = '';

        for (let i = 0; i < 1; i++) {
            output += alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
        }

        return output
        // return output[0].toUpperCase() + output[1];
    }

    toString () {
        return JSON.stringify(this, undefined, '    ');
    }

    toPrettyString () {
        const povText = this.pov ?
            ' (PoV character)' :
            '';

        return `${this.name}, a ${this.alignment} ${this.genderAgeNoun()} of ${this.age} (${this.class})${povText}`;
    }

    genderAgeNoun () {
        if (! Util.exists(this.age) || ! this.gender) {
            throw new Error(`Weird demographic values.`);
        }

        const ageChart = [
            {
                // This number or higher
                minimum: 0,
                female: 'girl',
                male: 'boy'
            },
            {
                minimum: 17,
                female: 'young woman',
                male: 'young man'
            },
            {
                minimum: 30,
                female: 'woman',
                male: 'man'
            }
        ];

        for (let i = ageChart.length - 1; i >= 0; i--) {
            const entry = ageChart[i];
            if (entry.minimum <= this.age) {
                return entry[this.gender];
            }
        }
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
