'use strict';

// Which letter combinations are rarest in English?

const fs = require('fs');
const WORDS_PATH = '/usr/share/dict/words';
const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class Phonemes extends TextGen {
    constructor () {
        super();

        this.WORDS = fs.readFileSync(
            WORDS_PATH,
            { encoding: 'utf8' }
        )
        .split('\n')
        .filter(
            // Exclude capitalized words.
            word => ! /[A-Z]/.test(word[0])
        );

        // NOTE - Edit these parameters:
        this.MAX_EXAMPLES = 4;

        this.rareSubstrings(2);
    }

    rareSubstrings (len) {
        this.dict = {};

        for (let word of this.WORDS) {
            for (let i = 0; i <= word.length - len; i++) {
                const piece = word.slice(i, i + len)
                    .toUpperCase();

                const examples = this.dict[piece];

                if (examples) {
                    if (examples.length >= this.MAX_EXAMPLES) {
                        continue;
                    }
                    else {
                        examples.push(word);
                    }
                }
                else {
                    this.dict[piece] = [word];
                }
            }
        }
    }

    output () {
        const entries = Object.entries(
            this.dict
        )
        .filter(
            pair => pair[1].length >= 2 &&
                pair[1].length < this.MAX_EXAMPLES
        )
        .sort(
            (a, b) => {
                if (a[1].length !== b[1].length) {
                    return a[1].length - b[1].length
                }

                return a[0].localeCompare(b[0]);
            }
        );

        const summaries = entries.map(
            pair => `${pair[0]} appears in ${pair[1].join(', ')}`
        );

        // console.log(this.dict.GRY);

        return summaries.join('\n');
    }

    static run () {
        console.log(new Phonemes().output());
    }
}

module.exports = Phonemes;

Phonemes.run();
