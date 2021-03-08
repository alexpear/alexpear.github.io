'use strict';

const _ = require('lodash');

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');

const WGenerator = require('../generation/wgenerator.js');

const Coord = require('../util/coord.js');
const MtgColorSet = require('../util/mtgColorSet.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');
const RavnicaOrg = require('../wnode/ravnicaOrg.js');

class RavnicaWorldState extends WorldState {
    constructor () {
        super();

        // TODO log about it what has been inited.
        for (let i = 0; i < 3; i++) {
            this.addNode(new RavnicaOrg());
        }

        this.initOpinions();

        const summary = this.statusSummary();
        // Util.log(summary);
    }

    initOpinions () {
        for (const a of this.activeNodes()) {
            for (const b of this.activeNodes()) {
                const aSet = new MtgColorSet(a.colors);
                const bSet = new MtgColorSet(b.colors);

                a.opinionOf[b.id] = aSet.opinionOf(bSet);
            }
        }
    }

    statusSummary () {
        return this.activeNodes()
            .map(n => {
                const niceColors = MtgColorSet.toPrettyString(n.colors);
                // const abrvColors = MtgColorSet.abbreviate(n.colors);
                const name = `The ${n.shortId()} Office (${niceColors})\n`;

                const opinions = Object.keys(n.opinionOf)
                    .map(id => {
                        const otherId = Util.shortId(id);
                        const other = this.fromId(id);
                        const otherColorAbrv = MtgColorSet.abbreviate(other.colors);

                        return `  Opinion of ${otherId} (${otherColorAbrv}): ${n.opinionOf[id]}`
                    })
                    .join('\n');

                return name + opinions;
            })
            .join('\n');
    }

    static example (timeline) {
        return new RavnicaWorldState();
    }

    static test () {
        const world = RavnicaWorldState.example();

        Util.log(world.statusSummary());
    }

    static run () {
        return RavnicaWorldState.test();
    }
}

module.exports = RavnicaWorldState;

RavnicaWorldState.run();

