'use strict';

var Util = require('./Util.js');
var WorldState = require('./WorldState.js');

var _ = require('underscore');

var Simulation = class Simulation {
    constructor (worldState) {
        this.worldState = Util.default(worldState, new WorldState());
    }

    run (maxSteps, secondsPerStep, logging, pauseEvery) {
        maxSteps = Util.default(maxSteps, 27);
        var world = this.worldState;

        while (world.stepCount < maxSteps) {
            world.step();
            console.log('Step ' + world.stepCount + ':');
            world.draw();
        }
    }
};

var sim = new Simulation();

sim.worldState.debugSetup();
sim.run();
sim.worldState.diagnostic();

console.log('sim testing completed');
console.log();
