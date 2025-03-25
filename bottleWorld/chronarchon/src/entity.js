// A being, group, place, thing, or trait within the game world.

const Covonym = require('../../textGen/src/namegen/covonym.js');
const EntityType = require('./entityType.js');
const Util = require('../../util/util.js');

class Entity {
    constructor(type) {
        if (! type) {
            return Util.error('Entity must have a type.');
        }

        this.type = type;
        // this.template
        this.level = 1;
        this.name = Covonym.random();
        this.id = Util.uuid();
    }

    toString () {
        const typeString = Util.capitalize(this.type);

        return `${this.name} (Level ${this.level} ${typeString})`;
    }

    draw () {

    }

    static example () {
        const entity = new Entity(EntityType.CREATURE);



        return entity;
    }
}

module.exports = Entity;
