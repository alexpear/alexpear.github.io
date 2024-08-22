// A SoccerTime object represents a specific moment within a soccer match.

const Util = require('../../util/util.js');

class SoccerTime {
    constructor (period, seconds) {
        this.period = Util.default(period, 1);
        this.seconds = seconds || 0;
    }

    periodDisplay () {
        const PERIOD_ABBRVS = [
            'Start of Match', // 0
            '1st Half',       // 1
            '2nd Half',       // 2
            'ET1',            // 3 - Extra Time 1
            'ET2',            // 4 - Extra Time 2
            'PKs',            // 5 - Penalty Kicks
            'End of Match',   // 6
        ];

        return PERIOD_ABBRVS[this.period] || 'Other';
    }

    toString () {
        const MINUTES_ELAPSED = [0, 0, 45, 90, 105, 120, 120];

        const minutes = MINUTES_ELAPSED[this.period] + Math.floor(this.seconds / 60);
        const seconds = String(
            this.seconds % 60
        )
        .padStart(2, '0');

        if (this.period === 5) {
            return `120:00 (PK #${seconds})`;
        }

        return `${minutes}:${seconds} (${this.periodDisplay()})`;
    }

    static comparator (a, b) {
        if (a.period !== b.period) {
            return a.period - b.period;
        }

        return a.seconds - b.seconds;
    }

    static test () {
        const goodOrder = [
            new SoccerTime(0, 0),
            new SoccerTime(1, 0),
            new SoccerTime(1, 9),
            new SoccerTime(1, 48 * 60 + 13),
            new SoccerTime(2, 0),
            new SoccerTime(2, 9),
            new SoccerTime(2, 48 * 60 + 13),
            new SoccerTime(3, 0),
            new SoccerTime(3, 9),
            new SoccerTime(3, 19 * 60 + 53),
            new SoccerTime(4, 0),
            new SoccerTime(4, 9),
            new SoccerTime(4, 19 * 60 + 53),
            new SoccerTime(5, 0),
            new SoccerTime(5, 9),
            new SoccerTime(6, 0),
        ];

        const copy = Array.from(goodOrder);
        Util.shuffle(copy);

        copy.sort(SoccerTime.comparator);

        for (let i = 0; i < goodOrder.length; i++) {
            // console.log(goodOrder[i].toString());

            if (goodOrder[i] !== copy[i]) {
                Util.error({
                    context: `SoccerTime sort() failed`,
                    i,
                    goodOrder,
                    copy,
                });
            }
        }
    }
}

SoccerTime.test();
