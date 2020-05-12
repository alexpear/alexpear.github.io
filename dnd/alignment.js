'use strict';

// similar to hobby/genregen/fantasy/planescape/alignment.js

const Util = require('../util/util.js');

// As of 2020 May 11 this class uses a set of 9 string values as a internal data model (basically enum):
const ALIGNMENTS = {
    LG: {
        lawChaos: -2,
        darkRadiant: 2
    },
    LN: {
        lawChaos: -2
    },
    LE: {
        lawChaos: -2,
        darkRadiant: -2
    },
    NE: {
        darkRadiant: -2
    },
    CE: {
        lawChaos: 2,
        darkRadiant: -2
    },
    CN: {
        lawChaos: 2
    },
    CG: {
        lawChaos: 2,
        darkRadiant: 2
    },
    NG: {
        darkRadiant: 2
    },
    NN: {}
};

class Alignment {
    constructor (input) {
        input = input || 'NN';

        if (input && input.length === 2) {
            this.abbreviation = input.toUpperCase();
            return;
        }

        // TODO: I want this constructor to be robust to input like 'chaotic neutral' or 'unaligned' or 'any alignment'.
        if (input === 'unaligned' || input === 'any alignment') {
            this.setRandomly();
            return;
        }

        if (input === 'neutral' || input === 'true neutral') {
            this.abbreviation = 'NN';
            return;
        }

        const words = input.toUpperCase().split(' ');

        if (words.length === 2) {
            this.abbreviation = `${words[0][0]}${words[1][0]}`;
            return;
        }

        throw new Error(`Alignment constructor confused by input: ${input}`);
    }

    getAxisValues () {
        // Later, make this function more robust.
        return ALIGNMENTS[this.abbreviation] || {};
    }

    toString () {
        return this.abbreviation;
    }

    setRandomly () {
        this.abbreviation = Util.randomOf(Object.keys(ALIGNMENTS));
    }

    tolerates (otherAlignment) {
        for (let i = 0; i < this.abbreviation.length; i++) {
            const ourLetter = this.abbreviation[i];
            const theirLetter = otherAlignment.abbreviation[i];

            if (
                ourLetter !== 'N' &&
                theirLetter !== 'N' &&
                ourLetter !== theirLetter
            ) {
                return false;
            }
        }

        return true;
    }

    // Hmm. Do i want the internal data model of this class to be multi-axis, like the hobby/ version?
    // Doesnt seem important for now.
}

module.exports = Alignment;
