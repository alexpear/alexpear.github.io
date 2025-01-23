'use strict';

const NameGen = require('./namegen.js');
const Util = require('../../../util/util.js');

class Pseudogreek extends NameGen {
    voweloids () {
        return {
            'A': 2,
            'E': 2,
            'I': 2,
            'O': 2,
            'U': 2,
            'Y': 1,
            'AE': 1,
            'AO': 1,
            'EA': 1,
            'EI': 1,
            'EO': 1,
            'EU': 1,
            'IA': 1,
            'IO': 1,
        };
    }

    consonoids () {
        return {
            'B': 2,
            // 'C': 2,
            'D': 2,
            'G': 1,
            'H': 1,
            'K': 2,
            'L': 2,
            'M': 2,
            'N': 2,
            'P': 2,
            'R': 2,
            'S': 2,
            'T': 2,
            'X': 2,
            'Z': 1,
            'CH': 2,
            'CL': 1,
            'DR': 1,
            'PH': 2,
            'PL': 1,
            'TH': 2,
            'TR': 1,
        };
    }

    finalConsonoids () {
        return {
            'D': 1,
            'M': 1,
            'N': 1,
            'R': 1,
            'S': 3,
            'T': 1,
            'X': 2,
            'CH': 1,
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
                    vowelNext ?
                        this.getVoweloid() :
                        this.dict2phoneme(
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
