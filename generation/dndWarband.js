'use strict';

const DndCreature = require('../dnd/dndCreature.js');
const Monsters = require('../dnd/monsters.js');

const Util = require('../util/util.js');

class DndWarband {
    constructor (options) {
        options = options || {};

        DndWarband.prepareMonsterManual();

        this.pcLevels = options.pcLevels || [1, 1, 1, 1, 1];
        // Difficulty approximation numbers:
        // 0.5 approximates Easy
        //  1  approximates Medium
        // 1.5 approximates Hard
        //  2  approximates Deadly
        this.desiredDifficulty = options.difficulty || 1; // Medium, a la DMG 5e

        // TODO i also want to store a array of DndCreatures. Replace the .creatures obj with a more specific, live-hitpoints array of DndCreature.
        this.creatures = [];
        this.selectCreaturesByCr();
    }

    selectCreaturesByXp () {
        while (this.xpAvailable() >= 25) {
            const creature = this.randomCreatureByXp();

            const maxAddable = Math.floor(this.xpAvailable() / creature.xp);
            const quantity = Util.randomUpTo(maxAddable - 1) + 1;

            this.addCreature(creature, quantity);
        }
    }

    randomCreatureByXp () {
        let crKey = Util.randomOf(Object.keys(DndWarband.monsterManual));

        while (DndWarband.xpForCr(crKey) > this.xpAvailable() && this.xpAvailable() >= 5) {
            // Util.logDebug(`Top of randomCreatureByXp() loop`);

            crKey = Util.randomOf(Object.keys(DndWarband.monsterManual));
        }

        const crObj = DndWarband.monsterManual[crKey];

        const creatureKey = Util.randomOf(Object.keys(crObj));
        return crObj[creatureKey];
    }

    selectCreaturesByCr () {
        while (this.crAvailable() >= 0.125) {
            const creature = this.randomCreatureByCr();

            const cr = creature.cr || DndWarband.EPSILON;
            const maxAddable = Math.floor(this.crAvailable() / cr);

            const quantity = Util.randomUpTo(maxAddable - 1) + 1;

            this.addCreature(creature, quantity);
        }
    }

    randomCreatureByCr () {
        let crKey = Util.randomOf(Object.keys(DndWarband.monsterManual));

        while (DndWarband.keyToCr(crKey) > this.crAvailable() && this.crAvailable() >= DndWarband.EPSILON) {
            crKey = Util.randomOf(Object.keys(DndWarband.monsterManual));
        }

        const crObj = DndWarband.monsterManual[crKey];

        const creatureKey = Util.randomOf(Object.keys(crObj));
        return crObj[creatureKey];
    }


    toString () {
        return JSON.stringify(this, undefined, '    ');
    }

    toPrettyString () {
        const creatures = Object.keys(
            this.creatures
        ).map(
            key => this.creatures[key]
        ).sort(
            (a, b) => a.quantity - b.quantity
        );

        const str = creatures.map(
            // c => `${c.name} x${c.quantity}\t\tCR ${this.fractionalCr(c.cr)}`
            c => `CR ${this.fractionalCr(c.cr)}\t${c.quantity}x ${c.name}`
        ).join('\n');

        return '\n' + str;
    }

    fractionalCr (cr) {
        if (cr === 0.125) {
            return '1/8';
        }
        else if (cr === 0.25) {
            return '1/4';
        }
        else if (cr === 0.5) {
            return '1/2';
        }

        return cr;
    }

    addCreature(creatureEntry, quantity) {
        const camelName = Util.toCamelCase(creatureEntry.name);

        for (let i = 0; i < quantity; i++) {
            this.creatures.push(new DndCreature(creatureEntry));
        }
    }


    xp () {
        let xpSoFar = 0;

        for (let creatureKey in this.creatures) {
            const creature = this.creatures[creatureKey];
            xpSoFar += creature.xp * creature.quantity;
        }

        return xpSoFar;
    }

