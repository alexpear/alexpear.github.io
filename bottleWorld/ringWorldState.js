'use strict';

const _ = require('lodash');

const GroupWorldState = require('./groupWorldState.js');
const Timeline = require('./timeline.js');

const ArrivalEvent = require('./events/arrivalEvent.js');

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');

// Armies on a thin circular world, a la Ringworld by Larry Niven.
class RingWorldState extends GroupWorldState {
    constructor (startingGroups, circumference) {
        super(undefined, 0, 'halo/unsc/squad', 1000000);

        this.circumference = circumference || RingWorldState.CIRCUMFERENCE;

        this.assignCoords();
    }

    addStartingGroups (groups, contextPath) {
        contextPath = contextPath || 'halo/unsc/squad';

        if (! this.timeline) {
            throw new Error('Cant addStartingGroups() because worldState.timeline is not yet populated.');
        }

        groups.forEach(group => {
            this.timeline.addEvent(
                new ArrivalEvent(contextPath + '/' + group.templateName, this.randomCoord(), group.alignment)
            );
        })
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

    // subclassed version.
    coordAtEndOfMove (wnode, destinationCoord) {
        const speed = wnode.getSpeed() || 0;

        if (Math.abs(wnode.coord.x - destinationCoord.x) <= speed) {
            return destinationCoord;
        }

        const clockwise = wnode.coord.plus1d(speed);
        const counterclockwise = wnode.coord.plus1d(speed * -1);
        const clockwiseIsCloser = this.distanceBetweenCoords(clockwise, destinationCoord) <
            this.distanceBetweenCoords(counterclockwise, destinationCoord);

        return clockwiseIsCloser ?
            clockwise :
            counterclockwise;
    }

    distanceBetween (nodeA, nodeB) {
        return this.distanceBetweenCoords(nodeA.coord, nodeB.coord);
    }

    distanceBetweenCoords (coordA, coordB) {
        const distance = Math.abs(coordA.x - coordB.x);

        return distance <= this.circumference / 2 ?
            distance :
            this.circumference - distance;
    }

    static testDistanceBetween () {
        const worldState = new RingWorldState([], 360);

        distanceBetweenScenario(30, 40, 10);
        distanceBetweenScenario(0, 179, 179);
        distanceBetweenScenario(0, 181, 179);
        distanceBetweenScenario(90, 260, 170);
        distanceBetweenScenario(90, 280, 170);
        distanceBetweenScenario(350, 10, 20);

        function distanceBetweenScenario (coordA, coordB, desiredDistance) {
            const nodeA = fakeNode(coordA);
            const nodeB = fakeNode(coordB);
            const output = worldState.distanceBetween(nodeA, nodeB);
            const reverseOutput = worldState.distanceBetween(nodeB, nodeA);

            if (output !== desiredDistance || reverseOutput !== desiredDistance) {
                throw new Error(`RingWorldState.distanceBetween() scandalously took inputs ${coordA} and ${coordB} and output ${output} (and ${reverseOutput} with switched inputs) instead of ${desiredDistance}.`);
            }
        }

        function fakeNode (position) {
            return {
                coord: {
                    x: position
                }
            };
        }
    }

    nearestFoe (wnode) {
        const activeNodes = this.activeNodes();

        let bestFoe;
        let bestDistance;

        for (let i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i].alignment === wnode.alignment) {
                continue;
            }

            const distance = this.distanceBetween(wnode, activeNodes[i]);
            // Util.log(`in nearestFoe(), distance is ${distance}`)

            if (! bestFoe || distance < bestDistance) {
                bestFoe = activeNodes[i];
                bestDistance = distance;
            }
        }

        return bestFoe;
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

            // LATER functionize this padding idiom in Util
            const sectorId = _.padStart(n, 2, '0') + '0';

            output[n] = `${sectorId}: ${contents}`;
        }

        return '\n' + output.join('\n');
    }

    printCoords () {
        const coordStrings = this.activeNodes().map(node =>
            `${node.toAlignmentString()} at ${this.prettyCoord(node.coord)}`
        );

        Util.log(
            '\n' + coordStrings.join('\n')
        );

        // Util.log(`activeNodes length is ${this.activeNodes().length}`);
        // Util.log(`this.nodes length is ${this.nodes.length}`);
        // Util.log(`this.nodes[0].active is ${this.nodes[0].active}`);
    }

    degrees (meters) {
        return meters / this.circumference * 360;
    }

    prettyDegrees (meters, precision) {
        return `${this.degrees(meters).toFixed(precision || 0)}°`;
    }

    prettyCoord (coord) {
        return `${Util.prettyMeters(coord.x)} (${this.prettyDegrees(coord.x)})`
    }

    static example (timeline) {
        // TODO comment out death planet specific stuff

        const startingGroups = [
            // TODO Perhaps the string templateName given to WGenerator should be sufficient for it to know when to create a Creature and when a Group. the template entry in the generator txt file could specify this.
            {
                templateName: 'marineGroup',
                alignment: 'UNSC'
            },
            {
                templateName: 'marineGroup',
                alignment: 'Insurrection'
            }
        ];

        // Eventually should functionize this timeline initialization:
        const worldState = new RingWorldState([], RingWorldState.CIRCUMFERENCE);

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;
        worldState.timeline = timeline;

        worldState.addStartingGroups(startingGroups);

        return worldState;
    }

    static test () {
        Util.log(`Beginning the RingWorldState test...`, `debug`);

        // Unit tests
        RingWorldState.testDistanceBetween();

        const worldState = RingWorldState.example();

        // worldState.printNodes();
        Util.log(worldState.toDebugString());

        while (worldState.worthContinuing()) {
            worldState.printCoords();
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

        Util.log(worldState.toDebugString());

        return worldState;
    }

    static run () {
        const consoleArguments = process.argv;
        if (consoleArguments[2] === 'test') {
            RingWorldState.test();
        }
    }
}

// Default diameter is 10,000km
// Unit: meters
RingWorldState.CIRCUMFERENCE = 3.14159 * 10000 * 1000;

module.exports = RingWorldState;

// Run with the following CLI command:
// node ringWorldState.js test

RingWorldState.run();

