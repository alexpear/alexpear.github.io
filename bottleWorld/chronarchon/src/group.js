// An individual or homogenous group of creatures. 

const Entity = require('./entity.js');
const EntityType = require('./entityType.js');
const Template = require('./template.js');

const Covonym = require('../../../textGen/src/namegen/covonym.js');
const Util = require('../../../util/util.js');

class Group extends Entity {
    constructor(template, quantity = 1) {
        super(EntityType.GROUP);

        this.template = template;
        this.quantity = quantity;

        this.attitude = Group.randomAttitude();
    }

    static random () {
        return new Group(
            Template.randomGroup(),
            Util.randomUpTo(3),
        );

        // LATER also generate traits & items
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
}

Entity.ATTITUDE = Util.makeEnum([
    'selfish',
    'isolationist',
    'worldly', //'ecumenical',
    'interventionist', //'xenophobic',
]);

module.exports = Group;