    xpAvailable () {
        return this.maxXp() - this.xp();
    }

    maxXp () {
        return Util.sum(
            this.pcLevels.map(
                // This approximation returns too-low numbers for high levels and difficulties
                pcLevel => 50 * pcLevel * this.desiredDifficulty
            )
        );
    }

    crAvailable () {
        // Util.logDebug(`In crAvailable(). maxCr() is ${this.maxCr()}. totalCr() is ${this.totalCr()}.`)
        return this.maxCr() - this.totalCr();
    }

    totalCr () {
        let total = 0;

        for (let species in this.creatures) {
            const creature = this.creatures[species];

            if (creature.cr === 0) {
                total += DndWarband.EPSILON * creature.quantity;
                continue;
            }

            total += creature.cr * creature.quantity;
        }

        return total;
    }

    maxCr () {
        return Util.sum(
            this.pcLevels.map(
                // This approximation returns too-low numbers for high levels and difficulties
                pcLevel => 0.25 * pcLevel * this.desiredDifficulty
            )
        );
    }

    difficulty () {
        const xpPerPc = this.xp() / this.pcLevels.length;
        const meanLevel = Util.mean(this.pcLevels);
        // see DMG, complete later.
    }

    // Convert to number by replacing 'half' with 0.5, etc
    static keyToCr (crKey) {
        const keyToCr = {
            eighth: 0.125,
            quarter: 0.25,
            half: 0.5
        };

        return keyToCr[crKey] || crKey;
    }

    static crToKey (crNumber) {
        if (crNumber === 0.125) {
            return 'eighth';
        }
        else if (crNumber === 0.25) {
            return 'quarter';
        }
        else if (crNumber === 0.5) {
            return 'half';
        }
        else {
            // Util.logDebug(`${crNumber} in crToKey()`)
            return crNumber;
        }
    }

    static prepareMonsterManual () {
        const manual = DndWarband.monsterManual = {};

        for (let entry of Monsters) {
            const crKey = DndWarband.crToKey(entry.challenge_rating);

            if (! manual[crKey]) {
                manual[crKey] = {};
            }

            const name = Util.toCamelCase(entry.name);
            
            // Duplicating for legacy support. Can clean up later.
            entry.cr = entry.challenge_rating;
            entry.xp = DndWarband.xpForCr(crKey);

            if (! Util.exists(entry.xp)) {
                Util.logDebug(`entry.xp is ${entry.xp} in prepareMonsterManual(). entry.challenge_rating is ${entry.challenge_rating}`)
            }

            manual[crKey][name] = entry;
        }
    }

    static xpForCr (crKey) {
        const xp = {
            0: 5,
            eighth: 25,
            quarter: 50,
            half: 100,
            1: 200,
            2: 450,
            3: 700,
            4: 1100,
            5: 1800,
            6: 2300,
            7: 2900,
            8: 3900,
            9: 5000,
            10: 5900,
            11: 7200,
            12: 8400,
            13: 10000,
            14: 11500,
            15: 13000,
            16: 15000,
            17: 18000,
            18: 20000,
            19: 22000,
            20: 25000,
            21: 33000,
            22: 41000,
            23: 50000,
            24: 62000,
            30: 155000
        }[crKey];

        if (xp === undefined) {
            throw new Error(`Unsure what XP to assign to this CR`);
        }

        return xp;
    }

    static example () {
        const warband = new DndWarband();

        // Later overwrite this.creatures obj.

        return warband;
    }

    static run () {
        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('dndWarband.js') ||
            ! process.argv[2].startsWith('test')) {
            // The following logic is for command-line use only.
            return;
        }

        DndWarband.test();
    }

    static test () {
        console.log(`DndWarband.test(): \n\n`);

        const warband = new DndWarband();

        Util.logDebug(warband.toPrettyString());

        return warband;
    }
}

DndWarband.EPSILON = 0.03;

module.exports = DndWarband;

// Run
DndWarband.run();

