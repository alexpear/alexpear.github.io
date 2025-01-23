'use strict';

const Util = require('../util/util.js');

class Tenfold {
    static syllables () {
        return [
            'on',
            'di',
            'tre',
            'que',
            'phi',
            'ex',
            'su',
            'av',
            'nor',
            'ko',
        ];
    }

    static allPairs () {
        for (let a of Tenfold.syllables()) {
            for (let b of Tenfold.syllables()) {
                const name = Util.capitalized(a + b);

                console.log(name);
            }
        }
    }

    static randomWord (syllables) {
        let word = '';

        for (let i = 0; i < syllables; i++) {
            word += Util.randomOf(Tenfold.syllables());
        }

        return Util.capitalized(word);
    }

    static randomPerson () {
        return Tenfold.randomWord(4) + ' ' + Tenfold.randomWord(4) + ' ' + Tenfold.randomWord(2);
    }

    static run () {
        Tenfold.allPairs();

        for (let i = 0; i < 40; i++) {
            const output = Tenfold.randomPerson();

            console.log(output);
        }
    }
}

module.exports = Tenfold;

Tenfold.run();

