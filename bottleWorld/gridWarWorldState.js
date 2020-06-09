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
    constructor (scenario) {
        super();

        this.universe = 'halo'; // Later we can change this.

        // We model a rectangular battlefield extending from (0,0) to this.farCorner
        this.farCorner = new Coord(GridWarWorldState.WIDTH, GridWarWorldState.HEIGHT);

        this.setUpScenario(scenario);
    }

    setUpScenario (scenario) {
        this.alignments = Object.keys(scenario);

        const sizeTotals = {};
        let grandTotal = 0;
        let largestSize = 0;

        for (const alignment in scenario) {
            sizeTotals[alignment] = {};

            for (const templateName in scenario[alignment]) {
                const path = this.universe + '/' + alignment + '/individual/' + templateName;
                // TODO: vehicles may be in squad.js, not individual.js. Figure out a way to structure these names to accommodate that.

                const template = this.getTemplate(path);

                if (! template || ! template.size) {
                    throw new Error(`Can't load size of ${templateName}`);
                }

                if (template.size > largestSize) {
                    largestSize = template.size;
                }

                const quantity = scenario[alignment][templateName];
                
                const totalSize = template.size * quantity;

                sizeTotals[alignment][templateName] = totalSize;
                grandTotal += totalSize;

                // TODO should probably gather this info into a data structure. Maybe similar to or a modification of scenario. Keyed by alignment and templateName, but storing object at deepest level, not just number.
            }
        }

        // In order to fit the largest model, the squares must be at least this scale.
        const minScale = largestSize * 2;

        const DENSITY_HEURISTIC = 7;
        const suggestedScale = grandTotal * DENSITY_HEURISTIC / (this.farCorner.x * this.farCorner.y);

        this.mPerSquare = Math.max(minScale, suggestedScale);

        // {
        //     unsc: new Box(
        //         new Coord(0, 0), 
        //         new Coord(this.farCorner.x, Math.floor(this.farCorner.y))
        //     ),
        //     cov: new Box(
        //         new Coord(0, Math.ceil(this.farCorner.y)), 
        //         this.farCorner
        //     )
        // }
        this.startBoxes = this.getStartBoxes(this.alignments);

        this.makeGroups(scenario);
    }

    getStartBoxes (alignments) {
        // TODO
        // MRB2: Support input array of 1-4 alignments
    }

    makeGroups (scenario) {
        // TODO Involves this.nodes, scenario, this.mPerSquare, and this.startBoxes

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
                // TODO estimate total size of this scenario, then decide what mPerSquare would be best. (divide by 40, consider largest.)
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

GridWarWorldState.WIDTH = 16;
GridWarWorldState.HEIGHT = 16;

module.exports = GridWarWorldState;

GridWarWorldState.run();
