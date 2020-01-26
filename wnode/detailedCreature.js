'use strict';

const Creature = require('./creature.js');
const WNode = require('./wnode.js');

const TraitGrid = require('../bottleWorld/traitGrid.js');

const Util = require('../util/util.js');

module.exports = class DetailedPerson extends Creature {
    constructor (template, coord, alignment) {
        super(template, coord, alignment);
    }

    static example () {
        return DetailedPerson.yaExample();
    }

    // Example from the genre of Young Adult novels.
    static yaExample () {
        const mbti = new WNode('mbti');
        mbti.updateMbti();

        const json = {
            nodeType: 'DetailedPerson',
            personality: TraitGrid.random(),
            components: [
                mbti,
                {
                    templateName: 'duelingSword'
                }
            ]
        };

        // Hmm. How about the constructor style instead?
        const human = new DetailedPerson('human', undefined);

        human.sp = 10;
        human.size = 2;

        return human;
    }
};
