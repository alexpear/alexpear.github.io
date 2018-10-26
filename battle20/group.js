'use strict';

// A group of creatures in a bottle world.
// Instanced in memory.
// Individual creatures (eg dragons, hermits) will still be a Group of 1.
// This is for ecology and procedural narrative simulations based on simplified D&D rules.

const Alignment = require('../dnd/alignment.js');
const Coord = require('../util/coord.js');
const CreatureTemplate = require('./creaturetemplate.js');
const Event = require('./event.js');
const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

class Group {
    constructor (templateName, quantity) {
        templateName = templateName || 'dwarfAxeThrower';
        quantity = quantity || 1;

        this.id = Util.newId();

        this.templateName = templateName;
        this.template = Group.getTemplate(this.templateName);
        this.alignment = new Alignment('NN');

        this.baselineHp = (quantity) * this.getStats().hp;

        // HP is stored as a total to make saving group state in replay and Encounter objs simpler.
        this.totalHp = this.baselineHp;

        // 2d or 3d position in meters.
        // For spaceless simulations (JRPG style), just use a 1x1 grid.
        // Battle.metersPerSquare converts between meters and squares.
        // 1m = Individual / Skirmish = Furniture
        // 10m = Squad = Garage
        // 100m = Platoon / Formation = City Block
        // 1000m = 1km = Battallion / Epic = University Campus
        this.coord = new Coord();

        this.status = undefined;
    }

    getStats () {
        // Later sometimes items or status effects modify the output.
        return this.template;
    }

    getFirstAction () {
        return this.getStats().actions[0];
    }

    getQuantity () {
        const quantity = Math.ceil(
            this.getTotalHp() / this.getStats().hp
        );

        return Math.max(quantity, 0);

        // Later, figure out how to handle effects like 'Buff: +1 HP'.
    }

    getTotalHp () {
        return this.totalHp;
    }

    getWeakestCreatureHp () {
        const maxHp = this.getStats().hp;
        const modulo = this.getTotalHp() % maxHp;
        const creatureHp = modulo || maxHp;
        return Math.max(creatureHp, 0);
    }

    isActive () {
        const INACTIVE_STATUSES = [
            'eliminated',
            'retreated'
        ];

        return this.getQuantity() > 0 &&
            ! INACTIVE_STATUSES.includes(this.status);
    }

    maxDamage () {
        return this.getQuantity() * this.getFirstAction().damage;
    }

    highResRandomDamage (targetGroup) {
        let damage = 0;

        const quantity = this.getQuantity();
        const chance = hitChance(this, targetGroup);

        for (let i = 0; i < quantity; i++) {
            if (Math.random() <= chance) {
                damage += this.getFirstAction().damage;
            }
        }

        Util.log(`high res random damage, quantity: ${ quantity }, chance: ${ chance }, actual damage: ${ damage }`, 'debug');

        return damage;
    }

    takeDamage (n) {
        // TODO: Modify based on damage tags and damage resistance.
        this.totalHp -= n;

        const FLEE_THRESHOLD = 0.3;

        if (this.totalHp <= 0) {
            // Negative HP represents less possibility of recovery from injuries.
            this.status = 'eliminated';
            Util.log(`Group ${ this.toPrettyString() } has been eliminated.`, 'debug');
        }
        else if (this.totalHp <= this.baselineHp * FLEE_THRESHOLD) {
            this.status = 'retreated';
            Util.log(`Group ${ this.toPrettyString() } has retreated.`, 'debug');
        }
    }

    prettyName () {
        return Util.fromCamelCase(this.name || this.templateName);
    }

    toPrettyString () {
        const name = this.prettyName();
        const alignment = this.alignment;
        const statusSuffix = this.status ? ` (${ this.status })` : '';

        // TODO Also mention their most salient items, such as their main weapon.

        return `${ name } (${ alignment }) x${ this.getQuantity() }${ statusSuffix }`;
    }

    toDetailedString () {
        const locationStr = `, location ${ this.coord.toString() }`;
        const idStr = '';  // `, id ${ this.id }`;

        const baseHp = this.getStats().hp;

        const baselineQuantity = Math.ceil(this.baselineHp / baseHp);
        const casualties = baselineQuantity - this.getQuantity();
        const deadRatio = Math.round(casualties / baselineQuantity * 100);

        const casualtiesStr = casualties ?
            `, ${ casualties } casualties (${ deadRatio }%)` :
            '';

        const curHp = this.getWeakestCreatureHp();

        const injuryStr = curHp === baseHp ?
            '' :
            `, individual w/ ${ curHp }/${ baseHp } HP`;

        return `${ this.toPrettyString() }${ locationStr }${ idStr }${ casualtiesStr }${ injuryStr }`;
    }

    static example () {
        const group = new Group('dwarfAxeThrower', 100000);
        group.alignment = 'CG';
        return group;
    }

    static getTemplate (templateName) {
        // This is a mock function. Later, read from the template glossary in the WorldState or WGenerator or Glossary object.
        const exampleGlossary = {
            dwarfAxeThrower: CreatureTemplate.example()
        };

        return exampleGlossary[templateName];
    }

