'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Thing = require('./thing.js');

// Later i may decide to move this class into the bottleWorld/ dir, if it doesnt feel generic enough for the wnode/ dir.
module.exports = class Creature extends Thing {
    constructor (template, coord) {
        super(template, coord);

        // Init stamina points
        this.sp = this.template && this.template.maxSp || 1;
    }

    actions (worldState) {
        const template = worldState.glossary[this.templateName];

        return template ?
            template.actions :
            [];
    }

    actionFromId (id) {
        return this.actions().find(
            action => action.id === id
        );
    }
};

