'use strict';

const Coord = require('../util/coord.js');
const WNode = require('./wnode.js');

module.exports = class Thing extends WNode {
    constructor (template, coord) {
        super(template);

        this.coord = coord || new Coord();

        // Non-active means eliminated, incapacitated, nonfunctional, inactive, or dead.
        this.active = true;
    }

    // NOTE: There is currently some mild confusion. The size getter reads from the template, but the size is also copied to the WNode. I may remove that caching later for performance. ToW 2019 Oct 18.

    // Unit: meters of longest dimension when in storage.
    size () {
        return this.template && this.template.size;
    }

    // Unit: kg on Earth's surface.
    subtreeWeight () {
        const localWeight = this.template && this.template.weight;

        return this.components.reduce(
            (sum, component) => sum + component.subtreeWeight(),
            localWeight
        );
    }
};

