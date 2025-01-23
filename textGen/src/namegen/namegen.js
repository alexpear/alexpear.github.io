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
        return [
            'A',
            'E',
            'I',
            'O',
            'U',
            'AI',
            'OW',
            'AR',
            'ER',
            'EER',
            'OUR',
            'ANG',
            'ENG',
            'ING',
            'ONG',
        ];
    }

    consonoids () {
        return [
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
            'Y',
            'Z',
            'TS',
            'TH',
            'SH',
            'CH',
            'FL',
            'PL',
            'KY',
            'NY',
        ];
    }

    getVoweloid () {
        return Util.randomOf(this.voweloids());
    }

    getConsonoid () {
        return Util.randomOf(this.consonoids());
    }

    wordArray (phonemeCount) {
        phonemeCount = phonemeCount || Util.randomRange(1, 10);

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
