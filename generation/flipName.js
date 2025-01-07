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
            // 'MN',
            'N',
            'P',
            'PH',
            'R',
            'S',
            'ST',
            // 'TS',
            'T',
            'V',
            'W',
            'Z',
            'TH',
            'SH',
            'CH',
        ];
    }

    // static complexConsonoids () {
    //     return [
    //         'TH',
    //         'SH',
    //         'CH',
    //     ];
    // }

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

        // if (Math.random() < 0.1) {
        //     return [
        //         Util.randomOf(
        //             FlipName.complexConsonoids()
        //         )
        //     ];
        // }

        const len = Util.randomOf([1, 2]);

        const consoList = len > 1 ?
            FlipName.consonoids().filter(c => c.length === 1) :
            FlipName.consonoids();

        for (let i = 0; i < len; i++) {
            set.push(
                Util.randomOf(consoList)
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
        let consoNext = false;

        if (Math.random() < 0.5) {
            array = [Util.randomOf(
                FlipName.consonoids()
            )];
        }

        const len = Util.randomRange(6, 10);

        while (array.length < len) {
            let newChars;

            if (array.length >= len - 2) {
                // Last/first sound.
                newChars = consoNext ?
                    [Util.randomOf(FlipName.consonoids())] :
                    FlipName.vowelSet();
            }
            else {
                newChars = consoNext ?
                    FlipName.consoSet() :
                    FlipName.vowelSet();
            }

            array = array.concat(newChars);

            // debug
            if (FlipName.consonoids().includes(array[0]) &&
                FlipName.consonoids().includes(array[1])) {
                Util.logDebug({
                    array,
                    newChars,
                    consoNext,
                    len,
                });
            }

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

