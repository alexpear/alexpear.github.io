'use strict';

const Util = require('../util/util.js');

class TextGen {
    substrings () {
        return [
            '☰',
            '☱',
            '☲',
            '☳',
            '☴',
            '☵',
            '☶',
            '☷',
        ];
    }

    output () {
        const parts = [];

        const PARTCOUNT = 2;
        for (let i = 0; i < PARTCOUNT; i++) {
            parts.push(
                Util.randomOf(
                    this.substrings()
                )
            );
        }

        return parts.join(' ');
    }

    static run () {
        const gen = new TextGen();
        return gen.output();
    }
}

module.exports = TextGen;

// examples
// class BionicleNameGen extends TextGen {
//   output () {

//   }
// }

// const gen = new BionicleNameGen();
// const str = gen.output();
