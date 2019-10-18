'use strict';

const Coord = require('../util/coord.js');
const WNode = require('./wnode.js');

module.exports = class Thing extends WNode {
    constructor (template, coord) {
        super(template);

        this.coord = coord || new Coord();

        // Unit: meters of longest dimension when in storage.
        this.size = this.template && this.template.size;

        // Unit: kg on Earth's surface.
        this.weight = this.template && this.template.weight;

        // Non-active means eliminated, incapacitated, nonfunctional, inactive, or dead.
        this.active = true;
    }
};

