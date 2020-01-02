'use strict';

// Represents the world in a Bottle World at one moment.

const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');
const ActionReadyEvent = require('./events/actionReadyEvent.js');
const CreatureTemplate = require('../battle20/creaturetemplate.js');
const Group = require('../battle20/group.js');
const BEvent = require('../bottleWorld/bEvent.js');
const TAG = require('../codices/tags.js');
const Alignment = require('../dnd/alignment.js');
const WGenerator = require('../generation/wgenerator.js');
const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Creature = require('../wnode/creature.js');
const Thing = require('../wnode/thing.js');
const WNode = require('../wnode/wnode.js');

const Yaml = require('js-yaml');

class WorldState {
    constructor (timeline, t) {
        this.timeline = timeline;
        this.t = t || 0;
        // TODO make this a obj, keyed by thing.id, for performance
        // TODO rename to .wnodes, because Group does not extend Thing
        // or alternately make Thing.sp into a getter, which Group can override. Group can then extend Thing or Creature
        this.things = [];

        // Later, probably template lookups should be looking across all generators.
        this.wanderingGenerator = WGenerator.generators['halo/unsc/individual'];

        // Contrary to a popular misconception, the W in WGenerator does not stand for Wandering.
        // It stands for WAFFLE.
        this.glossary = this.wanderingGenerator.glossary;
    }

    // Could also name this t(), after the physics notation, or timestamp() or time()
    // Gotcha: JS does not support a obj having a field and a method with the same name.
    now () {
        return this.t;
    }

    fromId (id) {
        const thingWithId = this.things.find(
            thing => thing.id === id
        );

        if (thingWithId) {
            return thingWithId;
        }

        const fromGenerator = WGenerator.ids[id];

        if (fromGenerator) {
            return fromGenerator;
        }

        // TODO Uncertain about this. Maybe fall back to generateNodes() instead.
        return this.getTemplate(id);
    }

    // I currently plan for Thing to extend WNode
    thingsAt (coord) {
        return this.things.filter(
            t => t.coord && t.coord.equals(coord)
        );
    }

    thingsWith (criteria, shouldFlip, things) {
        shouldFlip = shouldFlip || false;
        things = things || this.things;

        const props = Object.keys(criteria);

        return things.filter(
            thing => {
                if (! thing.active) {
                    return false;
                }

                for (let i = 0; i < props.length; i++) {
                    const prop = props[i];

                    if (! shouldFlip) {
                        // In the normal mode, criteria describes a set of mandatory traits.
                        if (thing[prop] != criteria[prop]) {
                            return false;
                        }
                    }
                    else {
                        // In the flipped mode, criteria describes a set of undesirable traits.
                        if (thing[prop] == criteria[prop]) {
                            return false;
                        }
                    }
                }

                return true;
            }
        );
    }

    thingsWithout (criteria) {
        return this.thingsWith(criteria, true);
    }

    activeThings (things) {
        things = things || this.things;

        return this.thingsWith({}, false, things);
    }

    addThing (thing, coord) {
        thing.coord = coord || new Coord();
        this.things.push(thing);
    }

    // Probably deprecated and removable
    randomTrees () {
        return this.generateNodes();
    }

    // Returns WNode[], or array of various subclasses of WNode
    generateNodes (path) {
        return this.wanderingGenerator.getOutputs(path);
    }

    groupFromTree (nodeTree) {
        const groupTemplate = this.getTemplate(nodeTree.templateName);
        const quantity = groupTemplate.quantity;

        // Later, make this more robust.
        const individualTree = nodeTree.components[0];
        const individualTemplateName = individualTree.templateName;
        const individualTemplate = this.getTemplate(individualTemplateName);

        const combinedTemplate = this.getAggregatedTemplate(nodeTree);

        const group = new Group(combinedTemplate, quantity);
        group.nodeTree = nodeTree;

        return group;
    }

    // Returns a parsed template obj
    getTemplate (inputString) {
        // TODO still working out the kinks of this version.

        const localTemplate = this.wanderingGenerator.glossary[inputString];

        if (localTemplate) {
            return localTemplate;
        }

        const fullPath = this.wanderingGenerator.getAbsolutePath(inputString);
        // Util.logDebug(`In worldState.getTemplate('${inputString}'), fullPath is ${fullPath}.`);

        const listing = WGenerator.findGenAndTable(fullPath);

        Util.logDebug(`In worldState.getTemplate('${inputString}'), listing.gen.codexPath is ${listing.gen.codexPath}. listing.name is ${listing.name}. listing.gen is the following:`);
        Util.logDebug(listing.gen.toJson());

        const template = listing.gen.glossary[listing.name];

        // Util.logDebug(`In worldState.getTemplate('${inputString}'), template is the following:`);
        // Util.logDebug(template);

        return template;
    }

