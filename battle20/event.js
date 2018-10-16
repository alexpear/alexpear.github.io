'use strict';

const util = require('../util/util.js');

// We save at least one of these every time the world's state could change,
// and every time something happens that could trigger other things.
// Worry about memory efficiency only when it becomes a problem.
module.exports = class Event {
    constructor (actor, targets, actionType) {
        this.actor = actor;
        this.targets = util.array(targets);
        this.type = actionType || 'unknown';
        this.changes = {};
    }
};
