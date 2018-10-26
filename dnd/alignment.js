'use strict';

// similar to alignment.js in hobby/ git repo.
const ALIGNMENTS = {
    LG: {
        lawChaos: -2,
        darkRadiant: 2
    },
    LE: {
        lawChaos: -2,
        darkRadiant: -2
    },
    CE: {
        lawChaos: 2,
        darkRadiant: -2
    },
    CG: {
        lawChaos: 2,
        darkRadiant: 2
    },
    NN: {}
}

class Alignment {
    constructor (abbreviation) {
        this.abbreviation = abbreviation || 'NN';
    }

    getAxisValues () {
        // Later, make this function more robust.
        return ALIGNMENTS[this.abbreviation] || {};
    }

    toString () {
        return this.abbreviation;
    }
}

module.exports = Alignment;
