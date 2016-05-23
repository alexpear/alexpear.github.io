'use strict';

var _ = require('underscore');
var WorldState = require('./WorldState.js');

var Simulation = class Simulation {
	constructor (worldState) {
		this.worldState = worldState || new WorldState();
	}
};

var sim = new Simulation();

// console.log(JSON.stringify(WorldState));
console.log(JSON.stringify(sim.worldState));

console.log('completed');
