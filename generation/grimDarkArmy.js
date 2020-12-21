'use strict';

// Custom logic on top of WGenerator. Randomly generates WNode trees.

const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

const WNode = require('../wnode/wnode.js');

class GrimDarkArmy extends WNode {
    constructor (genPath) {
        super();

        genPath = genPath || '40k/imp/guard/army';

        const army = WGenerator.generators[genPath].getOutputs()[0];

        army.components.reverse();

        // Later make the above to a static factory func or something, to avoid this weird blank root node.
        this.add(army);
    }

    // TODO func to print the 4x node 4 times, etc.

    static test () {
        const army = new GrimDarkArmy();

        Util.log('\n' + army.toPrettyString());
    }
}

module.exports = GrimDarkArmy;

GrimDarkArmy.test();
