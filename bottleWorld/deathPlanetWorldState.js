'use strict';

const ContinuousWorldState = require('./continuousWorldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');
const CreatureTemplate = require('../battle20/creatureTemplate.js');
const Util = require('../util/util.js');

const Creature = require('../wnode/creature.js');
const Thing = require('../wnode/thing.js');

class DeathPlanetWorldState extends ContinuousWorldState {
    proceed () {
        // Iterate over the set of BEvents in the timeline's current instant.
        // Later reconcile this with timeline.computeNextInstant()
        // Also perhaps put proceed() in a new class Transitioner, or Mover, or Director, or Simulator, or Mastermind.
    }

    moveEverything () {
        this.things.forEach(
            thing => {
                // LATER If it has momentum or is continuing to travel, move it one second further along its path.
                // Round coords to the nearest cm.
            }
        );
    }

    allAlignments () {
        // Yes, this capitalization is inconsistent with the camelcase style used by templateNames. Standardize stuff later.
        return [
            'UNSC',
            // 'Covenant'
            'Insurrection'
        ];
    }

    static example (timeline) {
        const worldState = new DeathPlanetWorldState();

        worldState.glossary['soldier'] = CreatureTemplate.soldierExample();

        const gunAction = worldState.glossary.soldier.actions[0];
        worldState.glossary[gunAction.id] = gunAction;

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

        // Scale test notes, 2019 Nov 1
        // 40000 soldiers with DMRs have a lot of trouble computing shooting. Didnt see one tick of shooting finish after several minutes.
        // 10000 is fine. First shooting tick takes < 60 sec.
        // 4000 works well.

        for (let i = 0; i < 1000; i++) {
            // Start with n BEvents of type Arrival. They can be resolved in the first call to worldState.proceed()
            // Arrival BEvents have the outcome of causing a ActionReady BEvent to appear within [0 to cooldown] seconds of the Arrival, for each Action (ActionTemplate) of the arriving creature.

            worldState.timeline.addEvent(
                new ArrivalEvent('soldier', undefined, 'randomAlignment')
            );
        }

        return worldState;
    }

    static test () {
        Util.log(`Beginning the DeathPlanetWorldState test...`, `debug`);

        const worldState = DeathPlanetWorldState.example();
        worldState.printThings();

        for (let t = 0; t < 200; t++) {
            worldState.timeline.computeNextInstant();
        }

        Util.log(`Up to t=${worldState.now()}, the timeline is: \n${worldState.timeline.toDebugString()}`, 'debug');

        worldState.printThings();

        const sampleActionsStr = JSON.stringify(
            worldState.things[0].actions(worldState),
            undefined,
            '    '
        );

        // Util.log(`The first Thing has the following Actions: ${ sampleActionsStr }`, 'debug');
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
