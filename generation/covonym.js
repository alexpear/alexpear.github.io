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
        if (num === 0) {
            // Special case.
            const vacunym = Covonym.consonoids()[0] + Covonym.voweloids()[0];

            return Util.capitalized( vacunym.toLowerCase() );
        }

        const C_COUNT = Covonym.consonoids().length;
        const V_COUNT = Covonym.voweloids().length;
        const PAIR_COUNT = C_COUNT * V_COUNT;

        let name = '';

        while (num > 0) {
            let syll = Covonym.consonoids()[
                num % C_COUNT
            ];

            syll += Covonym.voweloids()[
                Math.floor(num / C_COUNT) % V_COUNT
            ];

            // Util.logDebug({
            //     context: `fromNumber() for() loop middle`,
            //     num,
            //     C_COUNT,
            //     V_COUNT,
            //     PAIR_COUNT,
            //     syll,
            //     consoi: num % C_COUNT,
            //     voweli: Math.floor(num / C_COUNT) % V_COUNT,
            //     nextNum: Math.floor(num / PAIR_COUNT),
            // });

            name += syll;

            num = Math.floor(num / PAIR_COUNT);
        }

        return Util.capitalized(name.toLowerCase());
    }

    static randomDemo () {
        for (let i = 0; i < 40; i++) {
            const num = Util.randomUpTo(1e5);

            const name = Covonym.fromNumber(num);

            console.log(`${name} = ${Util.commaNumber(num)}`);
        }
    }

    static list () {
        for (let n = 0; n <= 10000; n++) {
            console.log(
                `${Covonym.fromNumber(n)} = ${Util.commaNumber(n)}`
            );
        }

        // 389 781
    }

    static run () {
        Covonym.randomDemo();
        // Covonym.list();
    }
}

module.exports = Covonym;

Covonym.run();

