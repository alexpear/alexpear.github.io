'use strict';

// A stat block for a certain creature type.
// Later, may want to merge this with WNode classes.

const ActionTemplate = require('./actiontemplate.js');
const Util = require('../util/util.js');

// Later store these enums in another file
const SIZE = {
    Tiny: 0.5,
    Small: 0.7,
    Medium: 1,
    Large: 2,
    Huge: 3,
    Gargantuan: 4,
    Colossal: 6
};

// TODO replace with tag.js
const TAG = {
    Humanoid: 'humanoid',
    Human: 'human',
    Dwarf: 'dwarf',
    Elf: 'elf',
    Soldier: 'soldier',
    Blade: 'blade',
    Projectile: 'projectile'
};

// TODO possibly rename to just Template
// since it is use for intermediate representations
// when transforming trees of WNodes to Groups.
class CreatureTemplate {
    constructor () {
        this.tags = [];
        this.actions = [];
        this.resistance = {};
    }

    // Or could name it modifiedBy() potentially
    combinedWith (other) {
        const combinedTemplate = new CreatureTemplate();

        if (other.tags && other.tags.includes('action')) {

        }

        const TODO = other.keys()
            .reduce(
                addProp,
                combinedTemplate
            );

        return combinedTemplate;

        function addProp (aggregation, key) {
            const existingValue = aggregation[key];
            const otherValue = other[key];

            if (Util.isArray(otherValue)) {
                aggregation[key] = Util.union(existingValue, otherValue);
            }
            else if (Util.isNumber(otherValue)) {
                // TODO: if aggregation will have actions, and key is range, hit, or damage, then the prop should be applied to all of aggregation's actions, not to the aggregation template itself.
                // For example, a WNode that modifies a weapon might want to apply +1 hit to its Action.
                // This may necessitate processing number props last... possibly.
                aggregation[key] = (existingValue || 0) + (otherValue || 0);
            }
            else if (Util.isObject(otherValue)) {
                // eg 'resistance' object
                aggregation[key] = CreatureTemplate.mergeResistances(existingValue || {}, otherValue);
            }
            else if (Util.exists(otherValue)) {
                // Overwrite
                aggregation[key] = otherValue;
            }
            else {
                throw new Error(`Mysterious key '${ key }' in child WNode when combining templates of WNode tree. Value is: ${ Util.stringify(otherValue) }`);
            }


        }
    }

    static mergeResistances (a, b) {
        const keys = Util.union(a.keys(), b.keys());
        return keys.reduce(
            (merged, key) => {
                merged[key] = (a[key] || 0) + (b[key] || 0);
                return merged;
            },
            {}
        );
    }

    static isCreatureTemplate (template) {
        // TODO
    }

    static isActionTemplate (template) {
        // TODO
    }

    static example () {
        const template = new CreatureTemplate();

        // Dwarf Axe Thrower
        template.tags = [
            TAG.Dwarf,
            TAG.Humanoid,
            TAG.Soldier
        ];

        template.size = SIZE.Small;
        template.hp = 3;
        template.defense = 17;
        template.actions = [
            ActionTemplate.example()
        ];

        template.resistance = {};
        template.resistance[TAG.Mental] = 1;
        template.resistance[TAG.Piercing] = 1;
        template.resistance[TAG.Blade] = 1;
        template.resistance[TAG.Impact] = 1;

        return template;
    }
}

module.exports = CreatureTemplate;
