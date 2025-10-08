// An individual or homogenous group of creatures. 
// For futureproofing & to permit users to make islands with different rules, representing individuals as Groups of quantity 1 is recommended.

const Entity = require('./entity.js');
const EntityType = require('./entityType.js');
const Item = require('./item.js');
const Template = require('./template.js');

const Covonym = require('../../../textGen/src/namegen/covonym.js');
const Util = require('../../../util/util.js');

class Group extends Entity {
    constructor(template, quantity) {
        super(EntityType.GROUP);

        this.template = template;
        this.quantity = quantity ?? template?.quantity ?? 1;
        this.stamina = template?.stamina ?? 10;
        this.attack = template?.attack ?? 2;
        this.actionsLeft = 1;

        this.attitude = Group.randomAttitude();
    }

    static random () {
        const g = new Group(
            Template.randomGroup(),
        );

        // TODO constrain to drawable items.

        // 1 weapon & 0-1 extra items.
        const primary = Item.randomWeapon();
        g.has.push(primary);

        if (primary.template.hands === 1) {
            g.has.push(
                new Item (
                    Template.randomXHanded(1)
                )
            );
        }

        const extraItemCount = 1 + Util.randomUpTo(1);

        for (let i = 0; i < extraItemCount; i++) {
            g.has.push(Item.randomExcept('weapon upgrade'));
        }

        return g;
    }

    static randomAttitude () {
        return Util.randomOf(Object.values(Entity.ATTITUDE));
    }

    static example () {
        return new Group(
            Template.example(),
            1,
        );
    }

    // toString () {

    // }

    nameReadout () {
        return `${this.displayName()} • `;
    }

    levelReadout () {
        return ` • level ${this.level()}`;
    }

    draw (div) {
        Util.clearHtmlChildren(div);

        div.appendChild(
            Util.htmlElement(
                'img',
                {
                    src: `images/${ this.template.name }.png`,  
                },
            )
        );

        this.primaryHeld()?.draw(div);
        this.secondaryHeld()?.draw(div, 'leftie');

        div.appendChild(
            Util.htmlElement(
                'img',
                {
                    src: 'images/handright.png',
                },
            )
        );
    }

    // The ordering of this.has defines which items are held in the primary & secondary hands.
    primaryHeld () {
        return this.findXthItem(1);
    }

    secondaryHeld () {
        return this.findXthItem(2);
    }

    findXthItem (xth) {
        let seen = 0;
        for (const item of this.has) {
            if (item.template.tags?.includes('primary')) {
                seen++;

                if (seen >= xth) {
                    return item;
                }
            }
        }
    }

    static testDuel () {
        const a = Group.example();
        const b = Group.example();
        let t = 0;
        const turnOrder = [a, b];

        while (a.stamina > 0 && b.stamina > 0) {


            t++;
        }

        Util.log({
            aStamina: a.stamina,
            bStamina: b.stamina,
            t,
        });
    }
}

Entity.ATTITUDE = Util.makeEnum([
    'selfish',
    'isolationist',
    'worldly', //'ecumenical',
    'interventionist', //'xenophobic',
]);

module.exports = Group;
