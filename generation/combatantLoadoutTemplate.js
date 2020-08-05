'use strict';

// A tree of nodes representing the capabilities of a certain combatant with certain wargear.
// Created because it's fun and in case it's useful to a version of GridWar.
// Each instance of Thing would point to a CLT tree. The tree is analogous to a page in a rulebook profiling this particular type of combatant with this particular loadout.

/*
Group
- primaryTemplate: CLT
  - chassis: 'human'
  - components: 
    - WNode(smg)
      - WNode(electricAmmo)
    - WNode(steelHelmet)
- secondaryTemplate: CLT
  - chassis: 'mainBattleTank'
  - components: []
- leaderTemplate: CLT
  - chassis: 'human'
  - components:
    - WNode(flamingSword)
    - WNode(bionicWings)

.. Hmm maybe i should scrap CombatantLoadoutTemplate class and use WNode for this instead.
.. Maybe i could even use existing codex + WGenerator systems
.. Well, except when i want more complex logic, like balancing the total weight, or perhaps height and min-speed concerns.

Opts
* Add template entries to a new item.js file. Use WGenerator to construct WNode trees representing weapon variants and maybe infantry loadouts.
* Make a new YML representation because that's cooler
  * Perhaps get WGenerator to parse the YML template entries like it parses the txt ones now.
  * Maybe make it a big YML, for the templates of the whole universe


*/

const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

class CombatantLoadoutTemplate {
    // constructor (name, tags) {
    //     super(name);

    //     this.tags = tags || [];
    //     this.actions = [];
    //     this.resistance = {};
    // }

    // deepCopy () {
    //     const copy = Object.assign(new CreatureTemplate(), this);

    //     // Later make sure that other pointers (eg .peers, .neighbors, .siblings) get deep copied.
    //     // Could maybe use a addProp()-style func that checks the type of each prop.

    //     copy.tags = Util.arrayCopy(this.tags);

    //     copy.actions = this.actions.map(
    //         action => action.deepCopy()
    //     );

    //     copy.resistance = Object.assign({}, this.resistance);

    //     return copy;
    // }

    // // Or could name it modifiedBy() potentially
    // // Side effect: Transforms other if it is tagged as generating a 'action'
    // combinedWith (other) {
    //     let combinedTemplate = this.deepCopy();

    //     // (Necessary if the root is a weapon or tool.)
    //     combinedTemplate.setUpAction();
    //     other.setUpAction();

    //     combinedTemplate.actions = Util.union(combinedTemplate.actions, other.actions);
    //     combinedTemplate.applyActionModifiers(other);

    //     Util.log(`Combining '${this.templateName}' with '${other.templateName}'.`, 'debug');

    //     // Note: addProp() unions .actions; it does not overwrite the array.
    //     combinedTemplate = Object.keys(other)
    //         .reduce(
    //             addProp,
    //             combinedTemplate
    //         );

    //     return combinedTemplate;

    //     function addProp (aggregation, key) {
    //         if (CreatureTemplate.UNCOPIED_KEYS.includes(key)) {
    //             return aggregation;
    //         }

    //         const existingValue = aggregation[key];
    //         const otherValue = other[key];

    //         if (Util.isArray(otherValue)) {
    //             // eg other.tags or other.actions
    //             // Later: We actually might not want item tags to propogate all the way up to Group.
    //             // For example, should a squad of soldiers (Group) have tag 'armor'?
    //             aggregation[key] = Util.union(existingValue, otherValue);
    //         }
    //         else if (Util.isNumber(otherValue)) {
    //             Util.log(`addProp() / isNumber(): key = '${key}', ${existingValue} (old) + ${otherValue} (new)`, 'debug');

    //             // Interpreted as modifiers, not absolute stats.
    //             aggregation[key] = (existingValue || 0) + (otherValue || 0);

    //             throw new Error(`debug throwing intentionally, to see when this gets called: this is ${this} and this.name is ${this && this.name}`);
    //         }
    //         else if (Util.isObject(otherValue)) {
    //             // eg other.resistance
    //             aggregation[key] = CreatureTemplate.mergeResistances(existingValue || {}, otherValue);
    //         }
    //         else if (Util.exists(otherValue)) {
    //             // Overwrite
    //             aggregation[key] = otherValue;
    //         }
    //         else {
    //             throw new Error(`Mysterious key '${ key }' in child WNode when combining templates of WNode tree. Value is: ${ Util.stringify(otherValue) }`);
    //         }

    //         return aggregation;
    //     }
    // }

    // // Check if a template (from WGenerator output) is tagged as one that generates a Action.
    // // Typically this would be a tool or weapon.
    // // If so, transforms this CreatureTemplate to have a ActionTemplate with the relevant stats.
    // // Also removes the old modifiers and tag.
    // setUpAction () {
    //     const actionTagIndex = this.tags && this.tags.indexOf('action');

    //     if (actionTagIndex >= 0) {
    //         // Later, consider this: If the template is tagged 'action', we could just transform it into a action template entirely.
    //         // ie, const action = this.deepCopy()
    //         // action.removeActionTag()
    //         // this.actions.push(action);
    //         // delete all keys of 'this' except this.actions

    //         // Remove the 'action' tag.
    //         this.tags.splice(actionTagIndex, 1);

    //         const action = new ActionTemplate(this.name, this.range, this.hit, this.damage, this.shotsPerSecond);

    //         action.tags = Util.arrayCopy(this.tags);
    //         this.tags = [];
    //         this.actions.push(action);

