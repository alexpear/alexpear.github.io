'use strict';

// A group of creatures in a bottle world.
// Instanced in memory.
// Individual creatures (eg dragons, hermits) will still be a Group of 1.

const Util = require('../Util.js');
const Template = require('./template.js');

class Group {
    constructor () {

    }

    // Mostly reads from this.template reference,
    // but sometimes items or status effects modify the output.
    getStats () {
        return {};
    }

    maxDamage () {
        return this.getQuantity() * this.getStats().damage;
    }

    static example () {
        const group = new Group();

        group.id = Util.newId();
        group.templateName = 'dwarfAxeThrower';
        group.template = getTemplate(group.templateName);

        group.quantity = 100;
        group.weakestCreatureHp = group.template.hp;
        // Alternately, could just store group.totalHp
        // and calculate quantity: group.getQuantity()
        // This would make saving group state in replay and Encounter objs simpler.

        group.location = new Location();

        return group;
    }

    static getTemplate (templateName) {
            // This is a mock function. Later, read from the template glossary in the World or Glossary object.
        const exampleGlossary = {
            dwarfAxeThrower: Template.example()
        };

        return exampleGlossary[templateName];
    }

    static test () {
        const output = Group.example();
        console.log(`Group.test()`);
        console.log(JSON.stringify(output, undefined, '    '));
        return output;
    }
}

// TODO: Move all these classes & funcs to their own files.
// Location is more relevant to Bottle Worlds than to battle20, which is spaceless.
// This is a bit of a placeholder.
class Location {

}


function attack (groupA, groupB, random, resolution) {
    random = Util.default(random, true);

    const outcome = new ActionOutcome(groupA, groupB, 'attack');

    // This logic can probably go inside ActionOutcome constructor later.
    outcome.actor = groupA;
    outcome.targets = [groupB];
    // These references may or may not be collapsed into id strings during saving later.

    const aStats = groupA.getStats();
    let damage = 0;

    if (random) {
        if (resolution === 'high' || groupA.getQuantity() <= 5) {
            const quantity = groupA.getQuantity();
            const chance = hitChance(groupA, groupB);

            for (let i = 0; i < quantity; i++) {
                if (Math.random() <= hitChance) {
                    damage += aStats.damage;
                }
            }
        }
        else {
            // Low resolution combat simulation.
            const maxDamage = 42;
            const expectedDamage = maxDamage * hitChance(groupA, groupB);
            damage = randomlyAdjusted(expectedDamage);
        }
    }
    else {
        const maxDamage = 42;
        damage = maxDamage * hitChance(groupA, groupB);
    }

    if (damage) {
        const finalHp = max(groupB.totalHp - damage, 0);

        outcome.changes[groupB.id] = {
            totalHp: finalHp
        };
    }

    return outcome;
}

function rollNeeded (groupA, groupB, cover) {
    cover = cover || 0;

    const adjustedDifficulty = groupB.getStats().defense + cover - groupA.getStats().hit;

    if (adjustedDifficulty > 20) {
        // They need a critical success.
        return 20;
    }
    else if (adjustedDifficulty < 2) {
        // They need anything except a critical failure.
        return 2;
    }
    else {
        return adjustedDifficulty;
    }
}

function hitChance (groupA, groupB, cover) {
    const needed = rollNeeded(groupA, groupB, cover);

    return (21 - needed) / 20;
}

function dieRoll () {
    return Math.ceiling(
        Math.random() * 20
    );
}

function randomlyAdjusted (n, variance) {
    return Math.round(
        n * randomFactor(variance)
    );
}

// Used to adjust expected values.
function randomFactor (variance) {
    variance = Util.default(variance, 0.5);

    const minimum = 1 - variance;
    return minimum + (Math.random() * variance * 2);
}


// Run.
Group.test();


/* Notes:

const e = new Encounter();
group1.faction = 'CG';
group2.faction = 'CE';
e.add(group1);
e.add(group2);
const outcome = e.resolve()

... methodize that as:
const outcome = Encounter.between(group1, group2);


Dwarf Axe Throwers x100 (CG)
vs
Dwarf Axe Throwers x100 (CE)

Dwarf Axe Throwers x100 (CG) go first
Dwarf Axe Throwers x100 (CG) do 16 damage to Dwarf Axe Throwers x100 (CE).
Dwarf Axe Throwers x100 (CE) takes 8 casualties and there are now 92 left.

*/

// Part of a Replay
// Maybe name it EncounterSummary
// Basically stores what happened in a dungeon or on a battlefield.
class EncounterOutcome {

    static example () {
        const outcome = new EncounterOutcome();

        // Keys are ids of Groups
        // The numbers are absolute (overwriting) not relative (summing)
        outcome.changes = {
            ncfh387h2fd2843dh: {
                totalHp: 13
            },
            f892hc8714cnf2m3o: {
                buff: 2,
                totalHp: 3
            },
            qc97hgmco8hmg111i: {
                totalHp: 200
            },
            u3145195yu0134tu3: {}  // Some participants were unchanged.
        };

        // Also something about items stolen or picked up, or dropped.

        return outcome;
    }
}

// Or ... name it ActionOutcome and we save one of these for every turn taken inside encounters.
class ActionOutcome {

}


