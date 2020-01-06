'use strict';

const ForceWorldState = require('./worldState.js');

// Forces on a thin circular world.
class RingWorldState extends GroupWorldState {
    constructor (startingGroups, circumference) {
        super();

        this.nodes = this.nodes.concat(startingGroups || []);

        this.circumference = circumference || RingWorldState.CIRCUMFERENCE;

        // Give the groups random Coords on the ring
    }

    allAlignments () {
        // Yes, this capitalization is inconsistent with the camelcase style used by templateNames. Standardize stuff later.
        return [
            'UNSC',
            'Insurrection'
        ];
    }

    randomCoord () {
        return Coord.random(this.circumference);
    }

    worthContinuing () {
        const inSetup = this.now() <= 10;
        const conflictExists = this.conflictExists();
        const probablyNotStuck = this.now() <= 500000;

        return inSetup ||
            (conflictExists && probablyNotStuck);
    }

    toDebugString () {
        const output = '';

        // Bucket the wnodes into 36 sectors
        const sectors = [];

        this.nodes.forEach(
            node => {
                const n = node.coord.x / 36 // or something. look up bucketing, truncation TODO
                // sectors[n] <- push here or make array here
            }
        );

    }

    static example (timeline) {
        // TODO comment out death planet specific stuff

        const context = 'halo/unsc/individual';

        const startingGroups = [
            new Group(
                'marinePrivate',
                50,
                'UNSC'
            ),
            new Group(
                'marinePrivate',
                49,
                'Insurrection'
            )
        ];

        const worldState = new RingWorldState(startingGroups, RingWorldState.CIRCUMFERENCE);

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

        return worldState;
    }

    static test () {
        Util.log(`Beginning the RingWorldState test...`, `debug`);

        const worldState = RingWorldState.example();
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
            RingWorldState.test();
        }
    }
}

RingWorldState.CIRCUMFERENCE = 3.14159 * 10000 * 1000; // Default diameter is 10,000km

module.exports = RingWorldState;

// Run with the following CLI command:
// node ringWorldState.js test

RingWorldState.run();

