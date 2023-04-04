'use strict';

const Util = require('../util/util.js');

class BionicleName {
    constructor () {
        this.text = Math.random() < 0.5
            ? BionicleName.newDuonym()
            : BionicleName.newMononym();
    }

    toString () {
        return this.text;
    }

    static newMononym () {
        const syllables = Util.randomOf([2, 3]);

        return BionicleName.newWord(syllables);
    }

    static newDuonym () {
        const parts = [];

        for (let i = 0; i < 2; i++) {
            const syllables = Util.randomOf([1, 2, 3]);

            parts.push(BionicleName.newWord(syllables));
        }

        const separator = Math.random() < 0.3
            ? '-'
            : ' ';

        return parts.join(separator);
    }

    static newWord (syllables) {
        // Possible starting consonant.
        let word = Math.random() < 0.5
            ? BionicleName.consonoid()
            : '';

        for (let i = 0; i < syllables; i++) {
            word += BionicleName.voweloid();
            word += BionicleName.consonoid();
        }

        // Possibly end in voweloid
        word = Math.random() < 0.7
            ? word.slice(0, word.length - 1)
            : word;

        return Util.capitalized(word);
    }

    static voweloid () {

        // Dipthong output
        if (Math.random() < 0.2) {
            return Util.randomOf([
                // 'ah',
                'ai',
                'oa',
                'ua',
                'ui',
            ]);
        }

        // else, normal output
        return Util.randomOf([
            'a',
            'e',
            'i',
            'o',
            'u',
        ]);
    }

    static consonoid () {
        return Util.randomOf([
            'b',
            'd',
            'g',
            'h',
            'k',
            'l',
            'm',
            'n',
            'p',
            'r',
            'r',
            's',
            't',
            'v',
        ]);
    }

    static run () {
        const TIMES = 36;
        
        for (let i = 0; i < TIMES; i++) {
            const name = new BionicleName();

            console.log(name.toString());            
        }
    }
}

module.exports = BionicleName;

BionicleName.run();
