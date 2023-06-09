'use strict';

const Util = require('../../util/util.js');

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

    static outputHTML () {
        const str = new this().output();

        const BREAK = '<br>';
        const html = str.replaceAll('\n', BREAK);

        return BREAK + html + BREAK + BREAK;
    }

    static run () {
        const gen = new TextGen();
        const output = gen.output();
        console.log(output);
        return output;
    }
}

module.exports = TextGen;

// TextGen.run();

// examples
// class BionicleNameGen extends TextGen {
//   output () {
//
//   }
// }
//
// const gen = new BionicleNameGen();
// const str = gen.output();
