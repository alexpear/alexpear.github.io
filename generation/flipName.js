// Randomly generate names that

const Util = require('../util/util.js');

class FlipName {
    static consonoids () {
        return [
            'B',
            'D',
            'F',
            'G',
            'GH',
            // 'H',
            // 'J',
            'K',
            'L',
            'M',
            'MN',
            'N',
            'P',
            'PH',
            'R',
            'S',
            'ST',
            'TS',
            'T',
            'V',
            'W',
            'Z',
        ];
    }

    static complexConsonoids () {
        return [
            'TH',
            'SH',
            'CH',
        ];
    }

    static voweloids () {
        return [
            'A',
            'E',
            'I',
            'O',
            'U',
            // 'Y',
        ];
    }

    static consoSet () {
        const set = [];

        if (Math.random() < 0.1) {
            return [
                Util.randomOf(
                    FlipName.complexConsonoids()
                )
            ];
        }

        const len = 1; // Util.randomOf([1, 2]);
        for (let i = 0; i < len; i++) {
            set.push(
                Util.randomOf(FlipName.consonoids())
            );
        }

        return set;
    }

    static vowelSet () {
        const set = [];

        const len = 1; // Util.randomOf([1, 2]);
        for (let i = 0; i < len; i++) {
            set.push(
                Util.randomOf(FlipName.voweloids())
            );
        }

        return set;
    }

    static wordArray () {
        let array = [];
        let consoNext = true;

        if (Math.random() < 0.5) {
            array = [Util.randomOf(
                FlipName.consonoids()
            )];
            consoNext = false;
        }

        const len = Util.randomRange(6, 10);

        while (array.length < len) {
            const newChars = consoNext ?
                FlipName.consoSet() :
                FlipName.vowelSet();

            array = array.concat(newChars);

            // TODO ending on 2 consos leads to weird flipped start.

            consoNext = !consoNext;
        }

        return array;
    }

    static demo () {
        const wa = FlipName.wordArray();

        const forward = Util.capitalized(
            wa.join('').toLowerCase()
        );

        const backward = Util.capitalized(
            wa.reverse().join('').toLowerCase()
        );

        console.log(`\nI do not serve ${forward}. I serve ${backward}. \n`);
    }

    static run () {
        if (
            process.argv &&
            process.argv[0].endsWith('node') &&
            process.argv[1].endsWith('flipName.js')
        ) {
            FlipName.demo();
        }
    }
}

module.exports = FlipName;

FlipName.run();

