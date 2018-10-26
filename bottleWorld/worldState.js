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

