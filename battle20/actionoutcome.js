'use strict';

const util = require('../util/util.js');

// We save one of these for every turn taken inside encounters.
module.exports = class ActionOutcome {
    constructor (actor, targets, actionType) {
        this.actor = actor;
        this.targets = util.array(targets);
        this.type = actionType || 'unknown';
        this.changes = {};
    }
};
