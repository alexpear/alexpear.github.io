'use strict';

const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

class ActionTemplate {
    constructor () {
        this.tags = [];
    }

    modifiedBy (modifications) {
        const combinedTemplate = new ActionTemplate();

        combinedTemplate.range = this.range + (modifications.range || 0);
        combinedTemplate.hit = this.hit + (modifications.hit || 0);
        combinedTemplate.damage = this.damage + (modifications.damage || 0);
        combinedTemplate.tags = Util.union(this.tags, modifications.tags);

        return combinedTemplate;
    }

    static example () {
        const template = new ActionTemplate();

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
};

module.exports = ActionTemplate;
