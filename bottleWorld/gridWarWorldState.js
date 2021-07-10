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
const WNode = require('../wnode/wnode.js');

// For use with gridView front end
// Space is a discrete square grid
// All creatures are in homogenous groups (like banners, squads) of 1+ individuals
// All groups fit into 1 square (a 2:1 leniency is granted for groups of 1 large creature)
// Larger creatures or objects are not modeled in this system except as several squares of static terrain.
class GridWarWorldState extends WorldState {
    constructor (scenarioName) {
        super(undefined, 0, undefined, 1000);

        // Later dont edit a capitalized prop, because that feels sketchy.
        Coord.DECIMAL_PLACES = 0;

        this.universe = 'halo'; // Later we can change this.

        this.timeline = new Timeline(this);

        // We model a rectangular battlefield extending from (0,0) to this.farCorner
        this.farCorner = new Coord(GridWarWorldState.WIDTH - 1, GridWarWorldState.HEIGHT - 1);

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
                    throw new Error(`Can't load size of ${templateName}. Scenario keys are: ${this.alignments}`);
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
                };
            }
        }

        // In order to fit the largest model, the squares must be at least this scale.
        const minScale = Math.ceil(largestSize / 2);

        const SQUARES_PER_GROUP = 10;
        const suggestedScale = Math.ceil(grandTotal * SQUARES_PER_GROUP / (this.farCorner.x * this.farCorner.y));

        // TODO No, this round func could round smaller than minScale
        // A sigfigRoundUp() func would be useful...
        this.mPerSquare = Util.sigfigRound(
            Math.max(1, minScale, suggestedScale),
            1
        );

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
                // entry {
                //     quantity: number,
                //     totalSize: number
                //     template: CreatureTemplate
                // }
                const entry = scenario[alignment][templateName];

                // example
                // 53 infantry into 7m squares
                // 7 groups of 7 quantity
                // 1 group of 4 quantity
                const maxPerSquare = Math.floor(this.mPerSquare / entry.template.size) || 1;
                const fullGroupCount = Math.floor(entry.quantity / maxPerSquare);
                const remainder = entry.quantity - (fullGroupCount * maxPerSquare);

                Util.logDebug(`Spawning ${templateName} x${entry.quantity} with mPerSquare ${this.mPerSquare}, because entry.template.size is ${entry.template.size}. Will do ${fullGroupCount} Groups of ${maxPerSquare} each, with remainder Group of ${remainder}.`);

                for (let i = 0; i < fullGroupCount; i++) {
                    this.spawnGroup(templateName, maxPerSquare, alignment);
                }

                if (remainder > 0) {
                    // Alternatively, could divide combatants evenly between the N groups. For example, if there are 2 groups, split half and half. If 4, split into fourths.
                    this.spawnGroup(templateName, remainder, alignment);
                }
            }
        }
    }

    spawnGroup (templateName, quantity, alignment) {
        // The unit of coord in this WorldState is squares, NOT meters.
        const coord = this.findAvailableSpawn(alignment);

        // TODO these ArrivalEvents are using WGenerator to instantiate WNodes and getting confused.
        // I could set the path/codices up so that WG does not get confused.
        const arrivalEvent = new ArrivalEvent(templateName, coord, alignment);
        arrivalEvent.quantity = quantity;
        this.timeline.addEvent(arrivalEvent);

        Util.logDebug(`GridWar spawnGroup(). Created ArrivalEvent of template name '${arrivalEvent.templatePath}' with quantity ${arrivalEvent.quantity} and coord ${arrivalEvent.coord}`);

        // Old logic that works but doesnt use BEvents.
        // // const newGroup = new Group(template, quantity, alignment, coord);
        // // this.nodes.push(newGroup);

        // Util.logDebug(`GridWar spawnGroup(). Created ${newGroup.templateName} group with quantity ${newGroup.quantity} and coord ${newGroup.coord}`);
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

    // returns WNode[]
    generateNodes (templatePath) {
        // Later this can do more sophisticated stuff like look up template stats in codex files (using this.wanderingGenerator.getOutputs() probably).
        return [new WNode(templatePath)];
    }

    // Give each actor a turn.
    actorTurns () {
        // Later might need to filter this array further.
        const groups = this.activeNodes();

        for (const group of groups) {
            if (group.act) {
                group.act(this);
            }
        }
    }

    static presetArmy (scenarioName) {
        const scenarios = {
            cairoStation: {
                unsc: {
                    odst: 4,
                    marine: 7,
                    // TODO add image files and template entries for new combatant types
                    officer: 1
                },
                cov: {
                    grunt: 5,
                    jackal: 5,
                    rifleJackal: 1,
                    elite: 1
                }
            },
            singleCombat: {
                unsc: {
                    spartan: 1
                },
                cov: {
                    bruteChieftain: 1,
                    brute: 8
                }
            },
            // slayer: {
            //     // TODO should this key specify faction ('unsc') or alignment ('red')?
            //     red: {
            //         spartan: 4
            //     },
            //     blue: {
            //         spartan: 4
            //     }
            // },
            strikeTeam: {
                unsc: {
                    mantis: 1,
                    mongoose: 2,
                    odst: 8
                },
                cov: {
                    hunter: 2,
                    ghost: 1,
                    grunt: 10,
                    elite: 1
                }
            },
            lightBruteInvasion: {
                unsc: {
                    warthog: 2,
                    spartan: 4
                },
                cov: {
                    chopper: 2,
                    ghost: 1,
                    brute: 5
                }
            },
            // btb: {
            //     red: {
            //         mantis: 1,
            //         banshee: 1,
            //         warthog: 1,
            //         ghost: 1,
            //         spartan: 4
            //     },
            //     blue: {
            //         mantis: 1,
            //         banshee: 1,
            //         warthog: 1,
            //         ghost: 1,
            //         spartan: 4
            //     }
            // },
            arkTankBattle: {
                unsc: {
                    scorpion: 7,
                    warthog: 2,
                    mongoose: 2,
                    spartan: 1,
                    marine: 8
                },
                cov: {
                    wraith: 8,
                    chopper: 4,
                    bruteProwler: 1,
                    grunt: 10,
                    rifleJackal: 4,
                    jackal: 5,
                    brute: 6
                }
            },
            arkTankBattleWithScarab: {
                unsc: {
                    scorpion: 7,
                    warthog: 3,
                    mongoose: 2,
                    spartan: 1,
                    marine: 20,
                    pelican: 2
                },
                cov: {
                    scarab: 1,
                    phantom: 3,
                    wraith: 8,
                    chopper: 4,
                    bruteProwler: 1,
                    grunt: 10,
                    rifleJackal: 4,
                    jackal: 5,
                    brute: 6
                }
            },
            theCovenantAirBattle: {
                unsc: {
                    hornet: 20,
                    pelican: 7,
                    warthog: 2,
                    mongoose: 2,
                    odst: 10
                },
                cov: {
                    banshee: 20,
                    phantom: 10,
                    wraith: 4,
                    brute: 20,
                    shade: 6
                }
            },
            sandtrapDropships: {
                unsc: {
                    pelican: 2,

                },
                cov: {
                    phantom: 2,

                }
            },
            prometheansVsFlood: {
                forerunner: {
                    crawler: 24,
                    watcher: 6,
                    soldier: 12,
                    knight: 6,
                    phaeton: 1,
                    sentinel: 12,
                    enforcer: 1
                },
                flood: {
                    // pod: 67,
                    // carrier: 11,
                    // combatForm: 92,
                    // floodTank: 9
                }
            },
            bruteAssault: {
                unsc: {
                    odst: 305
                },
                cov: {
                    bruteProwler: 9,
                    wraith: 3
                }
            },
            mammothInAPark: {
                unsc: {
                    mammoth: 1,
                    wasp: 2,
                    warthog: 2,
                    scorpion: 1,
                    marine: 40
                },
                cov: {
                    scarab: 1,
                    grunt: 20,
                    bruteChieftain: 1,
                    brute: 5,
                    banshee: 2
                }
            },
            lichOverGovernorsIsland: {
                unsc: {
                    // Fill in later
                },
                cov: {
                    lich: 1,

                }
            },
            forgeWorldBattle: {
                unsc: {

                },
                cov: {

                }
            },
            krakenSiege: {
                unsc: {
                    // Fill in later
                },
                cov: {
                    kraken: 1,

                }
            },
            cruisersAndHarvesters: {
                unsc: {
                    // Fill in later
                },
                cov: {
                    ccsLightCruiser: 1,
                    harvester: 1,

                }
            },
            frigateOverCentralPark: {
                unsc: {
                    frigate: 1,
                    // Fill in later

                },
                cov: {

                }
            },
            tipOfTheSpear: {
                unsc: {
                    frigate: 1,
                    missileSilo: 1,
                    pelican: 20,
                    scorpion: 100,
                    warthog: 400,
                    marine: 2000,
                    odst: 100,
                    falcon: 50,
                    spartan: 6
                },
                cov: {
                    corvette: 1,
                    spire: 1,
                    banshee: 100,
                    phantom: 20,
                    wraith: 100,
                    ghost: 200,
                    grunt: 2000,
                    elite: 200,
                    jackal: 500
                }
            },
            marathonsOverGoleta: {
                unsc: {
                    marathonCruiser: 2,
                    // Fill in later
                },
                cov: {

                }
            },
            spiritOfFireOverManhattan: {
                unsc: {
                    // spiritOfFire: 1,
                    // Fill in later
                },
                cov: {

                }
            },
            infinityCityDefense: {
                unsc: {
                    infinity: 1,
                    // Fill in later
                },
                cov: {

                }
            },
            keyshipConnecticut: {
                unsc: {
                    // Fill in later
                },
                cov: {
                    keyship: 1,

                }
            },
            supercarrierPennsylvania: {
                unsc: {
                    // Fill in later
                },
                cov: {
                    // supercarrier: 1

                }
            },
            highCharityAustralia: {
                unsc: {
                    // Fill in later
                },
                cov: {
                    highCharity: 1,
                }
            }
            // Add more later
        };

        if (scenarioName) {
            return scenarios[scenarioName];
        }

        const randomName = Util.randomOf(Object.keys(scenarios));
        return scenarios[randomName];
    }

    static example () {
        const worldState = new GridWarWorldState('tipOfTheSpear');

        return worldState;
    }

    static async test (input) {
        Util.logDebug(`Top of GridWarWorldState.test()`);

        const worldState = GridWarWorldState.example();

        Util.logDebug(`GridWarWorldState.test(), after example() returned.`);

        const view = new GridView(worldState);
        view.setGridHtml();

        // while (worldState.worthContinuing()) {
            await Util.sleep(1);

            // Util.logDebug('GridWarWorldState, after sleep(1)');

            worldState.timeline.computeNextInstant();
            view.setGridHtml();
        // }
    }

    static async run () {
        await GridWarWorldState.test();
    }
}

GridWarWorldState.WIDTH = 16;
GridWarWorldState.HEIGHT = 16;

module.exports = GridWarWorldState;

GridWarWorldState.run();


/*
Notes on the transition function.
2020 Oct
Currently in other WorldStates, it works like this:
Timeline.computeNextInstant() looks at the set of all BEvents at time t.
For each event we call event.resolve(worldState)
These resolve() calls mutate worldState
They also set up more BEvents in future ticks.

For MRB1 GridWar (creature movement), do i want to keep this paradigm or not?

One complication is that BEvents are written for continuous space, and GridWar is discrete.
So the BEvent library as written is actually overly specific.
Option 1: Make discrete subclasses of individual BEvent classes as needed. MoveAllDiscreteEvent, etc.
. Well actually MoveAllEvent is already pretty robust, happily. Not very continuous-specific.
. Altho i may need special logic for saving up movement credit over several seconds.
. ProjectileEvent too

Okay so maybe i can just move forward with making GridWarWorldState tests being more BEvent-based. Start with ArrivalEvent. Do this in spawnGroup()

Currently we test with npm run refresh and going to:
http://localhost:8080/gridView/gridView.html



*/




