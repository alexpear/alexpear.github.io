'use strict';

var Actions = require('./Actions.js');
var Coord = require('./Coord.js');
var Factions = require('./Factions.js');
var Templates = require('./Templates.js');
var Util = require('../Util.js');

module.exports = class Entity {
    constructor (template, faction, coord) {
        this.become(template);

        this.coord = Util.default(coord, new Coord());
        this.faction = Util.default(faction, Factions.gaia);
    }

    getSprite () {
        var color = this.faction ? Util.colors[this.faction.color] : Util.colors['yellow'];
        var sprite = Util.default(this.sprite, '?');
        return '\x1b[' + color + sprite + '\x1b[0m';
    }

    become (template) {
        template = Util.default(template, Templates.infantry);
        // console.log('becoming ' + template.name);
        this.template = template;

        // BTW: We could access these with entity.template.moveInterval,
        // but the upside of caching it is that we can change it.
        this.moveInterval = template.moveInterval;
        this.stepsTillMove = template.moveInterval - 1;
        this.sprite = template.sprite;
    }

    attackSucceeds (target) {
        // TODO: This is not yet a function of attack or armor values.
        return Math.random() < 0.5;
    }
};
