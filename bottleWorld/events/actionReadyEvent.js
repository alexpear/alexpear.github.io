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

        // TODO should this event store string actionType or string actionId?
        this.actionType = actionType;
    }

    resolve (worldState) {
        // TODO Implement.
        // MRB 1: The protagonist takes the action specified by this.actionType
        // Or, as a fallback, creature.actions()[0]
        // This may entail converting from string to CreatureTemplate if protagonist is a string.
        // Should we support both string and obj for this protagonist field? When serializing, we will prefer string. Storing as string seems neat enough...
        // (Edge case: Creature has no actions. Maybe throw error, since ActionReady shouldn't have been called.)
        // Parameters and targets can be determined randomly, perhaps by Thing.chooseActionDetails() or something.

        // TODO: Add clearer notes about what type each field is. It's a little confusing currently.
    }
};
