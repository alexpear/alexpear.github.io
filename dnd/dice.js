'use strict';

const Util = require('../util/util.js');

const d20 = require('d20');

class Dice {
    static check (dc, modifier) {
        if (! Util.exists(dc)) {
            dc = 15;
        }

        modifier = modifier || 0;

        const roll = d20.roll(20);

        if (roll === 1) {
            return Dice.CriticalFailure;
        }
        else if (roll === 20) {
            return Dice.CriticalSuccess;
        }
        else if ((roll + modifier) >= dc) {
            return Dice.Success;
        }

        return Dice.Failure;
    }

    // Wrapper for d20.roll(), because that cant handle strings like '2d10 + 1d6'.
    static roll (diceString) {
        if (Dice.substringCount('d', diceString) >= 2) {
            // monsters.js has spaces between its '+' symbols.
            const parts = diceString.split('\s');

            // Later take into account the complexity that the different dice listings generally have different damage types.
            return Util.sum(
                parts.map(
                    p => {
                        if (p === '+') {
                            return 0;
                        }

                        if (p.indexOf('d') >= 0) {
                            return d20.roll(p);
                        }

                        return parseFloat(p);
                    }
                )
            );
        }

        // Anything else, the d20 library can hopefully handle.
        return d20.roll(diceString);
    }

    static substringCount (substring, string) {
        return string.split(substring).length - 1;
    }

    static divideAmong (damage, types) {
        const damageByType = {};

        if (types.length === 1) {
            damageByType[types[0]] = damage;
            return damageByType;
        }

        for (const type of types) {
            const portion = Math.ceiling(damage / types.length);

            damageByType[type] = portion;
            damage -= portion;
        }

        // Later remove this test, to gain performance.
        const sum = Util.sum(
            Object.keys(damageByType)
                .map(t => damageByType[t])
        );

        if (sum !== damage) {
            throw new Error(`Expected ${sum} from ${JSON.stringify(damageByType)} to equal ${damage}`);
        }

        return damageByType;
    }
}

Dice.CriticalSuccess = 'criticalSuccess';
Dice.Success = 'success';
Dice.Failure = 'failure';
Dice.CriticalFailure = 'criticalFailure';

module.exports = Dice;

// Dice.test();
