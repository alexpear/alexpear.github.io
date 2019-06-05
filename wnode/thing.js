'use strict';

const WNode = require('./wnode.js');

module.exports = class Thing extends WNode {
    constructor (templateName, coord) {
        super(templateName);

        this.coord = coord || new Coord();
        this.size = undefined;
        this.weight = undefined;

        // Non-active means eliminated, incapacitated, nonfunctional, inactive, or dead.
        this.active = true;
    }
};

