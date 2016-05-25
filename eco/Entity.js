'use strict';

var Templates = require('./Templates.js');

module.exports = class Entity {
    constructor (template, coord) {
        template = template || Templates.infantry;

        this.type = template.name;  // TODO standardize field name
        this.region = null;  // TODO
        this.coord = coord || new Coord();
        this.sprite = template.sprite;
        this.stepsTillMove = template.moveInterval - 1;
    }
};
