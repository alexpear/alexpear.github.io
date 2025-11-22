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

    draw (div, cssClass) {
        div.appendChild(
            Util.htmlElement(
                'img',
                {
                    src: `images/${ this.template.name }.png`,
                    class: cssClass,
                }
            )
        );
    }

    static random () {
        return new Item(
            Template.randomItem()
        );
    }

    static randomExcept (tagString) {
        tagString = tagString.toLowerCase()
            .split(/\s+/);

        // Util.logDebug({
        //     tagString,
        //     includes: tagString.includes('weapon'),
        //     filtered: Template.allItems()
        //         .filter(item => ! item.tags?.some(
        //             tag => tagString.includes(tag)
        //         )),
        // });

        return new Item(
            Util.randomOf(
                Template.allItems()
                    .filter(item => ! item.tags?.some(
                        tag => tagString.includes(tag)
                    ))
            )
        );
    }

    static async randomWeapon () {
        const item = new Item(
            await Template.randomPrimary()
        );

        if (item.template.upgradeable === false) return item;

        const modCount = Util.randomUpTo(1);

        for (let i = 0; i < modCount; i++) {
            item.addRandomUpgrade();
        }

        return item;
    }

    addRandomUpgrade () {
        this.has.push(
            new Item(
                Util.randomOf(
                    Template.allItems()
                        .filter(
                            template => {
                                if (! template.tags || ! template.tags.includes('upgrade')) return false;
                                
                                if (template.attachTo) {
                                    return Util.hasOverlap(this.tags, template.attachTo);
                                }

                                return true;
                            }
                        )
                )
            )
        )
    }

    static randomUpgrade () {
        return new Item(
            Template.randomUpgrade()
        );
    }
}

module.exports = Item;
