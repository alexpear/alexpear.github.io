'use strict';

const Util = require('../util/util.js');

const Creature = require('../wnode/creature.js');

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

        this.creatures = {};
        this.selectCreatures();
    }

    selectCreatures () {
        while (this.xpAvailable() >= 25) {
            // Util.logDebug(`Top of selectCreatures() loop`);

            const creature = this.randomCreature();

            // TODO make sure we select one of a workable cr.
            const maxAddable = Math.floor(this.xpAvailable() / creature.xp);
            const quantity = Util.randomUpTo(maxAddable - 1) + 1;

            this.addCreature(creature, quantity);
        }
    }

    randomCreature () {
        let crKey = Util.randomOf(Object.keys(DndWarband.monsterManual));

        while (DndWarband.xpForCr(crKey) > this.xpAvailable() && this.xpAvailable() >= 5) {
            // Util.logDebug(`Top of randomCreature() loop`);

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
        const str = Object.keys(this.creatures).map(
            creatureKey => `${creatureKey} x${this.creatures[creatureKey].quantity}`
        )
        .join('\n');

        return '\n' + str;
    }

    // selectCreature () {
    //     return this.randomCreature();
    // }

    addCreature(creatureEntry, quantity) {
        if (this.creatures[creatureEntry.name]) {
            this.creatures[creatureEntry.name].quantity += quantity;
            return;
        }

        this.creatures[creatureEntry.name] = {
            quantity: quantity,
            cr: creatureEntry.cr,
            xp: creatureEntry.xp
        };
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

    difficulty () {
        const xpPerPc = this.xp() / this.pcLevels.length;
        const meanLevel = Util.mean(this.pcLevels);
        // see DMG
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

    static prepareMonsterManual () {
        // Cache some values
        for (let crKey in DndWarband.monsterManual) {
            const crList = DndWarband.monsterManual[crKey];
            const xp = DndWarband.xpForCr(crKey);

            const cr = DndWarband.keyToCr(crKey);

            for (const creatureKey in crList) {
                const creature = crList[creatureKey];
            
                creature.name = creatureKey;
                creature.cr = cr;
                creature.xp = xp;
            }
        }
    }

    static xpForCr (crKey) {
        return {
            0: 5,
            eighth: 25,
            quarter: 50,
            half: 100,
            1: 200,
            2: 450,
            3: 700,
            4: 1100
        }[crKey];
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

DndWarband.monsterManual = {
    0: {
        awakenedShrub: {},
        baboon: {},
        badger: {},
        cat: {},
        commoner: {},
        crab: {},
        deer: {},
        eagle: {},
        goat: {},
        hawk: {},
        homunculus: {},
        hyena: {},
        jackal: {},
        lizard: {},
        owl: {},
        rat: {},
        raven: {},
        scorpion: {},
        spider: {},
        vulture: {},
        weasel: {}
    },
    eighth: {
        bandit: {},
        camel: {},
        cultist: {},
        flumph: {},
        flyingSnake: {},
        giantCrab: {},
        giantRat: {},
        giantWeasel: {},
        guard: {},
        kobold: {},
        mastiff: {},
        noble: {},
        poisonousSnake: {},
        pony: {}
    },
    quarter: {
        acolyte: {},
        boar: {},
        drow: {},
        elk: {},
        giantBadger: {},
        giantCentipede: {},
        giantFrog: {},
        giantLizard: {},
        giantOwl: {},
        goblin: {},
        panther: {},
        pixie: {},
        skeleton: {},
        wolf: {},
        ratSwarm: {},
        ravenSwarm: {},
        zombie: {}
    },
    half: {
        bear: {},
        crocodile: {},
        giantGoat: {},
        giantWasp: {},
        gnoll: {},
        hobgoblin: {},
        lizardfolk: {},
        orc: {},
        satyr: {},
        scout: {},
        shadow: {},
        insectSwarm: {},
        thug: {}
    },
    1: {
        bugbear: {},
        goblinBoss: {},
        giantEagle: {},
        direWolf: {},
        dryad: {},
        hippogriff: {},
        lion: {},
        imp: {},
        spy: {},
        tiger: {}
    },
    2: {
        banditCaptain: {},
        centaur: {},
        berserker: {},
        druid: {},
        cultFanatic: {},
        gargoyle: {},
        giantConstrictorSnake: {},
        ogre: {},
        priest: {},
        rhinoceros: {},
        poisonousSnakeSwarm: {}
    }
}

module.exports = DndWarband;

// Run
DndWarband.run();

