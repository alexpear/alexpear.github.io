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
        num = Math.floor(num);

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

    // -31.995524679343852, 115.51790132997857
    static fromCoord (northness, eastness) {
        const SCALE = 10_000;

        northness = (Number(northness) + 90) * SCALE;
        eastness = (Number(eastness) + 180) * SCALE;

        const processedNorth = (Math.floor(northness) / SCALE - 90).toFixed(Math.log10(SCALE));
        const processedEast = (Math.floor(eastness) / SCALE - 180).toFixed(Math.log10(SCALE));

        return `${processedNorth}, ${processedEast} is named ${Covonym.fromNumber(northness)} ${Covonym.fromNumber(eastness)}`;
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
    }

    static phoneDemo (phoneNum) {
        for (let i = 0; i < 1; i++) {

            phoneNum = phoneNum || Util.randomUpTo(1e10 - 1);

            const asStr = String(phoneNum).padStart(10, '0');

            const areaCode = asStr.slice(0, 3);
            const trio = asStr.slice(3, 6);
            const quartet = asStr.slice(6);

            // const phoneStr = `(${areaCode}) ${trio}-${quartet}`;

            console.log(`${Covonym.fromNumber(phoneNum)} = (${areaCode}) ${trio}-${quartet}`);
        }
    }

    static timestampDemo () {
        const stamp = Date.now();

        console.log(`\n${Covonym.fromNumber(stamp)} = ${stamp} = now, in Unix time.`);
    }

    static run () {
        // Covonym.list();
        // Covonym.phoneDemo();
        // Covonym.timestampDemo();

        // node covonym.js -31.995524679343852, 115.51790132997857
        if (
            process.argv &&
            process.argv[0].endsWith('node') &&
            process.argv[1].endsWith('covonym.js') &&
            process.argv[2]
        ) {
            console.log(
                Covonym.phoneDemo(process.argv[2])
            );

            // console.log(
            //     `\n` +
            //     // `Location ${process.argv[2]} ${process.argv[3]} is named ` +
            //     Covonym.fromCoord(
            //         process.argv[2].replace(',', '').trim(),
            //         process.argv[3].trim(),
            //     )
            // );
        }
    }
}

module.exports = Covonym;

Covonym.run();

