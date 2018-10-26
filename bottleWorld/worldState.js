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





*/
