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

    static presetArmy (scenario) {
        const scenarios = {
            singleCombat: {
                unsc: {
                    spartan: 1
                },
                cov: {
                    bruteChieftain: 1,
                    brute: 8
                }
            },
            slayer: {
                red: {
                    spartan: 4
                },
                blue: {
                    spartan: 4
                }
            },
            btb: {
                red: {
                    mantis: 1,
                    banshee: 1,
                    warthog: 1,
                    ghost: 1,
                    spartan: 4
                },
                blue: {
                    mantis: 1,
                    banshee: 1,
                    warthog: 1,
                    ghost: 1,
                    spartan: 4
                }
            },
            tipOfTheSpear: {
                unsc: {
                    frigate: 2,
                    missileSilo: 5,
                    pelican: 40,
                    scorpion: 100,
                    warthog: 400,
                    marine: 2000,
                    falcon: 50,
                    spartan: 6
                },
                cov: {
                    corvette: 2,
                    spire: 12,
                    banshee: 100,
                    spirit: 100,
                    wraith: 100,
                    ghost: 200,
                    grunt: 2000,
                    elite: 200,
                    jackal: 500
                }
                // TODO estimate total size of this scenario, then decide what mPerSquare would be best.
            }
            // Add more later
        }
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
