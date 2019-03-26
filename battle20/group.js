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
    constructor (template, quantity) {
        // TODO am i calling 2 different things 'templates'?
        template = template || 'dwarfAxeThrower';
        quantity = quantity || 1;

        this.id = Util.newId();

        if (Util.isString(template)) {
            this.templateName = template;
            this.template = Group.getTemplate(template);
        } else {
            // Assume it is a template object for now.
            this.templateName = template.templateName;
            this.template = Group.sanitizedTemplate(template);
        }

        this.alignment = this.template.alignment || new Alignment('NN');

        this.baselineHp = quantity * this.getStats().hp;

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

    maxDamage (target) {
        return this.getQuantity() * this.getDamageVs(target);
    }

    // Note that negative resistance (ie, vulnerability) is indeed supported.
    getDamageVs (target) {
        const baseDamage = this.getFirstAction().damage;

        if (! target) {
            return baseDamage;
        }

        const attackTags = [];
        const resistances = target.getStats().resistances;
        let resisted = 0;

        for (let i = 0; i < attackTags.length; i++) {
            const tag = attackTags[i];
            const resistance = resistances[tag];
            if (Util.exists(resistance)) {
                resisted += resistance;
            }
        }

        // Could log.

        return Math.max(baseDamage - resisted, 0)
    }


    // // from hobby/warband/gameState.js:

    // shoot (shootingSquad, targetSquad) {
    //     if (! this.canShoot(shootingSquad, targetSquad)) {
    //         Util.logError('shoot() was called while canShoot() was false');
    //         return;
    //     }

    //     // Later, consider adding 40k restriction about being tempted to choose closest enemy target

    //     const distance = shootingSquad.distanceTo(targetSquad);

    //     // Later, will also need to look at the intervening terrain. Also altitude: hills/towers.
    //     const targetArea = targetSquad.squadArea(
    //         this.terrainAt(targetSquad.coord)
    //     );

    //     this.announceEvent({
    //         type: Event.Types.SHOOT,
    //         shootingSquad: shootingSquad.prettyName(),
    //         targetSquad: targetSquad.prettyName()
    //     });

    //     // Later could rename this func to shots()
    //     const shotSet = shootingSquad.shoot();
    //     let shootingSummary = {
    //         shots: shotSet.length
    //     };

    //     const hits = shotSet.filter(
    //         shot => shot.hits(distance, targetArea)
    //     );

    //     shootingSummary.hits = hits.length;

    //     let outcomes = [];
    //     for (let shot of hits) {
    //         const victim = nextVictim(targetSquad, targetArea);
    //         if (damages(shot, victim)) {
    //             // Later track who the attacker (firer) of the shot was, somehow.
    //             outcomes.push(new Outcome(shot, victim));
    //         }
    //     }

    //     // Just for logging
    //     let injuries = {};
    //     let newCasualties = 0;
    //     for (let outc of outcomes) {
    //         const vid = outc.victim.id;
    //         if (injuries[vid]) {
    //             injuries[vid] += 1;
    //         }
    //         else {
    //             injuries[vid] = 1;
    //             newCasualties += 1;
    //         }
    //     }

    //     shootingSummary.injuries = Object.values(injuries);
    //     shootingSummary.casualties = newCasualties;

    //     Util.logDebug({
    //         context: 'gameState.shoot()',
    //         summary: shootingSummary
    //     });

    //     // Later we will need a way to get a WNode from a id.
    //     for (let outcome of outcomes) {
    //         let victim = outcome.victim;
    //         // Later there will be debuffs possible too.
    //         targetSquad.takeCasualty(victim);
    //     }

    //     // Util.logBeacon({
    //     //     context: 'gameState.shoot()',
    //     //     targetQuantityRemaining: targetSquad.quantity()
    //     // });


    //     // This could become a member of class Squad.
    //     // However, note that it will later also take input about homing and careful aim.
    //     function nextVictim (targetSquad, squadArea) {
    //         squadArea = squadArea || targetSquad.squadArea();

    //         // The shot is assigned to a random victim in the squad.
    //         // Squad members are weighted by their size.
    //         // The assginmentRoll indicates which one is hit.
    //         let assignmentRoll = Math.random() * squadArea;
    //         let victim = targetSquad.components[0];
    //         for (let targetIndividual of targetSquad.components) {
    //             if (targetIndividual.isJunked()) {
    //                 continue;
    //             }

    //             // We use iterative subtraction as a quick way to find which member
    //             // is indicated by the assignmentRoll.
    //             assignmentRoll -= targetIndividual.size;
    //             if (assignmentRoll < 0) {
    //                 victim = targetIndividual;
    //                 break;
    //             }
    //         }

    //         return victim;
    //     }

    //     // This function could be moved later.
    //     function damages (shot, victim) {
    //         // Damage for now means the individual (victim) is converted from a combatant to a casualty.
    //         const damageDiff = shot.damage - victim.durability + getDamageModifier(shot, victim);
    //         const SCALING = 0.5; // To make the probabilities feel right

    //         // quasi sigmoid probability curve between 0 and 1.
    //         const exponentiated = Math.pow(2, SCALING * damageDiff);
    //         const damageChance = exponentiated / (exponentiated + 1);
    //         return Math.random() < damageChance;
    //     }

    //     // Dummy function.
    //     // Later move to Gamestate, Squad, or WNode
    //     function getDamageModifier (shot, victim) {
    //         return 0;
    //     }

    //     /*
    //     Shooting outline
    //     - <trimmed>
    //     - 2 options for how we will do shot distribution
    //       - Sim: Each shot hits a random individual, proportional to its modified size
    //         - Accidental overkill is possible: 2 lethal shots hit the same soldier
    //         - With this, i might have to add rules for a survivor automatically
    //           picking up the flamer after the flamer-carrier is shot.
    //         - What is the computationally quickest way to calc that?
    //         - Tournament array: Set up a array with 1 element per size point per
    //           individual in the target squad.
    //         - Then assign each shot (after rolling if it hits, i think) to a
    //           random individual using this 'weighted array'.
    //         - This is basically spending space to save time.
    //         - This should be cheap, because squads have < 20 individuals
    //           and because the array is garbage collected after each shot pool.
    //         - We could probably optimize that. Basically set up any data structure
    //       - 40k: Each shot hits 1 individual, hitting the least-points ones first
    //         - Leaves the officers and special equipment soldiers last
    //     - Roll for the accuracy of each Shot
    //       - params that increase likelihood it will hit a individual in the target squad:
    //         - .accuracy of the weapon
    //             - Also homing, soldier aim bonuses, etc
    //         - sum ( size of each individual shrunk by cover ) represents the squad's target area
    //       - params that decrease likelihood of a hit
    //         - distance between shooter and target
    //           - Maybe in the same proportions as a circle-arc / radius-area sim, etc
    //       - preferably quasi sigmoid: hitting and missing are always both possible.
    //     - Roll for damage i guess
    //       - For now, each individual is either healthy or a casualty
    //       - Later, individuals can get Damage debuffs such as Limping
    //     - Later, morale rules.
    //       - Maybe the test is taken right before the damaged squad's next activation
    //       - Requires the squad to remember how many casualties it took recently.
    //     */
    // }


    // // from squad.js:

    // squadArea (terrain) {
    //     const effectiveSizes = this.components.map(
    //         component => component.effectiveSize(terrain)
    //     );

    //     return Util.sum(effectiveSizes);
    // }


    // // shot.js:

    // hits (distance, targetArea) {
    //     // SCALING calibrates which accuracy stats are normal.
    //     const SCALING = 200;
    //     const advantage = targetArea * this.accuracy / SCALING;
    //     const shotProbability = advantage / (advantage + distance + 1);

    //     // Util.logDebug({
    //     //     context: `shot.hits()`,
    //     //     distance: distance,
    //     //     targetArea: targetArea,
    //     //     advantage: advantage,
    //     //     distance: distance,
    //     //     shotProbability: shotProbability
    //     // });

    //     return Math.random() < shotProbability;
    // }

    highResRandomDamage (target) {
        let damage = 0;

        const quantity = this.getQuantity();
        const chance = hitChance(this, target);

        for (let i = 0; i < quantity; i++) {
            if (Math.random() <= chance) {
                damage += this.getDamageVs(target);
            }
        }

        Util.log(`high res random damage, quantity: ${ quantity }, chance: ${ chance }, actual damage: ${ damage }`, 'debug');

        return damage;
    }

    takeDamage (n) {
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

    // Returns a copy, sanitized for use as a Battle 20 Group.
    static sanitizedTemplate (template) {
        const copy = template.deepCopy();

        copy.alignment = Util.default(copy.alignment, new Alignment('NN'));
        copy.size = Util.default(copy.size, 1);
        copy.hp = Util.default(copy.hp, 1);
        copy.defense = Util.default(copy.defense, 10);
        copy.actions = Util.default(copy.actions, []);
        copy.tags = Util.default(copy.tags, []);

        return copy;
    }

    static example () {
        // For the Tip of the Spear fish tank battle.
        // Later probably use a codex address, like halo/unsc/simple/marineSquad
        const group = new Group('marineSquad', 12);
        group.alignment = 'LN';
        return group;
    }

    static getTemplate (templateName) {
        // TODO This is a mock function. Later, read from the template glossary in the WorldState or WGenerator or Glossary object.
        // Later, would also be interested in aggregated templates, from nodeTrees.
        const exampleGlossary = {
            dwarfAxeThrower: CreatureTemplate.example(),
            'marineSquad': CreatureTemplate.soldierExample()
        };

        return exampleGlossary[templateName];
    }

    static test () {
        console.log(`Group.test() \n`);

        const ga = Group.example();
        const gb = Group.example();
        gb.alignment = 'LE';

        // Util.log(mostNumerousFoe([ga, gb, gc]).toPrettyString(), 'debug');

        simpleEncounter([ga, gb], true, 'low');

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

// Checks whether the set contains more than 1 alignment.
// Returns boolean
function multipleAlignments (groups) {
    return factionsActive(groups).length >= 2;
}

// TODO: Implement the Flood's reanimation attack against a casualty Group.
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

    // Later: add the outnumbered rule. (Attacker can only use a quantity up to defender.quantity() * 3. Represents only the front of a large army being able to attack a small group.)
    if (random) {
        if (resolution === 'high' || groupA.getQuantity() <= 5) {
            damage = groupA.highResRandomDamage(groupB);
        }
        else {
            // Low resolution combat simulation.
            const maxDamage = groupA.maxDamage(groupB);
            const expectedDamage = maxDamage * hitChance(groupA, groupB);
            damage = randomlyAdjusted(expectedDamage);
        }
    }
    else {
        const maxDamage = groupA.maxDamage(groupB);
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

// TODO I also want a spaceful calculation that cares about distance, for Fish Tank.
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


