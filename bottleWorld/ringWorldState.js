'use strict';

const _ = require('lodash');

const GroupWorldState = require('./groupWorldState.js');
const Timeline = require('./timeline.js');

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');

// Armies on a thin circular world, a la Ringworld by Larry Niven.
class RingWorldState extends GroupWorldState {
    constructor (startingGroups, circumference) {
        super();

        this.nodes = this.nodes.concat(startingGroups || []);

        this.circumference = circumference || RingWorldState.CIRCUMFERENCE;

        this.assignCoords();
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

    assignCoords () {
        this.nodes.forEach(
            node => {
                if (node.coord) {
                    return;
                }

                node.coord = this.randomCoord();
            }
        );
    }

    worthContinuing () {
        const inSetup = this.now() <= 10;
        const conflictExists = this.conflictExists();
        const probablyNotStuck = this.now() <= 500000;

        return inSetup ||
            (conflictExists && probablyNotStuck);
    }

    // TODO add one UnivesalUpdate BEvent in the first tick.
    // Actually make this a side effect of a Arrival ... well, no, could be expensive
    // Yeah, always add it on init.
    // The moveEverything logic can be the resolve() of this UniversalUpdate
    // Could even make a new BEvent subclass called MoveAll
    moveEverything () {
        // Movement MRB1: Each Group moves towards nearest enemy Group, unless it has attacked in the last 10 seconds, in which case it cannot move.
        // TODO iterate over all creatures / groups

        // TODO this must either be deterministic or be saved in the Timeline somehow
        // perhaps as Move events or Update events or something
    }

    toDebugString () {
        const output = [];

        // Bucket the wnodes into sectors
        const SECTOR_COUNT = 36;
        const sectorSize = this.circumference / SECTOR_COUNT;
        const sectors = [];

        this.nodes.forEach(
            node => {
                const n = Math.floor(node.coord.x / sectorSize);

                if (sectors[n]) {
                    sectors[n].push(node);
                }
                else {
                    sectors[n] = [node];
                }
            }
        );

        for (let n = 0; n < SECTOR_COUNT; n++) {
            const contents = sectors[n] ?
                sectors[n].map(
                    node => node.toAlignmentString()
                )
                .join(', ') :
                '';

            // LATER functionize this in Util
            const sectorWithLeadingZeroes = _.padStart(n, 2, '0');

            output[n] = `${sectorWithLeadingZeroes}: ${contents}`;
        }

        return '\n' + output.join('\n');
    }

    static example (timeline) {
        // TODO comment out death planet specific stuff

        const context = 'halo/unsc/individual';

        const startingGroups = [
            // TODO Perhaps the string templateName given to WGenerator should be sufficient for it to know when to create a Creature and when a Group. the template entry in the generator txt file could specify this.
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

        // LATER could use a func like worldState.addNodesByAlignment() to add these using ArrivalEvents
        const worldState = new RingWorldState(startingGroups, RingWorldState.CIRCUMFERENCE);

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;

        worldState.timeline = timeline;

        return worldState;
    }

    static test () {
        Util.log(`Beginning the RingWorldState test...`, `debug`);

        const worldState = RingWorldState.example();

        // worldState.printNodes();
        Util.log(worldState.toDebugString());

        while (worldState.worthContinuing()) {
            worldState.timeline.computeNextInstant();
            worldState.moveEverything();
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

