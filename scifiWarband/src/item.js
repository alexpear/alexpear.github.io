'use strict';

//

const Templates = require('./templates.js');
const Util = require('../../util/util.js');

class Item {
    constructor (template) {
        this.id = Util.uuid();
        this.template = template;
    }

    toJson () {
        return this;
    }

    static example () {
        const item = new Item(
            Templates.Halo.UNSC.Item.SMG
        );

        return item;
    }
}

module.exports = Item;
