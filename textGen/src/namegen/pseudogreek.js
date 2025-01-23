'use strict';

const NameGen = require('./namegen.js');
const Util = require('../../../util/util.js');

class Pseudogreek extends NameGen {
    voweloids () {
        return {
            'A': 9,
            'E': 9,
            'I': 9,
            'O': 9,
            'U': 9,
            'Y': 5,
            'AE': 2,
            'AO': 1,
            'AU': 1,
            'EA': 1,
            'EI': 2,
            'EO': 1,
            'EU': 1,
            'IA': 2,
            'IO': 2,
            'OE': 2,
        };
    }

    finalVoweloids () {
        return {
            'A': 9,
            'E': 9,
            'I': 9,
            'O': 9,
            'Y': 1,
            'AE': 5,
            'EA': 4,
            'EI': 4,
            'IA': 5,
            'IO': 3,
            'OE': 2,
        };
    }

    consonoids () {
        return {
            'B': 9,
            // 'C': 9,
            'D': 9,
            'G': 3,
            'H': 1,
            'K': 9,
            'L': 9,
            'M': 9,
            'N': 9,
            'P': 9,
            'R': 9,
            'S': 9,
            'T': 9,
            'X': 9,
            'Z': 2,
            'CH': 9,
            'CL': 2,
            'DR': 1,
            'MN': 2,
            'PH': 9,
            'PL': 2,
            'TH': 9,
            'TR': 1,
        };
    }

    finalConsonoids () {
        return {
            'D': 2,
            'M': 2,
            'N': 2,
            'R': 1,
            'S': 9,
            'T': 1,
            'X': 4,
            'CH': 2,
            'PH': 2,
        };
    }

    wordArray (phonemeCount) {
        phonemeCount = phonemeCount || Util.randomRange(3, 10);

        const array = Math.random() < 0.5 ?
            [ this.getConsonoid() ] :
            [];

        let vowelNext = true;

        while (array.length < phonemeCount) {
            if (array.length < phonemeCount - 1) {

                // First or middle
                array.push(
                    vowelNext ?
                        this.getVoweloid() :
                        this.getConsonoid()
                );

                vowelNext = ! vowelNext;
            }
            else {

                // Last
                array.push(
                    this.dict2phoneme(
                        vowelNext ?
                            this.finalVoweloids() :
                            this.finalConsonoids()
                    )
                );
            }
        }

        return array;
    }

    static run () {
        const pseudo = new Pseudogreek();

        pseudo.demo();
    }
}

module.exports = Pseudogreek;

Pseudogreek.run();
