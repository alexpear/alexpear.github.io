/* Simulates dice mechanics.

Game rules
Depending on the version of the game, you have 1d6, 2d6, or 3d6.
You have a level. Generally this starts at the number of dice you have.
Each step, roll your dice. If you roll higher than your level, you fail but increment your level.
We are interested in how many steps it takes to reach max level. 
*/

const Util = require('../util/util.js');

class Scenario {
    constructor (diceCount = 1, inputLevel, descend = false) {
        this.dice = Number(diceCount);
        this.inputLevel = inputLevel ?
            Number(inputLevel) :
            undefined;

        this.descend = descend;
    }

    simulate () {
        return this.descend ?
            this.simulateDecay() :
            this.simulateGrowth();
    }

    // Bug - hangs
    simulateDecay () {
        let steps = 0;
        this.level = this.inputLevel;
        const minLevel = this.dice; // All dice showing 1.

        while (this.level > minLevel) {
            steps += 1;

            const roll = Util.rollXdY(this.dice, 6);

            // TODO also if roll === maxRoll, and for Growth() too.
            if (roll > this.level) {
                this.level -= 1;
            }
        }

        return steps;
    }

    simulateGrowth () {
        let steps = 0;
        this.level = this.dice; // All dice are set to 1.
        const maxLevel = this.inputLevel || (6 * this.dice);

        while (this.level < maxLevel) {
            steps += 1;

            const roll = Util.rollXdY(this.dice, 6);

            if (roll > this.level) {
                this.level += 1;
            }
        }

        return steps;
    }

    static printHistogram (stepsDict) {
        const tests = Util.sum(Object.values(stepsDict));

        for (const stepCount in stepsDict) {
            const occurrences = stepsDict[stepCount];
            const percentage = ((occurrences / tests) * 100).toFixed(2);

            console.log(`${stepCount} steps happened in ${Util.commaNumber(occurrences)} tests -> ${percentage}%`);
        }
    }

    static run () {
        // usage
        // node math/dice.js 3 14
        // 3d6, stop at level 14

        // node math/dice.js 3 14 down
        // 3d6, go down from level 14 to minimum

        const diceCount = process.argv[2] || 1;
        const inputLevel = process.argv[3] || undefined;
        const descend = process.argv[4] || false;

        const stepsDict = {};

        Util.log({
            diceCount,
            inputLevel,
        });

        const startTime = Date.now();
        const duration = 10000; // 10 seconds

        while (Date.now() - startTime < duration) {
            const scenario = new Scenario(diceCount, inputLevel, descend);
            const steps = scenario.simulate();

            if (stepsDict[steps]) {
                stepsDict[steps] += 1;
            }
            else {
                stepsDict[steps] = 1;
            }
        }

        Scenario.printHistogram(stepsDict);
    }
}

module.exports = Scenario;

Scenario.run();
