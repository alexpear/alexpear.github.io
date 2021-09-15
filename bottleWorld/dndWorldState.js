'use strict';

const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');
const ArrivalEvent = require('./events/arrivalEvent.js');

const DndCreature = require('../dnd/dndCreature.js');

const DndWarband = require('../generation/dndWarband.js');

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');

// MRB1 space model: 4 equidistant zones, named N E S & W. 
class DndWorldState extends WorldState {
    constructor (rows, cols) {
        super();
    }

    textGrid () {
        const stringGrid = [];

        for (let r = 0; r < this.grid.length; r++) {
            stringGrid.push([]);

            for (let c = 0; c < this.grid[0].length; c++) {
                const box = this.grid[r][c];
                let componentsString;

                if ((! box.components) || box.components.length === 0) {
                    componentsString = '';
                }
                else {
                    componentsString = box.components.map(
                        group => `${group.template.name} x${group.quantity}`
                    )
                    .join('\n');

                    // Util.logDebug(`DndWorldState.textGrid(), box.components[0].template.name is ${box.components[0] && box.components[0].template.name} ... componentsString is ${componentsString}`);
                }

                stringGrid[r].push(
                    (box.terrain || '') +
                        componentsString
                );
            }
        }

        return Util.textGrid(stringGrid);
    }

    static example (timeline, giveUpTime) {
        const grid = [
            [
                {
                    terrain: 'forest',
                    components: [
                        DndWorldState.newGroup(),
                        DndWorldState.newGroup()
                    ]
                },
                {
                    terrain: 'islands',
                    components: [
                        DndWorldState.newGroup()
                    ]
                }
            ],
            [
                {
                    terrain: 'mountain',
                    components: [
                        DndWorldState.newGroup()
                    ]
                },
                {
                    terrain: 'desert',
                    components: [
                        DndWorldState.newGroup()
                    ]
                }
            ]
        ];
        //     const startingGroups = [
        //         // TODO Perhaps the string templateName given to WGenerator should be sufficient for it to know when to create a Creature and when a Group. the template entry in the generator txt file could specify this.
        //         {
        //             templatePath: 'halo/unsc/squad/marineGroup',
        //             alignment: 'UNSC'
        //         },
        //         {
        //             templatePath: 'halo/flood/squad/podGroup',
        //             alignment: 'Flood'
        //         }
        //     ];

        //     // Eventually should functionize this timeline initialization:
        const worldState = new DndWorldState(); //[], RingWorldState.CIRCUMFERENCE, giveUpTime);

        worldState.grid = grid;

        // Overwrites the grid, tidy later
        worldState.makeGrid(
            Util.randomIntBetween(1, 10),
            Util.randomIntBetween(1, 11)
        );

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;
        worldState.timeline = timeline;

        // worldState.addStartingGroups(startingGroups);

        return worldState;
    }

    makeGrid (rowCount, colCount) {
        this.grid = [];

        for (let r = 0; r < rowCount; r++) {
            this.grid.push([]);

            for (let c = 0; c < colCount; c++) {
                this.grid[r].push({
                    terrain: Util.randomOf(DndWorldState.terrains()),
                    components: []
                });
            }
        }
    }

    computeNextInstant () {
        // Travelers might arrive
        
        // Migrations
        // Reproduction
    }

    static newGroup () {
        const template = Util.randomOf(DndWorldState.creatureTemplates());
        const totalCr = Math.random() * 50;
        const quantity = Math.ceil(totalCr / template.cr);

        return new Group(template, quantity, template.alignment);
    }

    static creatureTemplates () {
        return [
            {
                name: 'knight',
                cr: 3,
                alignment: 'LG'
            },
            {
                name: 'sphynx',
                cr: 12,
                alignment: 'LN'
            },
            {
                name: 'lich',
                cr: 22,
                alignment: 'LE'
            },
            {
                name: 'skeleton',
                cr: 0.25,
                alignment: 'NE'
            },
            {
                name: 'dragon',
                cr: 17,
                alignment: 'CE'
            },
            {
                name: 'kobold',
                cr: 0.125,
                alignment: 'CN'
            },
            {
                name: 'scoundrel',
                cr: 0.25,
                alignment: 'CG'
            },
            {
                name: 'angel',
                cr: 16,
                alignment: 'NG'
            },
            {
                name: 'uberelemental',
                cr: 17,
                alignment: 'NN'
            }
        ];
    }

    static terrains () {
        return [
            'forest',
            'islands',
            'mountain',
            'grassland',
            'desert',
            'steppe'
        ];
    }

    static test () {
        Util.log(`Beginning the DndWorldState test...`, `debug`);

        const ws = DndWorldState.example();

        console.log(ws.textGrid());

    //     // Unit tests
    //     RingWorldState.testDistanceBetween();

    //     const worldState = RingWorldState.example(undefined);

    //     // worldState.printNodes();
    //     // Util.log(worldState.toDebugString());

    //     while (worldState.worthContinuing()) {
    //         worldState.printCoords();
    //         worldState.timeline.computeNextInstant();
    //     }

    //     Util.log(`Up to t=${worldState.now()}, the timeline is: \n${worldState.timeline.toDebugString()}`, 'debug');

    //     worldState.timeline.printInRealTime();

    //     worldState.printCensus();

    //     // Type: object
    //     const timelineJson = worldState.timeline.toJson();

    //     // Type: string
    //     const timelineJsonStr = JSON.stringify(timelineJson);
    //     const timelineJsonStrWhitespace = JSON.stringify(timelineJson, undefined, '    ');

    //     Util.log(`The json version of the timeline is ${Util.commaNumber(timelineJsonStr.length)} characters long (no whitespace). The timeline has run for ${Util.prettyTime(worldState.now())} of in-world time.`);

    //     // Util.log(timelineJsonStr);

    //     Util.log(worldState.toDebugString());

    //     return worldState;
    }

    // battle (warbandA, warbandB) {
    //     const everyone = warbandA.creatures.concat(warbandB.creatures);
    //     // TODO: Randomize order of everyone

    //     for (const creature of everyone) {
    //         // creature.selectTarget() // Hmm, i should focus on the BEvent-style.
    //     }

    //     // TODO
    // }
}

module.exports = DndWorldState;

DndWorldState.test();
