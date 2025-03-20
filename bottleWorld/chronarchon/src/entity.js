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
        this.name = Covonym.random();
    }

    toString () {

    }

    draw () {

    }

    static example () {
        const entity = new Entity();



        return entity;
    }
}

module.exports = Entity;
