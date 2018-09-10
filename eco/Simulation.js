'use strict';

var Util = require('../Util.js');
var WorldState = require('./WorldState.js');

var _ = require('underscore');

var Simulation = class Simulation {
    constructor (worldState, maxSteps) {
        this.worldState = Util.default(worldState, new WorldState());
        this.maxSteps = Util.default(maxSteps, 9999999);
    }

    run (secondsPerStep, logging, pauseEvery) {
        this.executeStep();
    }

    executeStep () {
        var world = this.worldState;

        if (world.stepCount >= this.maxSteps) {
            return;
        } else {
            var newFrame = world.textImage();

            console.log(CLEAR_STRING);
            console.log('Step ' + world.stepCount + ':');
            console.log(newFrame);

            world.step();

            var interval = 0.5 * 1000;
            setTimeout(this.executeStep.bind(this), interval);
        }
    }
};

var LAPTOP_R = 47;
var LAPTOP_C = 88;
var CLEAR_STRING = '\x1Bc';

var sim = new Simulation(new WorldState(16, 16));

sim.worldState.debugSetup();
sim.worldState.diagnostic();
sim.run();
