'use strict';

var Region = require('./Region.js');
var Util = require('./Util.js');

module.exports = class WorldState {
	constructor () {
		this.entities = [];
		this.space = this.makeGrid();
		this.stepCount = 0;
	}

	makeGrid (rowCount, colCount) {
		rowCount = rowCount || Util.ROWCOUNT;
		colCount = colCount || Util.COLCOUNT;

		var grid = [];
		for (var ri = 0; ri < rowCount; ri++) {
			grid.push([]);

			for (var ci = 0; ci < colCount; ci++) {
				grid[ri].push(new Region());
			}
		}

		return grid;
	}

};