    // Get templates of all component nodes recursively
    // Apply the properties of all those templates, as modifiers.
    getAggregatedTemplate (wnode) {
        const template = this.getTemplate(wnode.templateName);

        if (wnode.components.length === 0) {
            return template;
        }

        return wnode.components.reduce(
            (aggregated, component) => {
                const contribution = this.getAggregatedTemplate(component);

                return aggregated.combinedWith(contribution);
            },
            template
        );
    }

    fromTemplateName (templateName) {
        const template = this.getTemplate(templateName);

        Util.logDebug(`The following is the value of local var 'template' inside a call to WorldState.fromTemplateName('${templateName}'):`);
        Util.logDebug(template);

        return template.constructor.name === 'CreatureTemplate' ?
            new Creature(template) :
            new Thing(template);
    }

    resolveEvent (bEvent) {
        return bEvent.resolve(this);
    }

    addThingsByAlignment (newcomers, contextPath) {
        Object.keys(newcomers).forEach(alignment => {
            const teammates = newcomers[alignment];

            Object.keys(teammates).forEach(templateName => {
                for (let i = 0; i < teammates[templateName]; i++) {
                    this.timeline.addEvent(
                        new ArrivalEvent(contextPath + '/' + templateName, undefined, alignment)
                    );
                }
            })
        });
    }

    thingString () {
        return this.things.filter(
            t => t.active
        ).map(
            t => `\n    ${Util.capitalized(t.toAlignmentString())}`
        )
        .join('') || `\n    Only the tireless void`;
    }

    printThings () {
        const output = `At t=${ this.now() }, this world contains: ${ this.thingString() }\n    (${this.alignmentCensusString()})`;

        Util.log(output, 'info');
    }

    printCensus () {
        const output = `At t=${ this.now() }, this world contains:\n${this.templateCensusString()}`;

        Util.log(output, 'info');
    }

    // Debug helper func.
    glossaryTypesString () {
        return Object.keys(
            this.glossary
        )
        .map(
            templateName => this.glossary[templateName].constructor.name
        )
        .join(', ');
    }

    // Debug helper func.
    thingTypesString () {
        return this.things
            .map(
                thing => thing.constructor.name
            )
            .join(', ');
    }

    // This is a slightly hacky workaround for a circular dependency between ActionEvent and ActionReadyEvent
    setUpNextAction (protagonist, actionTemplate, actionEvent) {
        const actionReady = new ActionReadyEvent(protagonist, actionEvent.actionId);

        actionEvent.addOutcome(
            actionReady,
            this,
            actionEvent.t + actionTemplate.secondsUntilNextAction()
        );
    }

    // returns a dict<Thing[]>
    // {
    //     'foo': [a, b, c],
    //     'bar': [d, e, f]
    // }
    dictByProp (prop, things) {
        things = things || this.things;

        const dict = {};

        things.forEach(
            thing => {
                const value = thing[prop];

                if (dict[value]) {
                    dict[value].push(thing);
                }
                else {
                    dict[value] = [thing];
                }
            }
        );

        return dict;
    }

    // Example:
    // {
        // LG: {
        //     dragon: {
        //         total: 7,
        //         active: 1
        //     },
        //     human: {
        //         total: 1000000,
        //         active: 800000
        //     }
        // },
        // LE: {
        //     dragon: {
        //         total: 7,
        //         active: 0
        //     },
        //     human: {
        //         total: 100000,
        //         active: 70000
        //     }
        // }
    // }
    templateCensusObj () {
        const census = {};
        const thingsByAlignment = this.dictByProp('alignment');

        Object.keys(thingsByAlignment).forEach(alignment => {
            // Partition each alignment further, by template.
            thingsByAlignment[alignment] = this.dictByProp('templateName', thingsByAlignment[alignment]);


            census[alignment] = {};
            const friends = thingsByAlignment[alignment];

            Object.keys(friends).forEach(templateName => {
                const kin = friends[templateName];

                census[alignment][templateName] = {
                    total: kin.length,
                    active: kin.filter(
                        t => t.active
                    ).length
                };
            });
        });

        return census;
    }

