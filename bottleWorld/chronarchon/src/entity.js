// A being, group, place, thing, or trait within the game world.

const EntityType = require('./entityType.js');
const Covonym = require('../../../textGen/src/namegen/covonym.js');
const Util = require('../../../util/util.js');

class Entity {
    constructor(template) { 
        if (! template) {
            return Util.error('Entity must have a template.');
        }

        this.template = template;
        this.has = []; // Array of items and/or traits
        this.name = Covonym.random(1000);
        this.id = Util.uuid();
        // this.home = // groups & items have places of origin // LATER
    }

    toString () {
        const templateString = Util.capitalize(this.template);

        return `${this.name} (Level ${this.level()} ${templateString})`;
    }

    // Can return undefined, for example many items will.
    alignment () {
        return this.template.alignment;
    }

    level () {
        return Math.log2(this._impactRating());
    }

    // Internal representation of the entity's capacity to impact the story.
    _impactRating () {
        const impactOfSelf = Math.pow(2, this.template.level || 0);
        
        const impactOfChildren = Util.sum(
            this.has.map(
                child => child._impactRating()
            )
        );

        const quantity = this.quantity || 1;

        return quantity * (impactOfSelf + impactOfChildren);
    }
    
    draw () {

    }
}

module.exports = Entity;
