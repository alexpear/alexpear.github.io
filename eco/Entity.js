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

    // move this function to Gamestate?
    move (relativeCoord) {
        if (2 <= relativeCoord.magnitude()) {
            // TODO: better error handling
            console.log('ERROR: move() called with oversized relative coord.');
            return;
        }

        var destination = this.coord.plus(relativeCoord);
        // TODO: where does isINBounds() live?
        if (! destination.isInBounds()) {
            console.log('ERROR: move() called with destination outside the bounds.');
            return;
        }

        // TODO: finalize whether to have an Entity.worldstate field.
        if (this.worldstate.thingAt(destination)) {
            console.log('ERROR: move() cant move you to an occupied square.');
            return;
        }
    }
};
