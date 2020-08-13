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
    FS.readFileSync('./codices/sunlight/wiederholungskrieg/wiederholungskrieg.yml', 'utf8')
);

const factionWGen = WGenerator.generators['sunlight/wiederholungskrieg/faction'];

class WiederholungskriegArmy extends WNode {
    constructor () {
        super();

        const faction = factionWGen.getOutputs()[0];
        this.add(faction);

        // Util.logDebug('\n' + faction.toPrettyString());

        const armory = _.find(faction.components, n => n.templateName === 'armory');

        for (let w = 0; w < 2; w++) {
            armory.add(this.randomWeapon());
        }
    }

    randomWeapon () {
        // LATER add up the weights into a array, like WGenerator aliastables.
        // const chassisName = this.fromSeveralAliasTable(Arsenal.weapons.melee, Arsenal.weapons.ranged);
        const chassisName = this.fromAliasTable(Arsenal.weapons.melee, Arsenal.weapons.ranged);
        const weap = new WNode(chassisName);

        const modName = this.fromAliasTable(Arsenal.weaponMods.general);
        weap.add(new WNode(modName));

        // Util.log(`${Util.fromCamelCase(modName)} ${Util.fromCamelCase(chassisName)}`);

        return weap;
    }

    fromSeveralAliasTables (...tableObjs) {

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
