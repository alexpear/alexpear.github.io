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
    FS.readFileSync('../codices/sunlight/wiederholungskrieg/wiederholungskrieg.yml', 'utf8')
);

const factionWGen = WGenerator.generators['sunlight/wiederholungskrieg/faction'];

class WiederholungskriegArmy extends WNode {
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

    static test () {
        const army = new WiederholungskriegArmy();

        Util.logDebug('\n' + army.toPrettyString());
    }
}

module.exports = WiederholungskriegArmy;

WiederholungskriegArmy.test();
