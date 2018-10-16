'use strict';

// A group of creatures in a bottle world.
// Instanced in memory.
// Individual creatures (eg dragons, hermits) will still be a Group of 1.

const Alignment = require('../dnd/alignment.js');
const Event = require('./event.js');
const CreatureTemplate = require('./creaturetemplate.js');
const Location = require('../bottleWorld/location.js');
const Util = require('../util/util.js');

class Group {
    constructor (templateName, quantity) {
        this.id = Util.newId();

        this.templateName = templateName;
        this.template = Group.getTemplate(this.templateName);
        this.weakestCreatureHp = this.template.hp;

        this.quantity = quantity || 1;
        // Alternately, could just store group.totalHp
        // and calculate quantity: group.getQuantity()
        // This would make saving group state in replay and Encounter objs simpler.

        this.location = new Location();

        this.alignment = new Alignment('NN');
    }

    getStats () {
        // Later sometimes items or status effects modify the output.
        return this.template;
    }

    getFirstAction () {
        return this.getStats().actions[0];
    }

    getQuantity () {
        // Later this may change if we use the .totalHp model.
        return this.quantity;
    }

    getTotalHp () {
        return this.template.hp * (this.quantity - 1) + this.weakestCreatureHp;
    }

    maxDamage () {
        return this.getQuantity() * this.getFirstAction().damage;
    }

    prettyName () {
        return Util.fromCamelCase(this.name || this.templateName);
    }

    toPrettyString () {
        const name = this.prettyName();
        const alignment = this.alignment;

        return `${ name } (${ alignment }) x${ this.getQuantity() }`;
    }

    static example () {
        const group = new Group('dwarfAxeThrower', 100);
        group.alignment = 'CG';
        return group;
    }

    static getTemplate (templateName) {
        // This is a mock function. Later, read from the template glossary in the World or Glossary object.
        const exampleGlossary = {
            dwarfAxeThrower: CreatureTemplate.example()
        };

        return exampleGlossary[templateName];
    }

    static test () {
        const ga = Group.example();
        const gb = Group.example();
        gb.alignment = 'LG';

        const output = attack(ga, gb, true, 'low')
            .withoutCircularReferences('pretty');

        console.log(`Group.test() \n`);
        console.log(JSON.stringify(output, undefined, '    '));
        return output;
    }
}

// TODO: Move all these classes & funcs to battle.js file probably.

function attack (groupA, groupB, random, resolution) {
    const event = attackEvent(groupA, groupB, random, resolution);
    // this.saveEvent(event); // add to Battle replay

    // Later, record tags in the Attack Event, etc.
    // Motivation: Battle in a airship's gunpowder room where Attacks of type Fire have a % chance of setting off a explosion.

    // TODO: Update the world state (ie, groupB and/or groupA) based on the event.changes dict.
    // This may add a DEATH tag to the Event.
    // Potentially calculate this stuff inside attackEvent()

    return event;
}

function attackEvent (groupA, groupB, random, resolution) {
    random = Util.default(random, true);

    const event = new Event(groupA, groupB, 'attack');
    const aAction = groupA.getFirstAction();
    let damage = 0;

    if (random) {
        if (resolution === 'high' || groupA.getQuantity() <= 5) {
            const quantity = groupA.getQuantity();
            const chance = hitChance(groupA, groupB);

            Util.log(`high res random branch, quantity: ${ quantity }, chance: ${ chance }`, 'debug');

            for (let i = 0; i < quantity; i++) {
                if (Math.random() <= chance) {
                    damage += aAction.damage;
                }
            }
        }
        else {
            // Low resolution combat simulation.
            const maxDamage = groupA.maxDamage();
            const expectedDamage = maxDamage * hitChance(groupA, groupB);
            damage = randomlyAdjusted(expectedDamage);
        }
    }
    else {
        const maxDamage = groupA.maxDamage();
        damage = Math.round(
            maxDamage * hitChance(groupA, groupB)
        );
        // Later think about the edge case where this rounds down to 0 damage, eg in skirmishes.
    }

    if (damage) {
        const finalHp = Math.max(groupB.getTotalHp() - damage, 0);

        event.changes[groupB.id] = {
            totalHp: finalHp
        };
    }
    else {
        Util.log('damage is: ' + damage, 'debug');
    }

    return event;
}

function rollNeeded (groupA, groupB, cover) {
    cover = cover || 0;

    const attack = groupA.getFirstAction();
    const defense = groupB.getStats().defense;
    const adjustedDifficulty = defense + cover - attack.hit;

    Util.log(`adjustedDifficulty is ${ adjustedDifficulty }`, 'debug');

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

module.exports = Group;


// Run.
Group.test();


/* Notes:

const e = new Encounter();
group1.faction = 'CG';
group2.faction = 'CE';
e.add(group1);
e.add(group2);
const event = e.resolve()

... methodize that as:
const event = Encounter.between(group1, group2);


Dwarf Axe Throwers x100 (CG)
vs
Dwarf Axe Throwers x100 (CE)

Dwarf Axe Throwers x100 (CG) go first
Dwarf Axe Throwers x100 (CG) do 16 damage to Dwarf Axe Throwers x100 (CE).
Dwarf Axe Throwers x100 (CE) takes 8 casualties and there are now 92 left.

*/


