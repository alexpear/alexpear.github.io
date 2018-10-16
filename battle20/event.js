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



        // const COMPLEX_FIELDS = [
        //     'actor',
        //     'targets'
        // ];

        // for (let key in this) {
        //     const originalValue = this[key];

        //     if (COMPLEX_FIELDS.includes(key)) {
        //         simpleGroup[key] = mode === 'pretty' ?
        //             originalValue.toPrettyString() :
        //             originalValue.id;
        //     }
        //     else {
        //         simpleGroup[key] = originalValue;
        //     }
        // }

        // return simpleGroup;
    }
};
