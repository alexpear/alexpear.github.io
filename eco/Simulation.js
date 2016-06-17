'use strict';

var Util = require('./Util.js');
var WorldState = require('./WorldState.js');

var _ = require('underscore');

var Simulation = class Simulation {
    constructor (worldState, maxSteps) {
        this.worldState = Util.default(worldState, new WorldState());
        this.maxSteps = Util.default(maxSteps, 27);
    }

    run (secondsPerStep, logging, pauseEvery) {
        this.executeStep();
    }

    executeStep () {
        var world = this.worldState;

        if (world.stepCount >= this.maxSteps) {
            return world;
        } else {
            world.step();
            console.log('Step ' + world.stepCount + ':');
            world.draw();
            var interval = 1 * 1000;
            setTimeout(this.executeStep.bind(this), interval);
        }
    }
};

var sim = new Simulation();

sim.worldState.debugSetup();
sim.run();
sim.worldState.diagnostic();

console.log('sim testing completed');
console.log();
