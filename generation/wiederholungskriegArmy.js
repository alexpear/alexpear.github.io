'use strict';

// Custom logic on top of WGenerator. Randomly generates WNode trees.

const Util = require('../util/util.js');

// const Creature = require('../wnode/creature.js');
// const Group = require('../wnode/group.js');
// const Thing = require('../wnode/thing.js');
const WNode = require('../wnode/wnode.js');

const _ = require('lodash');

// LATER will need to use yamlify or something to get this to work in a browser. 
const FS = require('fs');
const Yaml = require('js-yaml');

const Arsenal = Yaml.safeLoad(
    FS.readFileSync('../codices/sunlight/wiederholungskrieg.yml', 'utf8')
);

class WiederholungskriegArmy extends WNode {

    randomWeapon () {
        // LATER add up the weights into a array, like WGenerator aliastables.
        const weapons = Object.keys(Arsenal.weapons);
        const chassisName = _.sample(weapons);

        const generalMods = Object.keys(Arsenal.weaponMods.general);
        const modName = _.sample(generalMods);

        const weap = new WNode(chassisName);
        weap.add(new WNode(modName));

        Util.log(`${Util.fromCamelCase(modName)} ${Util.fromCamelCase(chassisName)}`);

        return weap;
    }

    static test () {
        const weap = new WiederholungskriegArmy().randomWeapon();

        // Util.logDebug('\n' + weap.toPrettyString());
    }
}

module.exports = WiederholungskriegArmy;

WiederholungskriegArmy.test();
