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

    // Might want later: func that returns filtered subset of the metatemplates obj - which is currently in getTemplate()
    // Useful for selecting a random component metatemplate, etc.
    // static metatemplateSubset (category) {
    //     const metatemplates = {
    //         // Or maybe separate objs for chassis, component, and ammo modifiers
    //         // Could potentially use 3 separate funcs instead of metatemplateSubset()
    //         // Can always retain some 'object' entry in chassis list if that helps for representing loose weapons etc.
    //         object: {
    //             minSC: 0,
    //             maxSC: 40,
    //             multipliers: {
    //                 speed: 0
    //             },
    //         },

    //     }
    // }

    static allChassis () {
        return {
            building: {
                chassis: true,
                minSC: 2,
                maxSC: 14,
                multipliers: {
                    speed: 0
                },
            },
            wheeled: {
                chassis: true,
                minSC: 0,
                maxSC: 7,
                multipliers: {
                    speed: 20
                },
            },
            walker: {
                chassis: true,
                minSC: 1,
                maxSC: 8,
            },
            flier: {
                chassis: true,
                minSC: 0,
                maxSC: 6,
                multipliers: {
                    weight: 0.25,
                    speed: 100,
                },
            },
            hover: {
                chassis: true,
                minSC: 0,
                maxSC: 16,
                multipliers: {
                    weight: 0.5,
                    speed: 20,
                },
            },
            waterShip: {
                chassis: true,
                minSC: 1,
                maxSC: 8,
                multipliers: {
                    speed: 2
                },
            },
            spaceStation: {
                chassis: true,
                minSC: 5,
                maxSC: 40,
                multipliers: {
                    speed: 0
                },
            },
        };
    }

    static allComponents () {
        return {
            cannon: {
                shotsPerSecond: 0.1,
                multipliers: {
                    // high hit means high accuracy
                    // range is a hard cap (ToW 2021 April)
                    hit: 2,
                    range: 2,
                    damage: 2,
                },
                mods: 'ammo'
            },
            stubber: {
                shotsPerSecond: 6,
                mods: 'ammo'
            },
            launcher: {
                shotsPerSecond: 0.2,
                multipliers: {
                    range: 0.5,
                    damage: 2,
                    aoe: 2
                },
                mods: 'ammo'
            },
            sustainedLaser: {
                shotsPerSecond: 6,
                multipliers: {
                    hit: 1.5
                }
            },
            engine: {
                // TODO add a prop here to make 2nd engines rare.
            },
            fuelTank: {

            },
            legs: {

            },
            wheels: {

            },
            locomotion: {
                // Later we will probably not use this generic component metatemplate.
            },
        };
    }

    static ammoMetatemplates () {
        return {
            cheap: {},
            electric: {},
            tungsten: {
                incompatibleWith: ['launcher']
            },
            armorPiercing: {},
            missile: {},
            magnetized: {},
            highExplosive: {},
            fire: {},
            slag: {},
            plasma: {},
            frag: {},
            concussive: {},
            toxin: {},
            acid: {},
            gas: {},
            tearGas: {},
            tracker: {},
            guided: {},
            spiderweb: {},
            stealth: {},
            deafbang: {},
            flashblind: {},
            stun: {},
            cyberspam: {},
            nanite: {},
            nanovirus: {},
            gravity: {},
            hardlight: {},
            void: {},
            phase: {},
            timestop: {},
            transgressor: {},
        };
    }

    // Returns generic templates according to size class specification.
    // Size Class N describes any object 2^N meters long on its longest dimension.
    // It's fine to modify the returned template afterwards.
    // Compatible with chassis & component metatemplates.
    static getTemplate (metatemplateName, sizeClass) {
        const objectMetatemplate = {
            minSC: 0,
            maxSC: 40,
            multipliers: {
                speed: 0
            },
        };

        const organicWalkerMetatemplate = {
            chassis: true,
            minSC: 0,
            maxSC: 12,
        };

        let mt = metatemplateName ?
            WkriegArmy.allChassis()[metatemplateName] :
            objectMetatemplate;

        if (! mt) {
            mt = WkriegArmy.allComponents()[metatemplateName];
        }

        sizeClass = Util.constrain(sizeClass, mt.minSC || 0, mt.maxSC || 100);

        const size = Math.pow(2, sizeClass);

        const power = mt.chassis ?
            size :
            size * -0.5;

        const template = {
            metatemplateName,
            name: 'sc' + sizeClass + metatemplateName,
            size,
            sizeClass,
            power,
            chassis: mt.chassis || false,
            speed: size,
            weight: Math.pow(size / 4, 3),
            durability: size * 10,
            shotsPerSecond: mt.shotsPerSecond,
            mods: mt.mods,
        };

        if (! mt.multipliers) {
            return template;
        }

        for (let prop in mt.multipliers) {
            template[prop] = template[prop] * mt.multipliers[prop];
        }

        return template;
    }


    static nodeFromMetatemplate (metatemplateName, sizeClass) {
        return new WNode(
            WkriegArmy.getTemplate(metatemplateName, sizeClass)
        );
    }

    static randomVehicle () {
        const metatemplateName = Util.randomOf(
            Object.keys(WkriegArmy.allChassis())
        );

        const sizeClass = Util.randomIntBetween(0, 10);

        const vehicle = WkriegArmy.nodeFromMetatemplate(metatemplateName, sizeClass);

        vehicle.add(
            WkriegArmy.nodeFromMetatemplate('engine', sizeClass - 3)
        );

        vehicle.add(
            WkriegArmy.nodeFromMetatemplate('fuelTank', sizeClass - 3)
        );

        vehicle.add(
            // later make this specific to the metatemplate name, eg legs.
            WkriegArmy.nodeFromMetatemplate('locomotion', sizeClass - 1)
        );

        let totalSize = vehicle.traitSum('size') - vehicle.template.size;

        const sizeLimit = vehicle.template.size * 0.75

        Util.logDebug({
            note: `In WkriegArmy.randomVehicle(), above the while`,
            totalSize,
            sizeLimit,
            metatemplateName,
            sizeClass,
            componentsLength: vehicle.components.length,
            vehicleChassisSize: vehicle.template.size,
            vehicleSizeSumOverall: vehicle.traitSum('size'),
        });

        while (totalSize < sizeLimit) {
            const sizeLeft = sizeLimit - totalSize;

            // TODO this is null sometimes currently
            const maxComponentSC = Math.min(
                Math.floor(
                    Math.log2(sizeLeft)
                ),
                sizeClass - 1
            );

            Util.logDebug({
                note: `In WkriegArmy.randomVehicle() near the top of while`,
                totalSize,
                sizeLimit,
                sizeLeft,
                maxComponentSC: String(maxComponentSC),
                metatemplateName,
                sizeClass,
                componentsLength: vehicle.components.length,
            });

            // HMM will we need to reject if randomComponent() is too big ? Is that made impossible by the maxComponentSC logic?

            const newComponent = WkriegArmy.randomComponent(
                Util.randomUpTo(maxComponentSC)
            );

            Util.logDebug({
                note: `In WkriegArmy.randomVehicle() in the midhouse`,
                totalSize,
                sizeLimit,
                sizeLeft,
                maxComponentSC: String(maxComponentSC),
                metatemplateName,
                sizeClass,
                componentsLength: vehicle.components.length,
                newComponentSize: newComponent.template.size,
                newComponentName: newComponent.template.metatemplateName,
            });

            const newCount = Util.randomIntBetween(
                1,
                Math.floor(sizeLeft / newComponent.template.size) + 1
            );

            Util.logDebug({
                note: `In WkriegArmy.randomVehicle() in the lowhouse`,
                totalSize,
                sizeLimit,
                sizeLeft,
                maxComponentSC: String(maxComponentSC),
                metatemplateName,
                sizeClass,
                componentsLength: vehicle.components.length,
                newComponentSize: newComponent.template.size,
                newCount,
                newComponentName: newComponent.template.metatemplateName,
            });

            for (let i = 0; i < newCount; i++) {
                vehicle.add(
                    newComponent.deepCopy()
                );
            }

            totalSize = vehicle.traitSum('size') - vehicle.template.size;
        }


        return vehicle;
    }

    static randomComponent (sizeClass) {
        const metatemplateName = Util.randomOf(
            Object.keys(
                WkriegArmy.allComponents()
            )
        );

        const node = WkriegArmy.nodeFromMetatemplate(metatemplateName, sizeClass);

        WkriegArmy.addMod(node);

        return node;
    }

    // Side effects only.
    static addMod (componentNode) {
        if (! componentNode.template.mods) {
            return;
        }

        if (! componentNode.template.mods === 'ammo') {
            return; // Later more types may be supported.
        }

        const ammoModNames = Object.keys(
            WkriegArmy.ammoMetatemplates()
        );

        let modObj;
        for (let i = 0; i < ammoModNames.length * 2; i++) {
            // LATER make Util func for random key of obj.
            const modName = Util.randomOf(ammoModNames);

            modObj = WkriegArmy.ammoMetatemplates()[modName];

            if (! Util.contains(
                    modObj.incompatibleWith || [],
                    componentNode.template.metatemplateName
            )) {
                modObj.name = modName;
                modObj.modType = 'ammo';
                break;
            }
        }

        componentNode.addNewComponent(modObj);
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
        // WkriegArmy.testWeightBased();
        // WkriegArmy.testWeightBased();
        // WkriegArmy.testWeightBased();
        // WkriegArmy.testWeightBased();
        // WkriegArmy.testWeightBased();

        const vehicle = WkriegArmy.randomVehicle();
        Util.log(vehicle.toPrettyString());
    }
}

module.exports = WkriegArmy;

WkriegArmy.test();
