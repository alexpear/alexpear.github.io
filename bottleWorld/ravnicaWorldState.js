'use strict';

const _ = require('lodash');

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');

const WGenerator = require('../generation/wgenerator.js');

const Coord = require('../util/coord.js');
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

        initOpinions();

        const summary = statusSummary();
        Util.log(summary);
    }

    initOpinions () {
        for (const a of this.activeNodes()) {
            for (const b of this.activeNodes()) {
                a.resetOpinionOn(b);
            }
        }
    }

    statusSummary () {
        // TODO each node in activeNodes(). 
        // Orgs should say shortId() and .colors.toString()
        // And their opinion about the other orgs
    }

    static example (timeline) {

    }

    static test () {


    }

    static run () {
        return RavnicaWorldState.test();
    }
}

module.exports = RavnicaWorldState;

RavnicaWorldState.run();

