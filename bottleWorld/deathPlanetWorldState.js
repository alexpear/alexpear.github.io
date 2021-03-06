'use strict';

const ContinuousWorldState = require('./continuousWorldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');

const CreatureTemplate = require('../battle20/creaturetemplate.js');
const Box = require('../util/box.js');
const Util = require('../util/util.js');
const Creature = require('../wnode/creature.js');
const Thing = require('../wnode/thing.js');

class DeathPlanetWorldState extends ContinuousWorldState {
	constructor () {
		super();

		this.box = Box.ofDimensions();
	}

    proceed () {
        // Iterate over the set of BEvents in the timeline's current instant.
        // Later reconcile this with timeline.computeNextInstant()
        // Also perhaps put proceed() in a new class Transitioner, or Mover, or Director, or Simulator, or Mastermind.
    }

    // TODO recent changes to MoveAllEvent seem to correspond with cessation of shooting on the Phaser front end. Look for TypeErrors and check the presence of BEvents in the Timeline. 
    moveEverything () {
        this.nodes.forEach(
            node => {
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

        // worldState.glossary.marinePrivate = CreatureTemplate.marineExample();

        // const gunAction = worldState.glossary.marinePrivate.actions[0];
        // worldState.glossary[gunAction.id] = gunAction;

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

        // Scale test notes, 2019 Nov 1, Moloch laptop
        // 40,000 soldiers with DMRs have a lot of trouble computing shooting. Didnt see one tick of shooting finish after several minutes.
        // 10,000 is fine. First shooting tick takes < 60 sec.
        // 4,000 works well.
        // 2019 Nov 4, Baal desktop can handle 5,000 with only a few seconds delay.
        // Baal with 20,000 is around 2min for the 1st second, then accelerating.

        const context = 'halo/unsc/individual';

        const startingThings = {
            UNSC: {
                marinePrivate: 30,
                spartan: 30
            },
            Insurrection: {
                marinePrivate: 70
            }
        };

        worldState.addNodesByAlignment(startingThings, context);

        return worldState;
    }

    static test () {
        Util.log(`Beginning the DeathPlanetWorldState test...`, `debug`);

        const worldState = DeathPlanetWorldState.example();
        worldState.printNodes();

        while (worldState.worthContinuing()) {
            worldState.timeline.computeNextInstant();
        }

        Util.log(`Up to t=${worldState.now()}, the timeline is: \n${worldState.timeline.toDebugString()}`, 'debug');

        worldState.printCensus();

        // Type: object
        const timelineJson = worldState.timeline.toJson();

        // Type: string
        const timelineJsonStr = JSON.stringify(timelineJson);
        const timelineJsonStrWhitespace = JSON.stringify(timelineJson, undefined, '    ');

        Util.log(`The json version of the timeline is ${timelineJsonStr.length} characters long (no whitespace).`);

        // Util.log(timelineJsonStr);

        return worldState;
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


/* Wishlist
. Ability to set a specific Thing or a templateName to detailed biography mode, and then see detailed entries for each one in the logs
. Thing.eliminatedBy field or getter. Stores who KOed it.
. Thing.eliminated field (Thing[]) or getter. Also useful for 'axe counts' like Legolas and Gimli have.
. Ability to see the population of a interesting group (eg, number of dragons) at each timestep in a timeline
. Ability to see a timeline with 'LG dragon dies' events marked on it.


*/