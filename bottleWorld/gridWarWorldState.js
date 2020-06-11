'use strict';

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');

const GridView = require('../gridView/src/gridView.js');

const Box = require('../util/box.js');
const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');
const Thing = require('../wnode/thing.js');

// For use with gridView front end
// Space is a discrete square grid
// All creatures are in homogenous groups (like banners, squads) of 1+ individuals
// All groups fit into 1 square (a 2:1 leniency is granted for groups of 1 large creature)
// Larger creatures or objects are not modeled in this system except as several squares of static terrain.
class GridWarWorldState extends WorldState {
    constructor (scenarioName) {
        super();

        // Later dont edit a capitalized prop, because that feels sketchy.
        Coord.DECIMAL_PLACES = 0;

        this.universe = 'halo'; // Later we can change this.

        // We model a rectangular battlefield extending from (0,0) to this.farCorner
        this.farCorner = new Coord(GridWarWorldState.WIDTH, GridWarWorldState.HEIGHT);

        const scenario = GridWarWorldState.presetArmy(scenarioName);
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

                scenario[alignment][templateName] = {
                    quantity: quantity,
                    totalSize: totalSize,
                    template: template
                }
            }
        }

        // In order to fit the largest model, the squares must be at least this scale.
        const minScale = largestSize * 2;

        const SQUARES_PER_GROUP = 10;
        const suggestedScale = Math.ceil(grandTotal * SQUARES_PER_GROUP / (this.farCorner.x * this.farCorner.y));

        this.mPerSquare = Math.max(minScale, suggestedScale);

        Util.logDebug(`GridWarWorldState.setUpScenario() ... grandTotal size is ${grandTotal}, largestSize is ${largestSize} so minScale is ${minScale}, and final mPerSquare is ${this.mPerSquare}.`)

        this.getStartBoxes(this.alignments);

        this.makeGroups(scenario);
    }

    getStartBoxes (alignments) {
        // MRB2: Support input array of 1-4 alignments. Inspired by Halo splitscreen pattern, eg 3 alignments might get N half, SW quadrant, and SE quadrant.
        if (alignments.length !== 2) {
            throw new Error(`Only having 2 start boxes is currently supported. ${alignments.length} start boxes is not yet supported.`);
        }

        this.startBoxes = {};

        this.startBoxes[alignments[0]] = new Box(
            new Coord(
                0, 
                0
            ),
            new Coord(
                this.farCorner.x, 
                Math.floor(this.farCorner.y / 2) - 1
            )
        );

        this.startBoxes[alignments[1]] = new Box(
            new Coord(
                0,
                Math.ceil(this.farCorner.y / 2)
            ),
            this.farCorner
        );
    }

    makeGroups (scenario) {
        for (const alignment in scenario) {
            for (const templateName in scenario[alignment]) {
                const entry = scenario[alignment][templateName];

                // example
                // 53 infantry into 7m squares
                // 7 groups of 7 quantity
                // 1 group of 4 quantity
                const maxPerSquare = Math.floor(this.mPerSquare / entry.size) || 1;
                const fullGroupCount = Math.floor(entry.quantity / maxPerSquare);
                const remainder = entry.quantity - (fullGroupCount * maxPerSquare);

                Util.logDebug(`Spawning ${templateName} x${entry.quantity} with mPerSquare ${this.mPerSquare}, because entry.size is ${entry.size}. Will do ${fullGroupCount} Groups of ${maxPerSquare} each, with remainder Group of ${remainder}.`);

                for (let i = 0; i < fullGroupCount; i++) {
                    this.spawnGroup(entry.template, maxPerSquare, alignment);
                }

                if (remainder > 0) {
                    this.spawnGroup(entry.template, remainder, alignment);                    
                }
            }
        }
    }

    spawnGroup (template, quantity, alignment) {
        // The unit of coord in this WorldState is squares, NOT meters.
        const coord = this.findAvailableSpawn(alignment);

        this.nodes.push(
            new Group(template, quantity, alignment, coord)
        );
    }

    findAvailableSpawn (alignment) {
        const startBox = this.startBoxes[alignment];

        let coord;

        const lots = startBox.width() * startBox.height() * 12;
        for (let i = 0; i < lots; i++) {
            coord = startBox.randomCoord();

            if (this.nodesAt(coord).length === 0) {
                return coord;
            }
        }

        throw new Error(`Cant spawn anything for ${alignment} because startBox with cornerA ${startBox.cornerA} is too crowded`);
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
                // TODO should this key specify faction ('unsc') or alignment ('red')?
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
            },
            bruteAssault: {
                unsc: {
                    odst: 100
                },
                cov: {
                    bruteProwler: 14,
                    wraith: 12
                }
            }
            // Add more later
        };

        return scenarios[scenario] || scenarios.bruteAssault;
    }

    static example (timeline) {
        const worldState = new GridWarWorldState('bruteAssault');

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;
        worldState.timeline = timeline;

        const context = 'halo/unsc/individual';

        // const startingThings = {
        //     unsc: {
        //         start: new Coord(0, 0),
        //         odst: 3
        //     },
        //     cov: {
        //         start: new Coord(10, 10),
        //         bruteProwler: 2
        //     }
        // };

        // worldState.addNodesByAlignment(startingThings, context);

        return worldState;
    }

    static test (input) {
        Util.logDebug(`Top of GridWarWorldState.test()`);

        const worldState = GridWarWorldState.example();
        const view = new GridView(worldState);

        view.setGridHtml();
    }

    static run () {
        GridWarWorldState.test();
    }
}

GridWarWorldState.WIDTH = 16;
GridWarWorldState.HEIGHT = 16;

module.exports = GridWarWorldState;

GridWarWorldState.run();
