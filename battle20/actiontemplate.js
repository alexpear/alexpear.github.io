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

    secondsUntilNextAction () {
        if (
            ! Util.exists(this.shotsPerSecond) ||
            this.shotsPerSecond <= 1
        ) {
            return 1;
        }

        // Yes, this is approximate. It's okay for now that a rate of 0.9 is treated the same as 0.5.
        return Math.ceil(
            1 / this.shotsPerSecond
        );
    }

    static example () {
        return ActionTemplate.dwarfExample();
    }

    static dwarfExample () {
        const template = new ActionTemplate('throwingAxe');

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

    static gunExample () {
        const template = new ActionTemplate('dmr');

        // Later maybe rename to a more generic phrase like 'rate'.
        // Can be less than 1:
        template.shotsPerSecond = 2;

        // Range is in meters. It is okay to round it heavily.
        template.range = 80;
        template.hit = 5;
        template.damage = 24;

        // UNSC designated mark rifle
        template.tags = [
            TAG.Bullet,
            TAG.Firearm
        ];

        return template;
    }
};

module.exports = ActionTemplate;
