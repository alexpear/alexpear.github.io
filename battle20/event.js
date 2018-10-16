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
        this.tags = [];
    }

    addTag (input) {
        const newTags = util.array(input);
        this.tags.push(...newTags);
    }

    withoutCircularReferences (mode) {
        // Idiom for shallow copy.
        const simpleGroup = Object.assign({}, this);

        simpleGroup.actor = simplify(this.actor);
        simpleGroup.targets = this.targets.map(simplify);

        return simpleGroup;

        function simplify (obj) {
            return mode === 'pretty' ?
                obj.toPrettyString() :
                obj.id;
        }
    }
};
