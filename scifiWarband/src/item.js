'use strict';

// Physical items such as weapons, tools, armor.

const Component = require('./component.js');
const Templates = require('./templates.js');
const Util = require('../../util/util.js');

class Item extends Component {
    constructor (template) {
        super();
        this.template = template;
    }

    toJson () {
        return {
            id: this.id,
            template: this.template,
            type: this.constructor.name,
            parentId: this?.parent?.id,
        };
    }

    name () {
        return this.template.name; // + ' ' + Util.shortId(this.id);
    }

    type () {
        return this.constructor.name;
    }

    static example () {
        const item = new Item(
            Templates.Halo.UNSC.Item.SMG
        );

        return item;
    }
}

module.exports = Item;