    // LG:
    //   dragon 1/7
    //   human 800000/1000000
    // LE:
    //   dragon 0/7
    //   human 70000/100000
    templateCensusString () {
        const census = this.templateCensusObj();
        const alignments = Object.keys(census);

        if (alignments.length === 0) {
            return 'Everyone is dead!';
        }

        return alignments
            .map(alignment => {
                const templates = Object.keys(census[alignment]).map(
                    template => {
                        const kin = census[alignment][template];

                        return `  ${ template }\t${ kin.active }/${ kin.total }`;
                    }
                )
                .sort();

                return `${ alignment }:\n${ templates.join('\n') }`;
            })
            .sort()
            .join('\n');

    }

    // Example:
    // {
    //     LG: {
    //         total: 6,
    //         active: 2
    //     },
    //     LE: {
    //         total: 80,
    //         active: 0
    //     }
    // }
    alignmentCensusObj () {
        const alignments = {};

        this.things.forEach(
            thing => {
                const existingEntry = alignments[thing.alignment];

                if (existingEntry) {
                    existingEntry.total += 1;

                    if (thing.active) {
                        existingEntry.active += 1;
                    }

                    return;
                }

                alignments[thing.alignment] = { total: 1 };

                alignments[thing.alignment].active = thing.active ?
                    1 :
                    0;
            }
        );

        return alignments;
    }

    alignmentCensusString () {
        const census = this.alignmentCensusObj();
        const alignments = Object.keys(census);

        if (alignments.length === 0) {
            return 'Everyone is dead!';
        }

        return alignments
            .map(alignment => `${alignment}: ${Util.abbrvNumber(census[alignment].active)}/${Util.abbrvNumber(census[alignment].total)}`)
            .sort()
            .join(', ');
    }

    // Returns string[]
    alignments () {
        const alignments = {};

        this.things.forEach(
            thing => {
                if (! thing.active) {
                    return;
                }

                alignments[thing.alignment] = true;
            }
        );

        return Object.keys(alignments);
    }

    // Returns true iff multiple factions exist among living beings.
    conflictExists () {
        if (! this.things || this.things.length <= 1) {
            return false;
        }

        const alignments = {};

        for (let i = 0; i < this.things.length; i++) {
            const ti = this.things[i];

            if (! ti.active) {
                continue;
            }

            // If another faction exists, then conflict exists.
            if (! alignments[ti.alignment] && Object.keys(alignments).length >= 1) {
                return true;
            }

            alignments[ti.alignment] = true;
        }

        return false;
    }

    toJson () {
        const serializedThings = this.things.map(
            thing => thing.toJson()
        );

        return {
            t: this.t,
            things: serializedThings,
            wanderingGenerator: this.wanderingGenerator.toJson()
        };

        // Omitted props: timeline, glossary
    }

    static test () {
        Util.log(`WorldState.test()\n`, 'info');

        const ws = new WorldState();
        const trees = ws.randomTrees();
        const arbitraryTree = trees[0];
        const group = ws.groupFromTree(arbitraryTree);

        Util.log('WorldState.test(): ws.glossary:\n' + Yaml.dump(ws.glossary), 'debug');

        const output = Util.stringify(group);
        Util.log(`WorldState.test(): ${output}`, 'info');
    }
}

module.exports = WorldState;


