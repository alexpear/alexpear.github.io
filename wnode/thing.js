'use strict';

const Coord = require('../util/coord.js');
const WNode = require('./wnode.js');

module.exports = class Thing extends WNode {
    constructor (templateName, coord) {
        super(templateName);

        this.coord = coord || new Coord();

        // Unit: meters of longest dimension when in storage.
        this.size = undefined;

        // Unit: kg on Earth's surface.
        this.weight = undefined;

        // Non-active means eliminated, incapacitated, nonfunctional, inactive, or dead.
        this.active = true;
    }
};

