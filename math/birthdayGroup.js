// Simulates a group of N people & detects whether their birthdays overlap.

const Util = require('../util/util.js');

class BirthdayGroup {
    constructor () {
        this.headcount = 0;
        this.birthdaysOn = [];
        this.uniqueBirthdays = 0;
    }

    // Returns true if there was a birthday collision.
    addPerson () {
        this.headcount++;

        const birthday = Math.ceil(
            Math.random() * 365.24
        );

        const existingCount = this.birthdaysOn[birthday];

        if (existingCount) {
            this.birthdaysOn[birthday] = existingCount + 1;
            return true;
        }
        else {
            this.birthdaysOn[birthday] = 1;
            this.uniqueBirthdays++;
            return false;
        }
    }

    // Fill the group with people until all 365 nonleap days are represented.
    fillNonleaps () {
        for (let i = 0; i < 1e10; i++) {
            const collision = this.addPerson();

            if (! collision && this.allNonleaps()) {
                return;
            }
        }
    }

    // True if all days except Leap Day are represented in this group.
    allNonleaps () {
        if (this.uniqueBirthdays < 365) {
            return false;
        }

        for (let day = 1; day <= 365; day++) {
            if (! this.birthdaysOn[day] >= 1) {
                return false;
            }
        }

        return true;
    }

    // Test how often a given headcount represents all 365 nonleap days.
    static completionRateAtHeadcount (headcount) {
        const TESTS = 1_000_000;
        const LOG_EVERY = Math.ceil(TESTS / 5);
        let successes = 0;

        for (let g = 0; g < TESTS; g++) {
            if (g > 0 && (g % LOG_EVERY === 0)) {
                console.log(`${g} tests completed`);
            }

            const group = new BirthdayGroup();

            for (let p = 1; p <= headcount; p++) {
                const collision = group.addPerson();

                if (! collision && group.allNonleaps()) {
                    // Stop early to save time.
                    successes++;
                    break;
                }
            }
        }

        return successes / TESTS;
    }

    // Research how many people are needed to have all 365 nonleap days represented.
    static researchCompletion () {
        const headcounts = [];

        for (let i = 0; i < 100_000; i++) {
            const group = new BirthdayGroup();

            group.fillNonleaps();

            headcounts.push(group.headcount);
        }

        headcounts.sort();

        console.log(headcounts.join(', '));
        console.log(`median: ${Util.median(headcounts)}`);
    }

    static run () {
        // BirthdayGroup.researchCompletion();

        const headcount = 2290;
        const rate = BirthdayGroup.completionRateAtHeadcount(headcount);
        console.log(`Groups of ${headcount} fill 365 days at rate ${rate}`);
    }
}

module.exports = BirthdayGroup;

BirthdayGroup.run();
