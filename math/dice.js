/* Simulates dice mechanics.

Game rules
Depending on the version of the game, you have 1d6, 2d6, or 3d6.
You have a level. Generally this starts at the number of dice you have.
Each step, roll your dice. If you roll higher than your level, you fail but increment your level.
We are interested in how many steps it takes to reach max level. 
*/

const Util = require('../util/util.js');

class Scenario {
    constructor (diceCount = 1, startNumber) {
        this.dice = Number(diceCount);
        this.level = Number(
            Util.default(startNumber, this.dice)
        );
    }

    simulate () {
        const maxLevel = 6 * this.dice;
        let steps = 0;

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

        for (let stepCount in stepsDict) {
            const occurrences = stepsDict[stepCount];
            const percentage = ((occurrences / tests) * 100).toFixed(2);

            console.log(`${stepCount} steps happened in ${Util.commaNumber(occurrences)} tests -> ${percentage}%`);
        }
    }

    static run () {
        // node math/dice.js 3 10
        // 3d6, starting at 10 going up
        let diceCount = process.argv[2] || 1;
        let startNumber = process.argv[3] || undefined;

        const stepsDict = {};

        Util.log({
            diceCount,
            startNumber,
        });

        const startTime = Date.now();
        const duration = 10000; // 10 seconds

        while (Date.now() - startTime < duration) {
            const scenario = new Scenario(diceCount, startNumber);
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
