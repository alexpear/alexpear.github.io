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
    FS.readFileSync('./codices/sunlight/wiederholungskrieg.yml', 'utf8')
);

const factionWGen = WGenerator.generators['sunlight/faction'];

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
        const weapons = Object.keys(Arsenal.weapons);
        const chassisName = _.sample(weapons);

        const generalMods = Object.keys(Arsenal.weaponMods.general);
        const modName = _.sample(generalMods);

        const weap = new WNode(chassisName);
        weap.add(new WNode(modName));

        // Util.log(`${Util.fromCamelCase(modName)} ${Util.fromCamelCase(chassisName)}`);

        return weap;
    }

    static test () {
        const army = new WiederholungskriegArmy();

        Util.logDebug('\n' + army.toPrettyString());
    }
}

module.exports = WiederholungskriegArmy;

WiederholungskriegArmy.test();
