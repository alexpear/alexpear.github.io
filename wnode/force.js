'use strict';

const Coord = require('../util/coord.js');
const NodeTemplate = require('../battle20/nodeTemplate.js');
const Util = require('../util/util.js');
const WNode = require('./wnode.js');

// TODO actually i may instead want Group extends WNode
// Can be very similar to Group from Battle20 / dndBottle
// .quantity, .template (CreatureTemplate), maybe some a prop for the SP of the sole wounded member.
// .getWeight(), .getMaxSize(), .getSizeTotal(), .getSpeed() <- only different from template if there is some status condition effect, etc

// A Force is a ad-hoc organization: 1 or more Creatures in the same location with the same alignment and task.
// Similar to the concept of a 'banner' or 'stack' or 'army' in large-scale map-based wargames.
module.exports = class Force extends WNode {
    constructor (members, coord) {
        const forceTemplate = new NodeTemplate('force');

        super(forceTemplate);

        this.components = members;

        this.coord = coord || Coord.randomOnScreen();
    }

    // TODO start with example () func.

    // distanceTo (target) {
    //     const targetCoord = target.coord || target;

    //     return this.coord.manhattanDistanceTo(targetCoord);
    // }

    // // Unit: meters of longest dimension when in storage.
    // getSize () {
    //     return this.traitMax('size');
    // }

    // // Unit: kg on Earth's surface.
    // subtreeWeight () {
    //     const localWeight = this.template && this.template.weight;

    //     return this.components.reduce(
    //         (sum, component) => sum + component.subtreeWeight(),
    //         localWeight
    //     );
    // }
};