    //         delete this.range;
    //         delete this.hit;
    //         delete this.damage;
    //         delete this.shotsPerSecond;
    //     }
    // }

    // // Helper function when combining templates.
    // // Side effects: Modifies 'this'.
    // applyActionModifiers (other) {
    //     // If action properties are present after setUpAction(),
    //     // then assume they should modify other.actions and not the creature template itself.
    //     const modifierKeys = ['range', 'hit', 'damage'].filter(
    //         key => Util.exists(other[key])
    //     );

    //     if (modifierKeys.length >= 1) {
    //         modifierKeys.forEach(
    //             key => {
    //                 other.actions.forEach(
    //                     action => {
    //                         action[key] += other[key];
    //                     }
    //                 );

    //                 delete other[key];
    //             }
    //         );
    //     }
    // }

    // static fromRaw (tableRaw) {
    //     const creatureTemplate = new CreatureTemplate();

    //     tableRaw.split('\n')
    //         .slice(1)
    //         .map(
    //             line => {
    //                 const parsed = CreatureTemplate.parseTemplateLine(line);
    //                 const key = parsed.key;

    //                 if (
    //                     key in creatureTemplate &&
    //                     ! ['tags', 'actions', 'resistance'].includes(key)
    //                 ) {
    //                     throw new Error(`fromRaw(): duplicate key '${ key }' in line '${ line }'. Full template is as follows:\n${ tableRaw }`);
    //                 }

    //                 creatureTemplate[key] = parsed.value;

    //                 // Util.log(`in parseTemplate(). Just wrote key/value pair {${key}: ${parsed.value}}`, 'debug');
    //             }
    //         );

    //     creatureTemplate.name = CreatureTemplate.templateKey(tableRaw);
    //     creatureTemplate.setUpAction();

    //     return creatureTemplate;
    // }

    // static parseTemplateLine (line) {
    //     line = line.trim();

    //     const colonIndex = line.indexOf(':');

    //     if (colonIndex < 0) {
    //         throw new Error(`parseTemplateLine(): No colon found in ${ line }`);
    //     }

    //     const key = line.slice(0, colonIndex)
    //         .trim();
    //     const rest = line.slice(colonIndex + 1)
    //         .trim();

    //     let value;
    //     if (key === 'tags') {
    //         value = rest.split(/\s/);
    //     }
    //     else if (key === 'resistance') {
    //         value = {};

    //         const entries = rest.split(',');

    //         entries.forEach(
    //             e => {
    //                 const parts = e.trim()
    //                     .split(/\s/);
    //                 const resistanceKey = parts[0];
    //                 const modifier = Number(parts[1]);

    //                 value[resistanceKey] = modifier;
    //             }
    //         );
    //     }
    //     else if (rest === 'true') {
    //         value = true;
    //     }
    //     else if (rest === 'false') {
    //         value = false;
    //     }
    //     else {
    //         // number case.
    //         const parsed = Number(rest);

    //         value = Util.exists(parsed) ?
    //             parsed :
    //             rest;

    //         // Util.log(`in parseTemplateLine( '${line}' ). value is ${value}.`, 'debug');
    //     }

    //     return {
    //         key: key,
    //         value: value
    //     };
    // }

    // static templateKey (tableRaw) {
    //     const START = 'template ';
    //     const startIndex = tableRaw.indexOf(START);
    //     const endIndex = tableRaw.indexOf('\n');

    //     return tableRaw.slice(startIndex + START.length, endIndex)
    //         .trim();
    // }

    // static mergeResistances (a, b) {
    //     const keys = Util.union(Object.keys(a), Object.keys(b));
    //     return keys.reduce(
    //         (merged, key) => {
    //             merged[key] = (a[key] || 0) + (b[key] || 0);
    //             return merged;
    //         },
    //         {}
    //     );
    // }

    // // static isCreatureTemplate (template) {
    // //     return template instanceof CreatureTemplate;
    // // }

    // static example () {
    //     return CreatureTemplate.marineExample();
    // }

    // static marineExample () {
    //     const template = new CreatureTemplate();
    //     template.name = 'marinePrivate';

    //     // UNSC Marine (Halo)
    //     template.tags = [
    //         TAG.Human,
    //         TAG.Soldier,
    //         TAG.Tech10,
    //         TAG.UNSC
    //     ];

    //     template.size = SIZE.Medium;
    //     template.sp = 30;
    //     template.defense = 16;
    //     template.alignment = 'UNSC';
    //     template.actions = [
    //         ActionTemplate.gunExample()
    //     ];

    //     template.resistance = {};
    //     template.resistance[TAG.Fire] = 1;
    //     template.resistance[TAG.Piercing] = 1;
    //     template.resistance[TAG.Impact] = 1;

    //     return template;
    // }

    // static dwarfExample () {
    //     const template = new CreatureTemplate();
    //     template.name = 'dwarfAxeThrower';

    //     // Dwarf Axe Thrower
    //     template.tags = [
    //         TAG.Dwarf,
    //         TAG.Humanoid,
    //         TAG.Soldier
    //     ];

    //     template.size = SIZE.Small;
    //     template.sp = 20;
    //     template.defense = 17;
    //     tepmlate.alignment = 'CG';
    //     template.actions = [
    //         ActionTemplate.example()
    //     ];

    //     template.resistance = {};
    //     template.resistance[TAG.Mental] = 1;
    //     template.resistance[TAG.Piercing] = 1;
    //     template.resistance[TAG.Blade] = 1;
    //     template.resistance[TAG.Impact] = 1;

    //     return template;
    // }
}

module.exports = CombatantLoadoutTemplate;
