'use strict';

const Creature = require('./creature.js');
const Thing = require('./thing.js');
const WNode = require('./wnode.js');

const TraitGrid = require('../bottleWorld/traitGrid.js');

const Util = require('../util/util.js');

class DetailedPerson extends Creature {
    constructor (template, coord, alignment) {
        super(template, coord, alignment);
    }

    opinionOf (other) {
        let opinion = this.traitGrid.opinionOf(other.traitGrid);

        if (this.gender === other.gender) {
            opinion += 1;
        }

        return opinion;
    }

    toPrettyString () {
        // Later expand this.
        const name = this.displayName || this.templateName;

        return `${this.traitGrid} ${this.age}-year-old ${this.gender} ${name}`;
    }

    static example () {
        return DetailedPerson.yaExample();
    }

    // Example from the genre of Young Adult novels.
    static yaExample () {
        const human = new DetailedPerson('human');

        const mbti = new WNode('mbti');
        mbti.updateMbti();

        human.add(mbti);
        human.add(new Thing('duelingSword'));

        // TODO move these into the constructor
        human.traitGrid = TraitGrid.random();

        const roll = Math.random();
        if (roll < 0.45) {
            human.gender = 'female';
        }
        else if (roll < 0.9) {
            human.gender = 'male';
        }
        else {
            human.gender = 'androgynous';
        }

        human.age = Util.randomIntBetween(5, 120);

        // LATER these should be on the template instead, not the WNode.
        human.sp = 10;
        human.size = 2;

        return human;
    }

    static test () {
        const ally = DetailedPerson.yaExample();
        const a = ally.toPrettyString();
        const stranger = DetailedPerson.yaExample();
        const s = stranger.toPrettyString();

        Util.log([
            `I am a ${a}.`,
            `My opinion of them is: ${ally.opinionOf(stranger)}.`,
            `They are a ${s}.`,
            `Their opinion of me is: ${stranger.opinionOf(ally)}.`
        ].join('\n'));
    }
};

module.exports = DetailedPerson;

// DetailedPerson.test();
