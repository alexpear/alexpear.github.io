'use strict';

const ForceWorldState = require('./worldState.js');

// Forces on a thin circular world.
class RingWorldState extends ForceWorldState {
    constructor (startingForces, circumference) {
        super();
        
        // Alternately, could rename WorldState.things to .wnodes or .entities
        // And could put the array of extant Forces in there.
        // (Force does not extend Thing, it only extends WNode)
        this.forces = [];
    }

    allAlignments () {
        // Yes, this capitalization is inconsistent with the camelcase style used by templateNames. Standardize stuff later.
        return [
            'UNSC',
            // 'Covenant',
            'Insurrection'
        ];
    }

    worthContinuing () {
        const inSetup = this.now() <= 10;
        const conflictExists = this.conflictExists();
        const probablyNotStuck = this.now() <= 500000;

        return inSetup ||
            (conflictExists && probablyNotStuck);
    }

    static example (timeline) {
        // TODO comment out death planet specific stuff
        const worldState = new RingWorldState();

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

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

        worldState.addThingsByAlignment(startingThings, context);

        return worldState;
    }

    static test () {
        Util.log(`Beginning the RingWorldState test...`, `debug`);

        const worldState = RingWorldState.example();
        worldState.printThings();

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
            RingWorldState.test();
        }
    }
}

module.exports = RingWorldState;

// Run with the following CLI command:
// node ringWorldState.js test

RingWorldState.run();

