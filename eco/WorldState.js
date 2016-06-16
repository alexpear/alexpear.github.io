'use strict';

var Coord = require('./Coord.js');
var Entity = require('./Entity.js');
var Factions = require('./Factions.js');
var Region = require('./Region.js');
var Templates = require('./Templates.js');
var Util = require('./Util.js');

module.exports = class WorldState {
    constructor (rows, cols) {
        this.entities = [];

        // I'm not sure about the 2d array idea.
        this.space = this.makeGrid(rows, cols);
        this.rowCount = rows || Util.DEFAULTS.ROWCOUNT;
        this.colCount = cols || Util.DEFAULTS.COLCOUNT;
        this.stepCount = 0;
    }

    debugSetup () {
        this.create(Templates.evangelion, Factions.empire, new Coord(4,6));
        this.create(Templates.air, Factions.rebels, new Coord(8,6));
        this.create(Templates.air, Factions.rebels, new Coord(9,9));
    }

    // Probably deprecated.
    makeGrid (rowCount, colCount) {
        rowCount = rowCount || this.rowCount;
        colCount = colCount || this.colCount;

        var grid = [];
        for (var ri = 0; ri < rowCount; ri++) {
            grid.push([]);

            for (var ci = 0; ci < colCount; ci++) {
                grid[ri].push(null);  // TODO: Is there a better way?
            }
        }

        return grid;
    }

    // TODO: Could cache this
    asGrid () {
        var grid = this.makeGrid();
        this.entities.forEach(function(entity) {
            grid[entity.coord.r][entity.coord.c] = entity;
        });

        return grid;
    }

    at (coord) {
        // Runspeed is not currently a priority.
        return this.entities.find(function (entity) {
            return entity.coord.equals(coord);
        });
    }

    isInBounds (coord) {
        return 0 <= coord.r && coord.r < this.rowCount
            && 0 <= coord.c && coord.c < this.colCount;
    }

    create (template, faction, coord) {
      var newEntity = new Entity(template || Templates.infantry, faction, coord);
      this.entities.push(newEntity);
    }

    step () {
        this.entities.forEach(function (entity) {
            entity.step();
        });
    }

    moveRelative (entity, relativeCoord) {
        if (2 <= relativeCoord.magnitude()) {
            // TODO: better error handling
            console.log('ERROR: move() called with oversized relative coord.');
            return;
        }

        var destination = entity.coord.plus(relativeCoord);
        if (! isInBounds(destination)) {
            console.log('ERROR: move() called with destination outside the bounds.');
            return;
        }

        // TODO: finalize whether to have an Entity.worldstate field.
        if (this.thingAt(destination)) {
            console.log('ERROR: move() cant move you to an occupied square.');
            return;
        }

        entity.coord = destination;
    }

    textImage () {
        // Candidate alg: function to assemble a 2d array representation
        // of the world, then render that in ascii.
        return this.asGrid().map(function (row) {
            return row.map(function (square) {
                return square ? square.sprite : '.';
            }).join(' ');
        }).join('\n');
    }

    diagnostic () {
        for (var i = 0; i < this.entities.length; i++) {
            var entityOne = this.entities[i];
            // Check entity is in bounds
            if (! this.isInBounds(entityOne.coord)) {
                console.log('error: entity ' + entityOne.sprite + ' is out of bounds');
            }

            // Look for pairs of Entities that are in the same space
            for (var j = i+1; j < this.entities.length; j++) {
                var entityTwo = this.entities[j];
                if (entityOne.coord.equals(entityTwo.coord)) {
                    console.log('error: multiple entities are both occupying ' + entityOne.coord.toString());
                }
            }
        }
    }

    // TODO check if all coords are occupied, to avoid infinite loop.
    randomEmptyCoord () {
        do {
            var coord = Coord.random();
        } while (!! this.at(coord));

        return coord;
    }
};
