'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const WNode = require('./wnode.js');

module.exports = class Thing extends WNode {
    constructor (template, coord) {
        super(template);

        // Util.logDebug(`Thing constructor, after super(). template param is ${template}. this.template.actions.length is ${this.template && this.template.actions.length}`);

        this.coord = coord || Coord.randomOnScreen();

        // Init stamina points
        this.sp = this.findTrait('sp') || 1;

        // Unit: timestamp in seconds
        this.lastDamaged = -Infinity;

        // Object that represents it in the display area.
        this.blip = undefined;
    }

    distanceTo (target) {
        const targetCoord = target.coord || target;

        return this.coord.manhattanDistanceTo(targetCoord);
    }

    // Unit: meters of longest dimension when in storage.
    getSize () {
        return this.traitMax('size');
    }

    // Unit: kg on Earth's surface.
    subtreeWeight () {
        const localWeight = this.template && this.template.weight;

        return this.components.reduce(
            (sum, component) => sum + component.subtreeWeight(),
            localWeight
        );
    }

    // Returns number
    resistanceTo (tags) {
        // LATER it's probably more performant to recursively gather a net resistance obj here, instead of multiple times in resistanceToTag()
        return Util.sum(
            tags.map(
                tag => this.resistanceToTag(tag)
            )
        );
    }

    // Returns number
    resistanceToTag (tag) {
        const localResistance = (this.template &&
            this.template.resistance &&
            this.template.resistance[tag]) ||
            0;

        return this.components.reduce(
            (overallResistance, component) => {
                return localResistance +
                    (component.resistanceTo && component.resistanceToTag(tag) || 0);
            },
            localResistance
        );
    }
};

