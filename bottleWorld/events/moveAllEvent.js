'use strict';

// const ActionReadyEvent = require('./actionReadyEvent.js');
const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const MoveAllEvent = module.exports = class MoveAllEvent extends BEvent {
    constructor (templateName, coord, alignment) {
        super(BEvent.TYPES.MoveAll);

        this.alignment = alignment;
    }

    resolve (worldState) {
        // If seems appropriate, we could persist in this BEvent a map from WNode id to its Coord at end of the step.
        this.endCoords = {};

        // Movement MRB1: Each Group moves towards nearest enemy Group, unless it has attacked in the last 10 seconds, in which case it cannot move.
        worldState.activeNodes().forEach(
            (node) => {
                const nearestFoe = worldState.nearestFoe(node);
                // Util.log(`nearestFoe exists? ${!!nearestFoe}`);
                const destination = worldState.coordAtEndOfMove(node, nearestFoe && nearestFoe.coord);

                // Util.log(`in MoveAllEvent, moving a ${node.alignment} wnode from ${Util.prettyMeters(node.coord.x)} (${worldState.prettyDegrees(node.coord.x)}) to ${Util.prettyMeters(destination.x)} (${worldState.prettyDegrees(destination.x)}). Its speed is ${node.getSpeed()}`);

                node.coord = destination;
                this.endCoords[node.id] = destination;
            }
        );

        this.addOutcome(
            new MoveAllEvent(),
            worldState,
            this.t + 1
        );
    }
};

// const ArrivalEvent = module.exports = class ArrivalEvent extends BEvent {
//     constructor (templateName, coord, alignment) {
//         super(
//             BEvent.TYPES.Arrival,
//             undefined,
//             undefined,
//             coord || Coord.randomOnScreen(),
//             templateName
//         );

//         this.alignment = alignment;
//     }

//     resolve (worldState) {
//         const arriver = this.templateName ?
//             worldState.generateNodes(this.templateName)[0] :
//             worldState.fromId(this.templateName);

//         arriver.alignment = this.alignment || Util.randomOf(worldState.allAlignments());

//         worldState.addNode(arriver, this.coord);

//         // Util.logDebug(worldState.wanderingGenerator.toJson());

//         // Util.logDebug(`arriver.templateName: ${arriver.templateName}, arriver.template: ${arriver.template}, arriver.constructor.name: ${arriver.constructor.name}, typeof arriver.actions: ${typeof arriver.actions}, typeof arriver.deepCopy: ${typeof arriver.deepCopy}`);

//         const actions = Util.isFunction(arriver.getActions) && arriver.getActions();

//         if (! actions || actions.length === 0) {
//             Util.logDebug(`In ArrivalEvent,
//     arriver.templateName: ${arriver.templateName},
//     arriver.template: ${arriver.template},
//     arriver.constructor.name: ${arriver.constructor.name},
//     typeof arriver.getActions: ${typeof arriver.getActions},
//     typeof arriver.actions: ${typeof arriver.actions},
//     arriver.template.actions.length: ${arriver.template.actions.length},
//     typeof arriver.deepCopy: ${typeof arriver.deepCopy},
//     arriver.components[0].templateName: ${arriver.components[0] && arriver.components[0].templateName},
//     arriver.components[1].templateName: ${arriver.components[1] && arriver.components[1].templateName},
//     arriver.components[1].constructor.name: ${arriver.components[1] && arriver.components[1].constructor.name},
//     arriver.components[1].template.constructor.name: ${arriver.components[1] && arriver.components[1].template.constructor.name},
//     arriver.toJson() is the following:
//     `);
//             Util.logDebug(arriver.toJson());

//             throw new Error(`Debug throwing to figure out why ArrivalEvent receives something with no actions.`)

//             return;
//         }

//         // LATER, remove this preference for homogenous actions
//         const preferredAction = actions.find(a => a.name === 'dmr');
//         const chosenAction = preferredAction || actions[0];

//         const actionReadyEvent = new ActionReadyEvent(arriver, chosenAction.id);

//         this.addOutcome(actionReadyEvent, worldState, this.t + ArrivalEvent.ACTION_DELAY);

//         // Later ignore that ACTION_DELAY placeholder in favor of information found in codex templates.
//     }
// };

