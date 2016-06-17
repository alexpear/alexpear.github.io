'use strict';

var Actions = require('./Actions.js');
var Coord = require('./Coord.js');
var Factions = require('./Factions.js');
var Templates = require('./Templates.js');
var Util = require('./Util.js');

module.exports = class Entity {
    constructor (template, faction, coord) {
        template = Util.default(template, Templates.infantry);

        this.type = template.name;  // TODO standardize field name
        this.coord = Util.default(coord, new Coord());
        this.sprite = template.sprite;
        this.template = template;

        // BTW: We could access these with entity.template.moveInterval,
        // but the upside of caching it is that we can change it.
        this.moveInterval = template.moveInterval;
        this.stepsTillMove = template.moveInterval - 1;
        this.faction = Util.default(faction, Factions.gaia);
    }
};
