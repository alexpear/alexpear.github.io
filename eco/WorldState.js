'use strict';

var Coord = require('./Coord.js');
var Entity = require('./Entity.js');
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

    makeGrid (rowCount, colCount) {
        rowCount = rowCount || this.rowCount;
        colCount = colCount || this.colCount;

        var grid = [];
        for (var ri = 0; ri < rowCount; ri++) {
            grid.push([]);

            for (var ci = 0; ci < colCount; ci++) {
                grid[ri].push(new Region());
            }
        }

        return grid;
    }

    at (coord) {
        // Runspeed is not currently a priority.
        return this.entities.find(function (entity) {
            return entity.coord.equals(coord);
        });
    }

    step () {
        // Not yet implemented.
    }

    textImage () {
        // Not yet implemented.
        return JSON.stringify(this.space);

        for (var r = 0; r < this.rowCount; r++) {
            for (var c = 0; c < this.colCount; c++) {
                // var TODO
            }
        }

        return this.space.map(function (row) {
            return row.map(function (region) {
                // return
            }).join(' ');
        }).join('\n');
    }

    diagnostic () {
        for (var i = 0; i < this.entities.length; i++) {
            var entityOne = this.entities[i];
            // Check entity is in bounds
            if (! entityOne.coord.isInBounds(this.rowCount, this.colCount)) {
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
};
