'use strict';

const Yaml = require('js-yaml');

const Alignment = require('../dnd/alignment.js');
const DamageTypes = require('../dnd/damageTypes.js');
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
            // Util.logDebug(`top of selectCreaturesByCr() loop. this.creatures.length is ${this.creatures.length}. this.crAvailable() is ${this.crAvailable()}`)

            const creatureEntry = this.randomCreatureByCr();

            const cr = creatureEntry.cr || DndWarband.EPSILON;
            const maxAddable = Math.floor(this.crAvailable() / cr);

            const quantity = Util.randomUpTo(maxAddable - 1) + 1;

            this.addCreature(creatureEntry, quantity);

            // Util.logDebug(`Bottom of selectCreaturesByCr() loop. this.creatures.length is ${this.creatures.length}. this.crAvailable() is ${this.crAvailable()}`);
        }

        // Util.logDebug(`Bottom of selectCreaturesByCr() overall. this.creatures.length is ${this.creatures.length}. this.crAvailable() is ${this.crAvailable()}`);
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
        const summary = {};

        for (const c of this.creatures) {
            const name = c.templateName();

            if (summary[name]) {
                summary[name].quantity += 1;
            }
            else {
                summary[name] = {
                    cr: c.getCr(),
                    quantity: 1,
                    name: name
                };
            }
        }

        const lines = [];

        for (const name in summary) {
            lines.push(summary[name]);
        }

        const str = lines.sort(
            (a, b) => {
                const diff = b.cr - a.cr;

                return diff === 0 ?
                    a.quantity - b.quantity :
                    diff;
            }
        )
        .map(
            row => `CR ${this.fractionalCr(row.cr)}\t${row.quantity}x ${row.name}`
        )
        .join('\n');

        // Util.logDebug(`this.creatures.length is ${this.creatures.length}. summary has ${Object.keys(summary).length} keys. lines.length is ${lines.length}`)

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

        // Later update this to expect creatures to be array, not obj.
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

        for (const creature of this.creatures) {
            if (! creature.active()) {
                continue;
            }

            total += creature.getCr() || DndWarband.EPSILON;
        }

        // Util.logDebug(`in totalCr(), returning ${total}`)

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

    static namesByFaction () {
        const alignments = {};

        for (const entry of Monsters) {
            // Later decide how to deal with 'any alignment', etc
            if (! alignments[entry.alignment]) {
                alignments[entry.alignment] = {};
            }

            if (! alignments[entry.alignment][entry.type]) {
                alignments[entry.alignment][entry.type] = [];
            }

            alignments[entry.alignment][entry.type].push(entry.name);
        }

        return alignments;
    }

    static allAlignmentStrings () {
        const alignments = {};

        for (const entry of Monsters) {
            if (! alignments[entry.alignment]) {
                alignments[entry.alignment] = true;
            }
        }

        return Object.keys(alignments).sort();
    }

    static prepareMonsterManual () {
        const manual = DndWarband.monsterManual = {};

        for (const entry of Monsters) {
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

        DndWarband.parseDamageTypes();

        // DndWarband.printJson(DndWarband.monsterManual);
        // DndWarband.printJson(Monsters);
    }

    static parseDamageTypes () {
        const types = Object.keys(DamageTypes);

        for (const entry of Monsters) {
            // Util.logDebug(`In parseDamageTypes(), looking at ${entry.name}`);

            if (! entry.actions) {
                continue;
            }

            for (const action of entry.actions) {
                if (! action.damage_dice && ! action.damage_bonus) {
                    continue;
                }

                action.damage_types = [];

                const phrases = action.desc.split(' damage');

                // All but last
                for (let t = 0; t < types.length; t++) {
                    for (let p = 0; p < phrases.length - 1; p++) {
                        // Util.logDebug(`Comparing ${phrases[p]} to ${types[t]}`)

                        if (phrases[p].endsWith(types[t])) {
                            action.damage_types.push(types[t]);
                            break;
                            // Note that 'as much damage' does appear in descriptions, which is not referring to a type.
                        }
                    }
                }
            }
        }

        // No return, just side effects.
    }

    static printJson (obj) {
        Util.logDebug(
            // 2 spaces to match existing indentation of monsters.js
            JSON.stringify(obj, undefined, '  ')
        );
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
        console.log(`DndWarband.test(): \n`);

        const warband = new DndWarband({
            pcLevels: [20, 20, 20, 20, 20, 20]
        });

        // Util.logDebug(warband.toPrettyString());

        Util.logDebug(
            '\n' + 
            Yaml.dump(
                DndWarband.namesByFaction()
            )
        );

        return warband;
    }
}

DndWarband.EPSILON = 0.03;

module.exports = DndWarband;

// Run
// DndWarband.run();
DndWarband.test();

// TODO make class and func: DndWorldState.battle(warbandA, warbandB);


