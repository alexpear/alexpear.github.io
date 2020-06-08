'use strict';

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');

const Box = require('../util/box.js');
const Util = require('../util/util.js');
const Thing = require('../wnode/thing.js');

// For use with gridView front end
// Space is a discrete square grid
// All creatures are in homogenous groups (like banners, squads) of 1+ individuals
// All groups fit into 1 square (a 2:1 leniency is granted for groups of 1 large creature)
// Larger creatures or objects are not modeled in this system except as several squares of static terrain.
class GridWarWorldState extends WorldState {
	constructor () {
		super();

		this.box = Box.ofDimensions();
	}

    allAlignments () {
        return [
            'unsc',
            'cov'
            // 'innie'
        ];
    }

    static example (timeline) {

        return worldState;
    }

    static test () {

    }

    static run () {

    }
}

module.exports = GridWarWorldState;

GridWarWorldState.run();
