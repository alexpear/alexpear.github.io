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

    static getTemplate (metatemplateName, sizeClass) {
        const metatemplates = {
            building: {
                minSC: 2,
                maxSC: 14,
                multipliers: {
                    speed: 0
                },
            },
            wheeled: {
                minSC: 0,
                maxSC: 7,
                multipliers: {
                    speed: 20
                },
            },
            walker: {
                minSC: 1,
                maxSC: 8,
            },
            flier: {
                minSC: 0,
                maxSC: 6,
                multipliers: {
                    speed: 100
                },
            },
            hover: {
                minSC: 0,
                maxSC: 16,
                multipliers: {
                    speed: 20
                },
            },
            waterShip: {
                minSC: 1,
                maxSC: 8,
                multipliers: {
                    speed: 2
                },
            },
            spaceStation: {
                minSC: 5,
                maxSC: 40,
                multipliers: {
                    speed: 0
                },
            },
            organicWalker: {
                minSC: 0,
                maxSC: 12,
            },
        };

        const mt = metatemplates[metatemplateName || 'wheeled'];
        mt.type = 'vehicle';

        // TODO also we want support for nonchassis templates, such as 'railgun'.
        //could just put the type field into every metatemplate

        sizeClass = Util.constrain(sizeClass, mt.minSC, mt.maxSC);

        const size = Math.pow(sizeClass, 2);

        const template = {
            size: size,
            weight: Math.pow(size / 4, 3),
            speed: size,
            powerOutput: size,
            durability: size * 10,
        };

        if (! mt.multipliers) {
            return template;
        }

        for (let prop in mt.multipliers) {
            template[prop] = template[prop] * mt.multipliers[prop];
        }

        return template;
    }

    static acceptable (combatant) {
        if (combatant.getWeight() > 200) {
            return false;
        }

        if (combatant.traitSum('hands') > 2) {
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

        const maxItems = 1 + Util.randomUpTo(3);
        
        for(let i = 0; i < maxItems; i++) {
            const randomTemplate = WkriegArmy.randomWeightBasedItemTemplate();
            const newItem = new WNode(randomTemplate);
            combatant.add(newItem);

            if (! WkriegArmy.acceptable(combatant)) {
                // Give up upon invalid addition.
                combatant.components.pop();
                break;
            }
        }

        // Plus one carried item, in a sling holster or pack.
        const item = new WNode(
            WkriegArmy.randomWeightBasedItemTemplate()
        );

        const inventory = new WNode('back');
        inventory.add(item);
        // combatant.add(inventory);

        return combatant;
    }

    static randomWeightBasedItemTemplate () {
        return Util.randomWithName(
            Arsenal.componentList
        );
    }

    static testWeightBased () {
        const node = WkriegArmy.weightBasedCombatant();

        const agBonus = Util.round(
            Math.max(120 - node.getWeight(), 0)
        );

        const bonus = `Agility: ${'█'.repeat(agBonus)}`;

        Util.logDebug('\n' + node.toPrettyString(0, true, false) + bonus);
    }

    static test () {
        WkriegArmy.testWeightBased();
        WkriegArmy.testWeightBased();
        WkriegArmy.testWeightBased();
        WkriegArmy.testWeightBased();
        WkriegArmy.testWeightBased();
    }
}

module.exports = WkriegArmy;

WkriegArmy.test();
