'use strict';

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');
const DndCreature = require('../dnd/dndCreature.js');
const DndWarband = require('../generation/dndWarband.js');

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

// MRB1 space model: 4 equidistant zones, named N E S & W. 
class DndWorldState extends WorldState {
    constructor () {

    }

    static example (timeline, giveUpTime) {
    //     const startingGroups = [
    //         // TODO Perhaps the string templateName given to WGenerator should be sufficient for it to know when to create a Creature and when a Group. the template entry in the generator txt file could specify this.
    //         {
    //             templatePath: 'halo/unsc/squad/marineGroup',
    //             alignment: 'UNSC'
    //         },
    //         {
    //             templatePath: 'halo/flood/squad/podGroup',
    //             alignment: 'Flood'
    //         }
    //     ];

    //     // Eventually should functionize this timeline initialization:
        const worldState = new DndWorldState([], RingWorldState.CIRCUMFERENCE, giveUpTime);

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;
        worldState.timeline = timeline;

        // worldState.addStartingGroups(startingGroups);

        return worldState;
    }

    static test () {
    //     Util.log(`Beginning the RingWorldState test...`, `debug`);

    //     // Unit tests
    //     RingWorldState.testDistanceBetween();

    //     const worldState = RingWorldState.example(undefined);

    //     // worldState.printNodes();
    //     // Util.log(worldState.toDebugString());

    //     while (worldState.worthContinuing()) {
    //         worldState.printCoords();
    //         worldState.timeline.computeNextInstant();
    //     }

    //     Util.log(`Up to t=${worldState.now()}, the timeline is: \n${worldState.timeline.toDebugString()}`, 'debug');

    //     worldState.timeline.printInRealTime();

    //     worldState.printCensus();

    //     // Type: object
    //     const timelineJson = worldState.timeline.toJson();

    //     // Type: string
    //     const timelineJsonStr = JSON.stringify(timelineJson);
    //     const timelineJsonStrWhitespace = JSON.stringify(timelineJson, undefined, '    ');

    //     Util.log(`The json version of the timeline is ${Util.commaNumber(timelineJsonStr.length)} characters long (no whitespace). The timeline has run for ${Util.prettyTime(worldState.now())} of in-world time.`);

    //     // Util.log(timelineJsonStr);

    //     Util.log(worldState.toDebugString());

    //     return worldState;
    }

    // battle (warbandA, warbandB) {
    //     const everyone = warbandA.creatures.concat(warbandB.creatures);
    //     // TODO: Randomize order of everyone

    //     for (const creature of everyone) {
    //         // creature.selectTarget() // Hmm, i should focus on the BEvent-style.
    //     }

    //     // TODO
    // }
}

module.exports = DndWorldState;

DndWorldState.test();
