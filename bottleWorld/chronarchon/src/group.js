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

        // 1 weapon & 0-1 extra items.
        g.has.push(Item.randomWeapon());

        const extraItemCount = Util.randomUpTo(1);

        for (let i = 0; i < extraItemCount; i++) {
            g.has.push(Item.random());
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
