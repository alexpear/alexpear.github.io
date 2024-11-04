'use strict';

// Fictional dieselpunk nations in a secondary world context with 1940s-ish technology.

const Util = require('../util/util.js');

class RegionName {
    static random () {
        let name = '';

        const startsWithConsonant = Math.random() < 0.5;
        if (startsWithConsonant) {
            name += RegionName.randomConso();
        }

        // The suffix is excluded from this syllables count.
        const syllables = Util.randomUpTo(2) + 1;

        for (let s = 0; s < syllables; s++) {
            name += RegionName.randomVowel() + RegionName.randomConso();
        }

        const suffix = Util.randomOf([
            'a',
            'ia',
            'i',

            // Regions
            'land',
            // 'reich',

            // Cities
            'opolis',
            'ograd',
        ]);

        name = Util.capitalized(
            (name + suffix).toLowerCase()
        );

        const hasPrefix = Math.random() < 0.3;

        if (! hasPrefix) {
            return name;
        }

        const prefix = Util.randomOf([
            'New',
            'Nova',
            'North',
            'East',
            'South',
            'West',
            'French',
            'Imperial',
        ]);

        return `${prefix} ${name}`;
    }

    static randomConso () {
        return Util.randomOf([
            'B',
            'D',
            'F',
            'G',
            'H',
            'J',
            'K',
            'L',
            'M',
            'N',
            'P',
            'R',
            'S',
            'T',
            'V',
            'W',
            'Z',
            'SH',
            'ST',
            'SW',
            'TH',
            'CH',
            'FL',
            'PL',
            'KY',
            'NY',
        ]);
    }

    static randomVowel () {
        return Util.randomOf([
            'A',
            'E',
            'I',
            'O',
            'U',
            'AR',
            'ER',
        ]);
    }

    static demo () {
        const name = RegionName.random();

        console.log(name);
    }
}

class Nation {
    constructor () {

    }

    static demo () {
        for (let i = 0; i < 30; i++) {
            RegionName.demo();
        }
    }
}

Nation.demo();



