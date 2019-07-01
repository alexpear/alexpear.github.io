'use strict';

const ContinuousWorldState = require('./continuousWorldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');
const CreatureTemplate = require('../battle20/creatureTemplate.js');
const Util = require('../util/util.js');

const Creature = require('../wnode/creature.js');
const Thing = require('../wnode/thing.js');

class DeathPlanetWorldState extends ContinuousWorldState {
    static proceed () {
        // Iterate over the set of BEvents in the timeline's current instant.
        // Later reconcile this with timeline.computeNextInstant()
        // Also perhaps put proceed() in a new class Transitioner, or Mover, or Director, or Simulator, or Mastermind.
    }

    static example (timeline) {
        const worldState = new DeathPlanetWorldState();

        worldState.glossary['soldier'] = CreatureTemplate.soldierExample();

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

        for (let i = 0; i < 4; i++) {
            // Start with 20 BEvents of type Arrival. They can be resolved in the first call to worldState.proceed()
            // Arrival BEvents have the outcome of causing a AbilityReady BEvent to appear within [0 to cooldown] seconds of the Arrival, for each Ability (ActionTemplate) of the arriving creature.

            worldState.timeline.addEvent(
                new ArrivalEvent('soldier')
            );
        }

        return worldState;
    }

    static test () {
        Util.log(`Beginning the DeathPlanetWorldState test...`, `debug`);

        const worldState = DeathPlanetWorldState.example();
        worldState.printThings();

        for (let t = 0; t < 8; t++) {
            worldState.timeline.computeNextInstant();
        }

        Util.log(`Up to t=${worldState.now()}, the timeline is: \n${worldState.timeline.toDebugString()}`, 'debug');

        worldState.printThings();

        const sampleActionsStr = JSON.stringify(
            worldState.things[0].actions(worldState),
            undefined,
            '    '
        );

        Util.log(`The first Thing has the following Actions: ${ sampleActionsStr }`, 'debug');
    }

    static run () {
        const consoleArguments = process.argv;
        if (consoleArguments[2] === 'test') {
            DeathPlanetWorldState.test();
        }
    }
}

module.exports = DeathPlanetWorldState;

// Run with the following CLI command:
// node deathPlanetWorldState.js test

DeathPlanetWorldState.run();
