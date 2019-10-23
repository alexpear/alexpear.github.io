'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ActionEvent extends BEvent {
    // protagonist is a input param of type Thing|string. It will be used to populate the appropriate field of BEvent.
    constructor (protagonist, target, coord, actionId) {
        super(
            BEvent.TYPES.Action,
            protagonist,
            target,
            coord
        );

        this.actionId = actionId;
    }

    resolve (worldState) {
        const protagonist = worldState.fromId(this.protagonistId);
        const target = worldState.fromId(this.targetId);
        const actionTemplate = worldState.fromId(this.actionId);

        // TODO Call a shoot function to figure out what happens. Perhaps in Battle20.
        // Store representations of what happens either here or in a UpdateEvent.
        // Give that BEvent a func that outputs a logging string, with a pretty and a verbose mode.

        // Then replace the shoot logic in fishtank/src/fishTank.js

    }
};
