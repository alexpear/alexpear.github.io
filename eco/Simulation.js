'use strict';

var _ = require('underscore');
var WorldState = require('./WorldState.js');

var Simulation = class Simulation {
    constructor (worldState) {
        this.worldState = worldState || new WorldState();
    }
};

var sim = new Simulation();
sim.worldState.debugSetup();
sim.worldState.diagnostic();
console.log(sim.worldState.textImage());

console.log('completed');
