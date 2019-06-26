'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ActionReadyEvent extends BEvent {
    constructor (protagonist, actionType) {
        super(
            BEvent.TYPES.ActionReady,
            protagonist
        );

        this.actionType = actionType;
    }

    resolve (worldState) {
        // TODO Implement.
        // MRB 1: The protagonist takes the action specified by this.actionType
        // Parameters and targets can be determined randomly, perhaps by Thing.chooseActionDetails() or something.
    }
};
