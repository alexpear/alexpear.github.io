// 

const Entity = require('./entity.js');
const EntityType = require('./entityType.js');
const Template = require('./template.js');

const Util = require('../../../util/util.js');

class Item extends Entity {
    constructor(template) {
        super(template);

        this.entityType = EntityType.ITEM;
    }

    // toString () {
    //     const templateString = Util.capitalized(this.template.name);

    //     return `${templateString}`;
    // }

    // Omit name if item.
    displayName () {
        return;
    }

    static random () {
        return new Item(
            Template.randomItem()
        );
    }

    static randomWeapon () {
        const item = new Item(
            Template.randomPrimary()
        );

        const modCount = Util.randomUpTo(1);

        for (let i = 0; i < modCount; i++) {
            item.has.push(Item.randomUpgrade());
        }

        return item;
    }

    static randomUpgrade () {
        return new Item(
            Template.randomUpgrade()
        );
    }
}

module.exports = Item;
