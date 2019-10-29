'use strict';

const NodeTemplate = require('./nodeTemplate.js');
const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

class ActionTemplate extends NodeTemplate {
    constructor (name, range, hit, damage) {
        super(name);

        this.id = Util.newId();
        this.tags = [];
        this.range = range || 1;
        this.hit = hit || 0;
        this.damage = damage || 0;
    }

    // Later make a superclass version of this func.
    deepCopy () {
        const copy = Object.assign(new ActionTemplate(), this);

        copy.tags = Util.arrayCopy(this.tags);

        return copy;
    }

    modifiedBy (modifications) {
        const combinedTemplate = new ActionTemplate();

        combinedTemplate.range = this.range + (modifications.range || 0);
        combinedTemplate.hit = this.hit + (modifications.hit || 0);
        combinedTemplate.damage = this.damage + (modifications.damage || 0);
        combinedTemplate.tags = Util.union(this.tags, modifications.tags);

        return combinedTemplate;
    }

    isAttack () {
        return this.damage > 0;
    }

    isRanged () {
        return this.range > 1;
    }

    static example () {
        return ActionTemplate.dwarfExample();
    }

    static dwarfExample () {
        const template = new ActionTemplate('throwingAxe');

        // Range is in meters. It is okay to round it heavily.
        template.range = 10;
        template.hit = 4;
        template.damage = 1;

        // Dwarven throwing axe
        template.tags = [
            TAG.Dwarf,
            TAG.Blade,
            TAG.Projectile
        ];

        return template;
    }

    static soldierExample () {
        const template = new ActionTemplate('assaultRifle');

        template.shotsPerSecond = 10;
        // Range is in meters. It is okay to round it heavily.
        template.range = 40;
        template.hit = 3;
        template.damage = 2;

        // UNSC assault rifle
        template.tags = [
            TAG.Bullet,
            TAG.RapidFire
        ];

        return template;
    }
};

module.exports = ActionTemplate;
