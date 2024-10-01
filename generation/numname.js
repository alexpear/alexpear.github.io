// Hashing func that maps numbers to info-dense names 1:1, using alternating consonoid & voweloid phonemes.

const Util = require('../util/util.js');

class Covonym {
    static consonoids () {
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

    static voweloids () {
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

    static fromNumber (num) {
        // if (num === 0) {
        //     // Special case.
        //     return Covonym.voweloids()[0];
        // }

        const C_COUNT = Covonym.consonoids().length;
        const V_COUNT = Covonym.voweloids().length;
        const PAIR_COUNT = C_COUNT * V_COUNT;

        let name = '';

        const syllables = Math.ceil(num / PAIR_COUNT);

        for (let s = 0; s < syllables; s++) {
            name += Covonym.consonoids()[
                num % C_COUNT
            ];

            name += Covonym.voweloids()[
                Math.floor(num / C_COUNT) % V_COUNT
            ];
        }

        return Util.capitalized(name.toLowerCase());
    }

    static randomDemo () {
        const num = Util.randomUpTo(1e9);

        const name = Covonym.fromNumber(num);

        console.log(`${name} = ${Util.commaNumber(num)}`);
    }

    static list () {
        for (let n = 0; n <= 1e3; n++) {
            console.log(
                `${Covonym.fromNumber(n)} = ${Util.commaNumber(n)}`
            );
        }
    }

    static run () {
        Covonym.list();
    }
}

module.exports = Covonym;

Covonym.run();

