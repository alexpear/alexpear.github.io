'use strict';

var Util = require('./Util.js');
var WorldState = require('./WorldState.js');

var _ = require('underscore');

var Simulation = class Simulation {
    constructor (worldState) {
        this.worldState = Util.default(worldState, new WorldState());
    }

    run (maxSteps, secondsPerStep, logging, pauseAt) {
        maxSteps = Util.default(maxSteps, 100);

        return;  // debug
        while (this.worldState.stepCount < maxSteps) {

        }
    }
};

var sim = new Simulation();

sim.worldState.debugSetup();
sim.worldState.draw();
sim.worldState.step();
sim.worldState.diagnostic();

console.log('sim testing completed');
console.log();