/* Notes

Devise a syntax for distinguishing between child WNodes that introduce a new Action (eg weapons or tools) and child WNodes that modify one or all existing Actions (eg modifications of weapons, training, etc).
WNodes that provide a new Action can be tagged with 'action'.
There is still a question about improving 1 vs improving all nodes.
Generally, modifiers should be applied to the parent.
The exception is with training, targeting VISRs, and magic rings. For these, the parent is the creature, and all Actions of that creature should get +1 to the Hit stat.
Another exception could be a targeting computer in a weapon/item that has multiple firing modes.
Candidate: child WNodes that are not tagged with 'action' apply their stats as modifiers to all Actions associated with their parent and siblings.

I also am tempted by the concept of giving Creatures modifiers to hit, damage, and range.
Then hopefully would not have to carry modifers up further than the parent.
... Except for dnd magical components. Like a jem of defense in the hilt of a sword.
Maybe modifiers from a WNode go up until they reach something they can attach to?
That paradigm would require modifiers to live inside Creatures too.
Or ... maybe it tries to apply to parent's action, then tries to apply to (all) sibling actions?
And then repeat the process from the parent pov.

I could entertain the notion of enforcing 1 action per Creature for MRB 1.

Okay, a hit stat for creatures seems very reasonable. Good aim and weapon skill.
Creatures will probably lack a range stat regardless. I guess a ogre might have more 1 more range with a spear...
Creatures might have a damage stat representing super strength for melee warriors. It shouldn't apply to firearms. You could block it from applying to weapons with range > 2 ... but there would be some exceptions. The spear of a giant, a javelin...
Maybe easier just to use tags. A tag (implied by 'gun') for 'benefitsFromStrength' ... 'strengthMatters' ...
The tags 'thrown' and 'melee' would both imply that. For those, apply creature.damage and (maybe) creature.range as arithmetic bonuses to their Actions.

Group-relevant intermediate actions from during WNode-to-template process:

from scope2x: {
    size: 0.1
    hit: 1
}

from heavyPistol: {
    size: 0.1
    actions: [{
        range: 20
        hit: 1
        damage: 2
    }]
}

from pilot: {
    size: 1
    hp: 2
    defense: 15
    actions: [{
        range: 20
        hit: 1
        damage: 2
    }]
}

...

Sketch of what we will model for MRB 1:
  marine w/ battleRifle
  marine w/ assaultRifle w/ kineticBolts
  marineInElephant (a Group of this template represents a Elephant transport)
  marineInWarthog
  warthog variants: transport, gauss, swordNeedler
  scorpion, wasp, etc - passengers are 'passenger' or 'marinePassenger' template and contribute no stat modifiers
  pelicans & transports - maybe focus on the infantry squad and ignore the vehicle! MRB 1 is spaceless.
  jetpack marines
  odst & spartan infantry
  marine w/ dualPistols - when dual wielding, a pair is one template
    dualSmgs dualLightPistols dualHeavyPistols dualNeedlers dualPlasmaRifles
    pistolx2 heavyPistolx2
    pistolPair plasmaRiflePair
  simple items such as scopes, alternate weapons on a wasp, armor abilities, stealth gear (+1 defense), etc
  squad with a item, such as a bubble shield, or heavy weapon
    maybe Group.nodeTree should point to the squad WNode
    that way the squad's shared items have a clear place to be stored.
  passengers can be represented as low res stat modifiers, such as mongoose passengers
  mongoose
    marine
      smg
  or
  mongooseMarinex2
    smg
  or
  gungoose
    driveByMarine
      hit: -1
      smg
  or, because additional attacks dont add benefit to the gungoose
  gungoose
    passengerSmg
  where passengerSmg is a node that adds +1 hit +1 damage or something
  or
  gungoose
    passengerHydra
  or
  warthog
    chainGun
  warthog
    passengerSmgx4
  warthog
    passengerAssaultRifle
  or maybe just describe a Scout Warthog like this:
  warthog
    assaultRifle
  lance
    grunt
      quantity: 8
      ...
    eliteLeader
      range: 10
      hit: 1
      damage: 1
      <A 'squad item' that buffs them. Not tagged 'action'.>

Okay, so, summary of MRB 1 plan:
The WGenerator will only output trees where the resulting Group is homogenous and shows behavior no more complex than the Group stats enable.
If passengers and other inner complexities are output by the WGenerator, they will be low res templates like 'marinePassenger' or 'passengerSmg'.
A recursive reduce() call aggregates templates by looking at the templates of child WNodes and summing up the stats (modifiers).
Templates can be pojos in MRB 1 if necessary.
Templates affect their parents, not siblings. 
The squad WNode is the one that will become a Group. All its children are mere modifiers as far as Battle20 is concerned. 
Templates with the 'action' tag resolve into a Action pojo. This absorbs all range/hit/damage modifiers from its children.
Both Groups and Actions can have .hit modifiers. Represents the aim of a warrior and the accuracy / usability of a weapon.
Splash damage is represented by just giving the weapon more damage; there is no special mechanic for that yet. Monsters and vehicles can have more HP to make this work.
Damage spills over across individuals within a single Group. Not across groups.
Templates list defense as a modifier, not as '12' or '19'. 19 would be listed as 9. Each Group has a base defense of 10. That is implied.
(Groups have base ranges and hits of 0.)
When combining size stats, take the max of the two rather than summing.
For infantry in a transport or armored truck, model them as a infantry squad involving template soldierInTruck etc.
If you want to represent the presence of a extra soldier, special soldier, or armed passenger, just use a modifier node, as if they were a item. You can attach this to the squad's WNode (top level).




*/
