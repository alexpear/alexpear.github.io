'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Thing = require('./thing.js');

// Later i may decide to move this class into the bottleWorld/ dir, if it doesnt feel generic enough for the wnode/ dir.
module.exports = class Creature extends Thing {
    constructor (template, coord) {
        super(template, coord);

        // TODO Take worldState or template as a param, and read the template to init this.hp

        if (! Util.exists(this.hp)) {
            // LATER rename to sp, Stamina Points.
            this.hp = 1;
        }
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

