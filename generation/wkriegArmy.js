'use strict';

// Custom logic on top of WGenerator. Randomly generates WNode trees.

const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

// const Creature = require('../wnode/creature.js');
// const Group = require('../wnode/group.js');
// const Thing = require('../wnode/thing.js');
const WNode = require('../wnode/wnode.js');

const _ = require('lodash');
// LATER will need to use yamlify or something to get FS to work in a browser. 
const FS = require('fs');
const Yaml = require('js-yaml');

const Arsenal = Yaml.safeLoad(
    FS.readFileSync('./codices/sunlight/wkrieg/wiederholungskrieg.yml', 'utf8')
);

const factionWGen = WGenerator.generators['sunlight/wkrieg/faction'];

class WkriegArmy extends WNode {
    constructor () {
        super();

        const faction = factionWGen.getOutputs()[0];
        this.add(faction);

        this.equipWarriors();

        // Util.logDebug('\n' + faction.toPrettyString());
    }

    equipWarriors () {
        // LATER could call a func on each component under military without having to specify their templateNames here.
        const faction = this.findComponent('faction');
        const armory = faction.findComponent('armory');
        const military = faction.findComponent('military');
        const a = military.findComponent('infantry');
        const b = military.findComponent('reserve');

        let aWeaponCopy = _.sample(armory.components).deepCopy();
        a.add(aWeaponCopy);
        let bWeaponCopy = _.sample(armory.components).deepCopy();
        b.add(bWeaponCopy);
    }

    randomWeapon () {
        const chassisName = this.fromAliasTable(Arsenal.weapons.melee, Arsenal.weapons.ranged);
        const weap = new WNode(chassisName);

        const modName = this.fromAliasTable(Arsenal.weaponMods.general);
        weap.add(new WNode(modName));

        // Util.log(`${Util.fromCamelCase(modName)} ${Util.fromCamelCase(chassisName)}`);

        return weap;
    }

    fromAliasTable (tableObj) {
        const outputs = [];

        for (let key in tableObj) {
            const weight = tableObj[key];

            for (let n = 0; n < weight; n++) {
                outputs.push(key);
            }
        }

        return _.sample(outputs);
    }

    static acceptable (combatant) {
        if (combatant.getWeight() > 200) {
            return false;
        }

        if (combatant.traitSum('hands') > 4) {
            // Later exempt thrown weapons and expendable items
            return false;
        }

        return true;
        // check total weight and total size isnt too bulky
        // potentially count chest/back slots as half weight
        // (or try out one abstract numerical representation of weight and bulky size, if this gets too fiddly)
        // check for too many entries in certain slots
        // 3 of a non-expendable item is too many
        // perhaps 3 non-expendable weapons is too many
        // yes but what about Legolas' 2 swords & 1 bow? or 2 pistols & 1 katana?
        // could allow double pistols as a unit.
        /* suggested model
        these are allowable:
        . up to 2 weapon entries
          . a weapon entry is either a weapon, or a matched pair of 1-handed weapons, or a shield and a 1-handed weapon
            . how about 1handed weapon and grappling hook? wrist grapple? torch? flashlight? binoculars? radio? net? reins of a horse? rope?
            . this suggests allowing mismatched pairs of 1handed items.
            . so should i cap it at 4 hands worth of items being the max?
        . various expendable items, such as flintlock pistols or throwing weapons
        . worn items
          . maybe these should be generated after weapons, to adapt when a wrist gun is one of the weapons

        v2:
        . 1 to 4 hands worth of holdable items
          . MRB2: combatant must have at least 1 weapon 

        or maybe only allow up to 2 hands of held items, but allow a Inventory node that can contain lots of various things, up to weight 15kg.


        */
    }

    static weightBasedCombatant () {
        const combatant = WNode.human();
        const maxItems = Util.randomUpTo(5);
        
        for(let i = 0; i < maxItems; i++) {
            const randomTemplate = WkriegArmy.randomWeightBasedItem();
            const newItem = new WNode(randomTemplate);
            combatant.add(newItem);

            if (! WkriegArmy.acceptable(combatant)) {
                // Give up upon invalid addition.
                combatant.components.pop();
                return combatant;
            }
        }

        return combatant;
    }

    static randomWeightBasedItem () {
        return Util.randomWithName(
            Arsenal.componentList
        );
    }

    static test () {
        const node = WkriegArmy.weightBasedCombatant();

        Util.logDebug('\n' + node.toPrettyString(0, true, false));
    }
}

module.exports = WkriegArmy;

WkriegArmy.test();
