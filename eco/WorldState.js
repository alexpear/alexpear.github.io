'use strict';

var Region = require('./Region.js');
var Util = require('./Util.js');

module.exports = class WorldState {
    constructor (rows, cols) {
        this.entities = [];

        // I'm not sure about the 2d array idea.
        this.space = this.makeGrid(rows, cols);
        this.rowCount = rows;
        this.colCount = cols;
        this.stepCount = 0;
    }

    makeGrid (rowCount, colCount) {
        rowCount = rowCount || Util.DEFAULTS.ROWCOUNT;
        colCount = colCount || Util.DEFAULTS.COLCOUNT;

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
    }
};
