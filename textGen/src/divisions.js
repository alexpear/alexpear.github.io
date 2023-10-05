'use strict';

// Outputs a prompt about the A-Z Agency fictional universe.

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class DivisionPrompt extends TextGen {

    randomDivision () {
        const topic = Util.randomOf([
            'Archive',
            'Bio',
            'Chrono',
            'Divine',
            'Extraterrestrial',
            'Finance',
            'Geopolitics',
            'History',
            'Intelligence',
            'Justice',
            'Knowledge',
            'Legal',
            'Marine',
            'Neural',
            'Oversight',
            'Planar',
            'Questions',
            'Research',
            'Sky',
            'Technology',
            'Underworld',
            'Villain',
            'War',
            'Xi',
            'Youth',
            'Zero',
        ]);

        return `${topic[0]} Division (${topic})`;
    }

    randomAspect () {
        return Util.randomOf([
            'headquarters',
            'Basic Research work',
            'least favorite division',
            'interdivisional collaboration',
            'long term fears',
            'applied research',
            'everyday activities',
            'head',
            'Internal Affairs',
            'external liaisons',
            'security personnel',
            'superhero team',
            'ancient guardian golem',
            'immortal wanderer',
            'ancient guardian order',
            'defectors',
            'supervillain',
            'executive summary',
            'ancient beast',
            'foreign rival organization',
            'interdivisional relationships',
        ]);
    }

    // Called by TextGen.outputHTML()
    output () {
        const aspect = 'interdivisional relationships';
        // const aspect = this.randomAspect();

        if (aspect === 'interdivisional relationships') {
            return `${this.randomDivision()}'s opinion of ${this.randomDivision()}`;
        }

        return `The ${this.randomAspect()} of ${this.randomDivision()}`;
    }

    static run () {
        const output = new DivisionPrompt().output();
        console.log(output);
    }
}

module.exports = DivisionPrompt;

DivisionPrompt.run();
