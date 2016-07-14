'use strict';

var Actions = require('./Actions.js');
var Coord = require('./Coord.js');
var Factions = require('./Factions.js');
var Templates = require('./Templates.js');
var Util = require('./Util.js');

var colorMap = {
  'black': '1;37;40m',
  'red': '1;37;41m',
  'green': '1;30;42m',
  'yellow': '1;37;43m',
  'blue': '1;37;44m',
  'purple': '1;37;45m',
  'cyan': '1;30;46m',
  'grey': '1;30;47m'
}

module.exports = class Entity {
    constructor (template, faction, coord) {
        this.become(template);

        this.coord = Util.default(coord, new Coord());
        this.faction = Util.default(faction, Factions.gaia);
    }

    getSprite () {
        var color = this.faction ? colorMap[this.faction.color] : colorMap['yellow'];
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
        return Math.random() < 0.1;
    }
};
