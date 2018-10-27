'use strict';

// Represents the world in a Bottle World at one moment.

const Alignment = require('../dnd/alignment.js');
const Coord = require('../util/coord.js');
const CreatureTemplate = require('../battle20/creaturetemplate.js');
const Event = require('../battle20/event.js');
const Group = require('../battle20/group.js');
const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');
const WGenerator = require('../generation/wgenerator.js');

class WorldState {
    constructor () {
        this.things = [];
        this.wanderingGenerator = WGenerator.fromCodex('battle20/halo/unsc/group');
        this.glossary = this.wanderingGenerator.glossary;
    }

    thingsAt (coord) {
        return this.things.filter(
            t => t.coord && t.coord.equals(coord)
        );
    }

    randomTrees () {
        return this.wanderingGenerator.getOutputs();
    }

    groupFromTree (nodeTree) {
        Util.log('\n' + nodeTree.toYaml(), 'debug');

        const groupTemplate = this.getTemplate(nodeTree.templateName);
        const quantity = groupTemplate.quantity;

        // Later, make this more robust.
        const individualTree = nodeTree.components[0];
        const individualTemplateName = individualTree.templateName;
        const individualTemplate = this.getTemplate(individualTemplateName);

        Util.log(individualTemplate, 'debug');

        const combinedTemplate = this.getAggregatedTemplate(nodeTree);

        const group = new Group(individualTemplate, quantity);

        return group;
    }

    getTemplate (templateName) {
        if (templateName in this.glossary) {
            const template = this.glossary[templateName];

            template.templateName = templateName;

            return template;
        }
        else {
            throw new Error(`Could not find template '${ templateName }' in WorldState's glossary.`);
        }
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

                // TODO combineTemplates must work on both Creature and Action (and modifier) Templates interchangeably.
                return combineTemplates(aggregated, contribution);
            }
        );
    }

    static test () {
        Util.log(`WorldState.test()\n`, 'debug');

        const ws = new WorldState();
        const trees = ws.randomTrees();
        const arbitraryTree = trees[0];
        const group = ws.groupFromTree(arbitraryTree);

        const output = group.toPrettyString();
        Util.log(output, 'debug');
    }
}


// Run
WorldState.test();



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
