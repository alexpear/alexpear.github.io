'use strict';

//

const Templates = require('./templates.js');
const Util = require('../../util/util.js');

// LATER could make class Component, superclass of Item, Creature, Squad, & Company.
class Item {
    constructor (template) {
        this.id = Util.uuid();
        this.template = template;
    }

    toJson () {
        return this;
    }

    name () {
        return this.template.name; // + ' ' + Util.shortId(this.id);
    }

    static example () {
        const item = new Item(
            Templates.Halo.UNSC.Item.SMG
        );

        return item;
    }
}

module.exports = Item;
