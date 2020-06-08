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
        ];
    }

    addNodesByAlignment (factionObj) {
        // TODO
        // factionObj[faction].start is a Coord describing a base spawn, near which that faction should spawn.
    }

    static example (timeline) {
        const worldState = new GridWarWorldState();

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;
        worldState.timeline = timeline;

        const context = 'halo/unsc/individual';

        // TODO see deathPlanetMock group initialization logic for inspiration
        const startingThings = {
            unsc: {
                start: new Coord(0, 0),
                odst: 3
            },
            cov: {
                start: new Coord(10, 10),
                bruteProwler: 2
            }
        };

        worldState.addNodesByAlignment(startingThings, context);

        return worldState;
    }

    static test () {

    }

    static run () {

    }
}

module.exports = GridWarWorldState;

GridWarWorldState.run();