    static test () {
        console.log(`Group.test() \n`);

        const ga = Group.example();
        const gb = new Group('dwarfAxeThrower', 908000);
        gb.alignment = 'LG';

        const gc = new Group('dwarfAxeThrower', 800000);
        gc.alignment = 'LE';

        const gd = Group.example();
        gd.alignment = 'CE';

        // Util.log(mostNumerousFoe([ga, gb, gc]).toPrettyString(), 'debug');

        simpleEncounter([ga, gb, gc, gd], true, 'low');

        // console.log(JSON.stringify(output, undefined, '    '));
        return ga;
    }
}

// TODO: Move all these classes & funcs to battle.js file probably.

function simpleEncounter (groups, random, resolution) {
    sortByRange(groups);

    let step = 0;

    while (multipleAlignments(groups)) {
        Util.log(`Step #${ step }`, 'info');

        for (let attacker of groups) {
            if (! attacker.isActive()) {
                continue;
            }

            const target = mostNumerousFoe(groups, attacker);
            attack(attacker, target);

            if (step % 1 === 0) {
                Util.log('\n' + detailedSummary(groups), 'info');
            }
        }

        step += 1;
    }
}

// In spaceless battles, long-ranged groups get to attack first.
function sortByRange (groups) {
    return groups.sort(
        (a, b) => b.getFirstAction().range - a.getFirstAction().range
    );
}

function prettySummary (groups) {
    return groups.map(
        g => g.toPrettyString()
    )
    .join('\n');
}

function detailedSummary (groups) {
    return groups.map(
        g => g.toDetailedString()
    )
    .join('\n');
}

function someActive (groups) {
    return groups.some(
        g => g.isActive()
    );
}

function factionsActive (groups) {
    const alignments = groups.filter(
        g => g.isActive()
    )
    .map(
        g => g.alignment
    );

    return Util.unique(alignments);
}

function multipleAlignments (groups) {
    return factionsActive(groups).length >= 2;
}

function attack (groupA, groupB, random, resolution) {
    if (! groupA.isActive()) {
        Util.log(`Non-active group cannot attack: ${ groupA.toPrettyString() } (id: ${ groupA.id })`, 'error');
        return;
    }

    const event = attackEvent(groupA, groupB, random, resolution);
    // this.saveEvent(event); // add to Battle replay

    return event;
}

function attackEvent (groupA, groupB, random, resolution) {
    random = Util.default(random, true);
    resolution = Util.default(resolution, 'low');

    const event = new Event(groupA, groupB, 'attack');
    event.addTag(TAG.Action);
    event.addTag(TAG.Attack);
    // Motivation for event tagging: A battle in a airship's gunpowder room
    // where Attacks of type Fire have a % chance of setting off a explosion.

    const aAction = groupA.getFirstAction();
    event.addTag(aAction.tags);

    let damage;

    if (random) {
        if (resolution === 'high' || groupA.getQuantity() <= 5) {
            damage = groupA.highResRandomDamage(groupB);
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
        // Later think about the edge case where this always rounds down to 0 damage, eg in skirmishes.
    }

    Util.log(`${groupA.toPrettyString()} attacks ${groupB.toPrettyString()} for ${damage} damage.`, 'event');

    if (damage) {
        // Later count quantity before & after damage to determine how many deaths happened. Relevant to necromancy.
        groupB.takeDamage(damage);
        event.addTag(TAG.Damage);

        if (! groupB.isActive()) {
            event.addTag(TAG.GroupElimination);
        }

        event.changes[groupB.id] = {
            totalHp: groupB.getTotalHp()
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

    // Util.log(`adjustedDifficulty is ${ adjustedDifficulty }`, 'debug');

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

// This is kindof a rough draft / demo.
function mostNumerousFoe (groups, attacker) {
    attacker = attacker || groups[0]; // Pretend they are in a arbitrary position.

    const foes = groups.filter(
        g => g.alignment !== attacker.alignment &&
            g.isActive()
    );

    return foes.reduce(
        (largest, current) => {
            if (! largest) {
                return current;
            }

            return current.getQuantity() < largest.getQuantity() ?
                largest :
                current;
        },
        undefined
    );
}

module.exports = Group;


// Run.
// Group.test();


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


Sketch of some relationships between classes:
BottleUi
Timeline
WorldState
Battle
Group
WNode (later)


Sketch of a WNode tree that underlies a Group:

Group:
  getQuantity() === 10
  template:
    marine
      components:
        smg
        flakArmor

which comes from a WGenerator output, tree of WNodes:

group
  .quantity: 10  // How to express this in the .txt codex?
  components:
    marine
      components:
        smg
        flakArmor

and i would need to be able to look up 'marine' and 'smg' somewhere and discern their creature and attack stats.
The intuitive place would be more entries in a .txt codex.

* template marineSquad
quantity: 10

* template marine
hp: 2
defense: 11
tags: human soldier tech10 unsc

* template flakArmor
defense: 6
resistances: fire 1, piercing 1
tags: armor

* template smg
tags: bullet fullAuto
range: 20
hit: 3
damage: 1









*/


