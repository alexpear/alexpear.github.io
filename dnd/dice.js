'use strict';

const DamageTypes = require('./damageTypes.js');

const Util = require('../util/util.js');

const d20 = require('d20');

class Dice {
    // Advantage: 1 means advantage, 0 or undefined means normal, and -1 means disadvantage
    static check (dc, modifier, advantage) {
        if (! Util.exists(dc)) {
            dc = 15;
        }

        modifier = modifier || 0;

        let roll = d20.roll(20);

        // If positive or negative (ie nonzero)
        if (advantage) {
            const pair = [roll, d20.roll(20)];

            if (advantage > 0) {
                roll = Math.max(pair);
            }
            else {
                roll = Math.min(pair);
            }
        }

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
                            // Util.logDebug(`About to call d20.roll(${p})`);
                            return d20.roll(p);
                        }

                        return parseFloat(p);
                    }
                )
            );
        }

        // Anything else, the d20 library can hopefully handle.
        // Util.logDebug(`About to call d20.roll(${diceString})`);
        return d20.roll(diceString);
    }

    static substringCount (substring, string) {
        return string.split(substring).length - 1;
    }

    static successful (result) {
        if (
            result === Dice.Success ||
            result === Dice.CriticalSuccess
        ) {
            return true;
        }

        return false;
    }

    static abilityModifier (abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }

    static testAbilityModifier () {
        for (let s = 0; s <= 30; s++) {
            console.log(`Ability score ${s}, Modifier ${Dice.abilityModifier(s)}`);
        }
    }

    static divideAmong (damage, types) {
        const damageByType = {};

        if (types.length === 1) {
            damageByType[types[0]] = damage;
            return damageByType;
        }

        let damageLeft = damage;

        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            const splitBetween = types.length - i;

            const portion = Math.ceil(damageLeft / splitBetween);

            damageByType[type] = portion;
            damageLeft -= portion;
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

    static testDivideAmong () {
        let i;

        for (i = 0; i < 10000; i++) {
            for (let j = 0; j < DamageTypes.length; j++) {
                const output = Dice.divideAmong(i, DamageTypes.slice(j));
            }
        }

        Util.logDebug(`Done with testDivideAmong(), tested up to ${i} damage.`);
    }
}

Dice.CriticalSuccess = 'criticalSuccess';
Dice.Success = 'success';
Dice.Failure = 'failure';
Dice.CriticalFailure = 'criticalFailure';

module.exports = Dice;

// Dice.testAbilityModifier();
// Dice.testDivideAmong();
