'use strict';

// Output interesting anniversaries for today as text.

// Usage: node anniversary.js

class Anniversary {
    constructor (date = new Date()) {
        const today = date;

        // January => 0, Dec => 11
        this.month = today.getMonth();
        // 1 => 1, 31 => 31
        this.day = today.getDate();
    }

    info () {
        return {
            frenchRevolution: this.frenchRevolution(),
        };
    }

    // Numbered in terms of a leap year.
    // Jan 1 => 0
    // Feb 29 => 59
    // Mar 1 => 60
    // Dec 31 => 365
    dayOfYear () {
        const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        let dayNumber = this.day - 1;

        for (let m = 0; m < this.month; m++) {
            dayNumber += monthDays[m];
        }

        return dayNumber;
    }

    frenchRevolution () {
        const byDayNumber = [
            'jan 1 topic',
            'jan 2 topic',

        ];

        return byDayNumber[ this.dayOfYear() ];
    }

    static test () {
        console.log();

        const gen = new Anniversary();
        // LATER
    }

    static run () {
        return new Anniversary().info();
    }
}

module.exports = Anniversary;

Anniversary.run();
