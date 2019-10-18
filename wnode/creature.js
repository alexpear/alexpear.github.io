'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Thing = require('./thing.js');

module.exports = class Creature extends Thing {
    constructor (templateName, coord) {
        super(templateName, coord);

        // TODO Take worldState or template as a param, and read the template to init this.hp
        if (! Util.exists(this.hp)) {
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

