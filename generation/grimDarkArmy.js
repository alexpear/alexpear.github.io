'use strict';

// Custom logic on top of WGenerator. Randomly generates WNode trees.

const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

const WNode = require('../wnode/wnode.js');

class GrimDarkArmy extends WNode {
    constructor (genPath) {
        super();

        genPath = genPath || '40k/imp/astartes/army';

        const army = WGenerator.generators[genPath].getOutputs()[0];

        army.components.reverse();

        // Later make the above to a static factory func or something, to avoid this weird blank root node.
        this.add(army);
    }

    // Func to print the 4x node 4 times, etc.
    summary () {
        const units = this.components[0].components;
        const output = [];

        for (const section of units) {
            const repeats = parseInt(section.templateName);

            for (let i = 0; i < repeats; i++) {
                output.push(section.components[0]);
            }
        }

        return '\n\n' + output.map(
            node => node.toPrettyString()
        ).join('\n');

    }


    static test () {
        const army = new GrimDarkArmy();

        Util.log(army.summary());
    }
}

module.exports = GrimDarkArmy;

GrimDarkArmy.test();
