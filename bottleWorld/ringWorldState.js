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

    toDebugString () {
        const output = [];

        // Bucket the wnodes into sectors
        const SECTOR_COUNT = 36;
        const sectorSize = this.circumference / SECTOR_COUNT;
        const sectors = [];

        this.nodes.forEach(
            node => {
                const n = Math.floor(node.coord.x / sectorSize);

                // Util.log(n);

                // Util.log(node.coord.toString());

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

        // worldState.printNodes();
        Util.log(worldState.toDebugString());

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

