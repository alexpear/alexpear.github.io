'use strict';

// A stat block for a certain creature type.
// Later, may want to merge this with WNode classes.

const ActionTemplate = require('./actiontemplate.js');
const TAG = require('../codices/tags.js');
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

// TODO possibly rename to just Template
// since it is use for intermediate representations
// when transforming trees of WNodes to Groups.
class CreatureTemplate {
    constructor () {
        this.tags = [];
        this.actions = [];
        this.resistance = {};
    }

    deepCopy () {
        const copy = Object.assign(new CreatureTemplate(), this);

        // Later make sure that other pointers (eg .peers, .neighbors, .siblings) get deep copied.
        // Could maybe use a addProp()-style func that checks the type of each prop.

        copy.tags = Util.arrayCopy(this.tags);

        copy.actions = this.actions.map(
            action => action.deepCopy()
        );

        copy.resistance = Object.assign({}, this.resistance);

        return copy;
    }

    // Or could name it modifiedBy() potentially
    // Side effect: Transforms other if it is tagged as generating a 'action'
    combinedWith (other) {
        let combinedTemplate = this.deepCopy();

        // (Necessary if the root is a weapon or tool.)
        combinedTemplate.setUpAction();
        other.setUpAction();
        // if 'action' is in this.tags ... just leave it i guess.

        // Note: addProp() unions .actions; it does not overwrite the array.
        combinedTemplate = Object.keys(other)
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

            return aggregation;
        }
    }

    // Check if a template (from WGenerator output) is tagged as one that generates a Action.
    // Typically this would be a tool or weapon.
    // If so, transforms this CreatureTemplate to have a ActionTemplate with the relevant stats.
    // Also removes the old modifiers and tag.
    setUpAction () {
        const actionTagIndex = this.tags && this.tags.indexOf('action');

        if (actionTagIndex >= 0) {
            const action = new ActionTemplate(this.range, this.hit, this.damage);

            delete this.range;
            delete this.hit;
            delete this.damage;

            // Remove the 'action' tag.
            this.tags.splice(actionTagIndex, 1);
        }
    }

    static mergeResistances (a, b) {
        const keys = Util.union(Object.keys(a), Object.keys(b));
        return keys.reduce(
            (merged, key) => {
                merged[key] = (a[key] || 0) + (b[key] || 0);
                return merged;
            },
            {}
        );
    }

    static isCreatureTemplate (template) {
        return template instanceof CreatureTemplate;
    }

    static isActionTemplate (template) {
        return template instanceof ActionTemplate;
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
