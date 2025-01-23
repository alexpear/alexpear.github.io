'use strict';

const TextGen = require('../textGen.js');
const Util = require('../../../util/util.js');

class NameGen extends TextGen {
    toString () {
        return this.text;
    }

    // Called by TextGen.outputHTML()
    output () {
        return this.name();
    }

    voweloids () {
        return {
            // Each phoneme string has a frequency weight.
            'A': 2,
            'E': 2,
            'I': 2,
            'O': 2,
            'U': 2,
            'AI': 1,
            'OW': 1,
            'AR': 1,
            'ER': 1,
            'EER': 1,
            'OUR': 1,
            'ANG': 1,
            'ENG': 1,
            'ING': 1,
            'ONG': 1,
        };
    }

    consonoids () {
        return {
            'B': 2,
            'D': 2,
            'F': 2,
            'G': 1,
            'H': 1,
            'J': 1,
            'K': 2,
            'L': 2,
            'M': 2,
            'N': 2,
            'P': 2,
            'R': 2,
            'S': 2,
            'T': 2,
            'V': 2,
            'W': 1,
            'Y': 1,
            'Z': 1,
            'TS': 1,
            'TH': 2,
            'SH': 2,
            'CH': 2,
            'FL': 1,
            'PL': 1,
            'KY': 1,
            'NY': 1,
        };
    }

    getVoweloid () {
        return this.dict2phoneme(this.voweloids());
    }

    getConsonoid () {
        return this.dict2phoneme(this.consonoids());
    }

    dict2phoneme (dict) {
        const phonemes = [];

        for (let phoneme in dict) {
            for (let i = 0; i < dict[phoneme]; i++) {
                phonemes.push(phoneme);
            }
        }

        return Util.randomOf(phonemes);
    }

    wordArray (phonemeCount) {
        phonemeCount = phonemeCount || Util.randomRange(2, 10);

        const array = Math.random() < 0.5 ?
            [ this.getConsonoid() ] :
            [];

        let vowelNext = true;

        while (array.length < phonemeCount) {
            array.push(
                vowelNext ?
                    this.getVoweloid() :
                    this.getConsonoid()
            );

            vowelNext = ! vowelNext;
        }

        return array;
    }

    name (phonemeCount) {
        return Util.capitalized(
            this.wordArray().join('').toLowerCase()
        );
    }

    demo () {
        console.log(this.output());
    }

    static run () {
        const namer = new NameGen();

        namer.demo();
    }
}

module.exports = NameGen;

NameGen.run();
