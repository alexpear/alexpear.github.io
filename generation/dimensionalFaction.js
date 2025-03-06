// Generates stories about conflict between fictional factions.

const Covonym = require('../textGen/src/namegen/covonym.js');
const Util = require('../util/util.js');

class Scenario {
    constructor () {
        this.chooseDimensions(3);
        this.generateFactions(2);
    }

    static allDimensions () {
        return [
            'armies',
            'naval war',
            'air power',
            'espionage',
            'cyberwar',
            'magic',
            'divine power',
            'money',
        ];
    }

    chooseDimensions (count = 3) {
        this.dimensions = [];

        while (this.dimensions.length < count) {
            const newDim = Util.randomOf(Scenario.allDimensions());

            if (this.dimensions.includes(newDim)) {
                continue;
            }

            this.dimensions.push(newDim);
        }
    }

    generateFactions (count = 3) {
        this.factions = [];

        for (let i = 0; i < count; i++) {
            this.factions.push(
                new Faction(this.dimensions)
            );
        }
    }

    toString () {
        return this.factions.map(
            f => f.toString()
        )
        .join('\n\n');
    }

    static run () {
        const scen = new Scenario();

        console.log();
        console.log(
            scen.toString()
        );
        console.log();
    }
}

class Faction {
    constructor (dimensions) {
        this.name = Covonym.random();

        this.capabilities = {};
        let incompetent = true;

        for (let dim of dimensions) {
            const competence = Util.randomUpTo(1);

            this.capabilities[dim] = competence;

            if (competence >= 1) {
                incompetent = false;
            }
        }

        if (incompetent) {
            // Every faction must be good at something.
            this.capabilities[
                Util.randomOf(dimensions)
            ] = 1;
        }
    }

    toString () {
        let output = this.name;

        for (let capability in this.capabilities) {
            // const competence = this.capabilities[capability];

            const SKILL_PHRASES = [
                false,
                ' - ', //', Skilled at ',
                ', Masters of ',
            ];

            const skillPhrase = SKILL_PHRASES[
                this.capabilities[capability]
            ];

            if (skillPhrase) {
                output += skillPhrase + Util.capitalizedAllWords(capability);
            }
        }

        return output;
    }
}


module.exports = Scenario;

Scenario.run();
