'use strict';

// Custom logic on top of WGenerator. Randomly generates WNode trees.

const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

const WNode = require('../wnode/wnode.js');

const armyWGen = WGenerator.generators['40k/guard/army'];

class ImperialGuardArmy extends WNode {
    constructor () {
        super();

        const faction = armyWGen.getOutputs()[0];
        this.add(faction);
    }

    // equipWarriors () {
    //     const faction = this.findComponent('faction');
    //     const armory = faction.findComponent('armory');
    //     const military = faction.findComponent('military');
    //     const a = military.findComponent('infantry');
    //     const b = military.findComponent('reserve');
    // }

    toPrettyString () {

    }

    static test () {
        const army = new ImperialGuardArmy();

        Util.logDebug('\n' + army.toPrettyString());
    }
}

module.exports = ImperialGuardArmy;

ImperialGuardArmy.test();
