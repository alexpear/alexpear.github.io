'use strict';

const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

module.exports = class NodeTemplate {
    constructor (name) {
        this.name = name;

        // TODO: Also should store codex path, to make the name more clear in case of collisions. Shouldnt require much memory since there should be < 300 templates.

        this.id = Util.newId();
        this.tags = [];
    }

    isThing () {
        // Later, a tag inheritance tree can make this smoother.
        return Util.hasOverlap(this.tags, ['thing', 'item', 'weapon', 'gear']) ||
            this.size ||
            this.weight ||
            this.coord ||
            Util.exists(this.sp) ||
            Util.exists(this.active);
    }

    isCreature () {
        return Util.hasOverlap(this.tags, ['creature', 'person', 'character', 'combatant', 'being']) ||
            Util.isArray(this.actions);
    }

    toJson () {
        // Already free of circular reference.
        return this;
    }
}
