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
        Util.log(nodeTree.toPrettyString(), 'debug');

        return new Group('dwarfAxeThrower');
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

