'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ActionReadyEvent extends BEvent {
    constructor (protagonist, actionId) {
        super(
            BEvent.TYPES.ActionReady,
            protagonist
        );

        this.actionId = actionId;
    }

    resolve (worldState) {
        const protagonist = worldState.fromId(this.protagonistId);

        // TODO Implement.
        // MRB 1: The protagonist takes the action specified by this.actionType
        // Or, as a fallback, creature.actions()[0]
        // This may entail converting from string to Creature if .protagonist is a string.
        // (Reminder: Creature extends Thing extends WNode)

        // (Edge case: Creature has no actions. Maybe throw error, since ActionReady shouldn't have been called.)
        // Parameters and targets can be determined randomly, perhaps by Thing.chooseActionDetails() or something.
    }
};
