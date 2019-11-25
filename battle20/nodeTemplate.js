'use strict';

const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

module.exports = class NodeTemplate {
    constructor (name) {
        this.name = name;
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
}
