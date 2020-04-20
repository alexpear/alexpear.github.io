'use strict';

const Coord = require('../util/coord.js');
const NodeTemplate = require('../battle20/nodeTemplate.js');
const Util = require('../util/util.js');
const WNode = require('./wnode.js');

// Can be very similar to Group from Battle20 / dndBottle
// .quantity, .template (CreatureTemplate), maybe some a prop for the SP of the sole wounded member.
// .getWeight(), .getMaxSize(), .getSizeTotal(), .getSpeed() <- only different from template if there is some status condition effect, etc

// Similar to the concept of a 'banner' or 'stack' or 'army' in large-scale map-based wargames.
// Contains a homogenous set of 1+ Creatures
// These are not instantiated in .components.
module.exports = class Group extends WNode {
    constructor (template, quantity, alignment, coord) {
        super(template);

        this.quantity = Util.exists(quantity) ?
            quantity :
            1;

        this.worstSp = this.template ?
            this.template.maxSp :
            1;

        this.alignment = alignment;

        this.coord = coord;
    }

    toAlignmentString() {
        const tName = Util.fromCamelCase(this.templateName);

        return `${tName} x${this.quantity} (${this.alignmentAsString()} Group)`;
    }

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

    static marineCompany () {
        // const template = WGenerator.getTemplate('halo/unsc/individual/marinePrivate');

        const company = new Group('halo/unsc/individual/marinePrivate', 50);

        return company
;    }
};
