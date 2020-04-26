'use strict';

// const ActionReadyEvent = require('./actionReadyEvent.js');
const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const MoveAllEvent = module.exports = class MoveAllEvent extends BEvent {
    constructor () {
        super(BEvent.TYPES.MoveAll);
    }

    resolve (worldState) {
        // If seems appropriate, we could persist in this BEvent a map from WNode id to its Coord at end of the step.
        this.endCoords = {};

        // Movement MRB1: Each Group moves towards nearest enemy Group, unless it has attacked in the last 10 seconds, in which case it cannot move.
        worldState.activeNodes().forEach(
            (node) => {
                const nearestFoe = worldState.nearestFoe(node);
                // Util.log(`nearestFoe exists? ${!!nearestFoe}`);
                const endLocation = worldState.coordAtEndOfMove(node, nearestFoe && nearestFoe.coord);

                // Util.log(`in MoveAllEvent, moving a ${node.alignment} wnode from ${Util.prettyMeters(node.coord.x)} (${worldState.prettyDegrees(node.coord.x)}) to ${Util.prettyMeters(destination.x)} (${worldState.prettyDegrees(destination.x)}). Its speed is ${node.getSpeed()}`);

                if (node.coord.equals(endLocation)) {
                    return;
                }

                node.coord = endLocation;
                this.endCoords[node.id] = endLocation;
            }
        );

        this.addOutcome(
            new MoveAllEvent(),
            worldState,
            this.t + 1
        );
    }
};
