'use strict';

var Actions = require('./Actions.js');
var Factions = require('./Factions.js');
var Templates = require('./Templates.js');

module.exports = class Entity {
    constructor (template, faction, coord) {
        template = template || Templates.infantry;

        this.type = template.name;  // TODO standardize field name
        this.region = null;  // TODO
        this.coord = coord || new Coord();
        this.sprite = template.sprite;
        this.stepsTillMove = template.moveInterval - 1;
        this.faction = faction || Factions.gaia;
    }

    step () {
        if (this.stepsTillMove > 0) {
            this.stepsTillMove--;
        } else {
            var action = this.chooseAction();
        }
    }

    chooseAction () {
        return Actions.randomMove;
    }

    move (relativeCoord) {

    }
};
