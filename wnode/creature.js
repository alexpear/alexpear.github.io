'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Thing = require('./thing.js');

// Later i may decide to move this class into the bottleWorld/ dir, if it doesnt feel generic enough for the wnode/ dir.
module.exports = class Creature extends Thing {
    constructor (template, coord, alignment) {
        super(template, coord);

        // Util.logDebug(`Creature constructor, after super(). template param is ${template}. this.template.actions.length is ${this.template && this.template.actions.length}`);

        // Init stamina points
        this.sp = this.template && this.template.maxSp || 1;

        // Faction or temperament
        this.alignment = alignment;
    }

    actions (worldState) {
        const template = this.template ||
            (worldState && worldState.glossary[this.templateName]);

        return template ?
            template.actions :
            [];
    }

    actionFromId (id) {
        return this.actions().find(
            action => action.id === id
        );
    }

    chooseTarget (worldState, actionTemplate) {
        const nonAllies = worldState.thingsWithout(
            {
                alignment: this.alignment
            }
        );

        return Util.randomOf(nonAllies);
    }
};
