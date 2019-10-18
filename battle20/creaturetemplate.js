'use strict';

// A stat block for a certain creature type.
// Later, may want to merge this with WNode classes.

const ActionTemplate = require('./actiontemplate.js');
const NodeTemplate = require('./nodeTemplate.js');
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

// Note that currently this is confusingly used for intermediate representations
// when transforming trees of WNodes to Groups.
class CreatureTemplate extends NodeTemplate {
    constructor () {
        super();

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

        combinedTemplate.actions = Util.union(combinedTemplate.actions, other.actions);
        combinedTemplate.applyActionModifiers(other);

        Util.log(`Combining '${this.templateName}' with '${other.templateName}'.`, 'debug');

        // Note: addProp() unions .actions; it does not overwrite the array.
        combinedTemplate = Object.keys(other)
            .reduce(
                addProp,
                combinedTemplate
            );

        return combinedTemplate;

        function addProp (aggregation, key) {
            if (CreatureTemplate.UNCOPIED_KEYS.includes(key)) {
                return aggregation;
            }

            const existingValue = aggregation[key];
            const otherValue = other[key];

            if (Util.isArray(otherValue)) {
                // eg other.tags or other.actions
                // Later: We actually might not want item tags to propogate all the way up to Group.
                // For example, should a squad of soldiers (Group) have tag 'armor'?
                aggregation[key] = Util.union(existingValue, otherValue);
            }
            else if (Util.isNumber(otherValue)) {
                Util.log(`addProp() / isNumber(): key = '${key}', ${existingValue} (old) + ${otherValue} (new)`, 'debug');

                // Interpreted as modifiers, not absolute stats.
                aggregation[key] = (existingValue || 0) + (otherValue || 0);
            }
            else if (Util.isObject(otherValue)) {
                // eg other.resistance
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
            // Later, consider this: If the template is tagged 'action', we could just transform it into a action template entirely.
            // ie, const action = this.deepCopy()
            // action.removeActionTag()
            // this.actions.push(action);
            // delete all keys of 'this' except this.actions

            // Remove the 'action' tag.
            this.tags.splice(actionTagIndex, 1);

            // Later, can put a name from the codex in the name param, instead of newId()
            const action = new ActionTemplate(Util.newId(), this.range, this.hit, this.damage);
            action.tags = Util.arrayCopy(this.tags);
            this.tags = [];
            this.actions.push(action);

            delete this.range;
            delete this.hit;
            delete this.damage;
        }
    }

    // Helper function when combining templates.
    // Side effects: Modifies 'this'.
    applyActionModifiers (other) {
        // If action properties are present after setUpAction(),
        // then assume they should modify other.actions and not the creature template itself.
        const modifierKeys = ['range', 'hit', 'damage'].filter(
            key => Util.exists(other[key])
        );

        if (modifierKeys.length >= 1) {
            modifierKeys.forEach(
                key => {
                    other.actions.forEach(
                        action => {
                            action[key] += other[key];
                        }
                    );

                    delete other[key];
                }
            );
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

    // static isCreatureTemplate (template) {
    //     return template instanceof CreatureTemplate;
    // }

    static example () {
        return CreatureTemplate.dwarfExample();
    }

    static soldierExample () {
        const template = new CreatureTemplate();

        // UNSC Marine (Halo)
        template.tags = [
            TAG.Human,
            TAG.Soldier,
            TAG.Tech10,
            TAG.UNSC
        ];

        template.size = SIZE.Medium;
        template.hp = 3;
        template.defense = 16;
        template.actions = [
            ActionTemplate.soldierExample()
        ];

        template.resistance = {};
        template.resistance[TAG.Fire] = 1;
        template.resistance[TAG.Piercing] = 1;
        template.resistance[TAG.Impact] = 1;

        return template;
    }

    static dwarfExample () {
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

// These are not copied over when combining templates.
CreatureTemplate.UNCOPIED_KEYS = [
    'templateName'
];

module.exports = CreatureTemplate;
