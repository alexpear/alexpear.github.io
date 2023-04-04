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

    // Outputs a set of 6 names
    static team () {
        const output = [];

        const teamSyllables = Util.randomOf([1, 2, 3]);
        const teamWord = BionicleName.newWord(teamSyllables);

        const uniqueFirst = Math.random() < 0.5;

        for (let i = 0; i < 6; i++) {
            const individualSyllables = Util.randomOf([1, 2, 3]);
            const individualWord = BionicleName.newWord(individualSyllables);

            const pair = uniqueFirst
                ? (individualWord + ' ' + teamWord)
                : (teamWord + ' ' + individualWord);

            output.push(pair);
        }

        // console.log(output);

        return output;
    }

    static demo () {
        return Math.random() < 0.3
            ? BionicleName.team().join('\n')
            : new BionicleName().toString();
    }

    static run () {
        const TIMES = 1;
        
        for (let i = 0; i < TIMES; i++) {
            // const name = new BionicleName();

            console.log(BionicleName.demo());            
        }
    }
}

module.exports = BionicleName;

BionicleName.run();
