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
        DndWorldState.SCREEN_HEIGHT = 44;
        DndWorldState.SCREEN_WIDTH = 150;

        const HORIZ_WALL = '-'.repeat(DndWorldState.SCREEN_WIDTH);
        let lines = [HORIZ_WALL];

        for (let r = 0; r < this.grid.length; r++) {
            const lineSets = [];

            for (let c = 0; c < this.grid[0].length; c++) {
                lineSets.push(
                    this.boxAsLines(r, c)
                );
            }

            const rowLines = this.stitchBoxRow(lineSets);
            rowLines.push(HORIZ_WALL);

            lines = lines.concat(rowLines);
        }

        return lines.join('\n');
    }

    boxAsLines (row, column) {
        const boxHeight = Math.floor(
            (DndWorldState.SCREEN_HEIGHT - this.grid.length - 1) / this.grid.length
        );

        const topRow = this.grid[0];

        const boxWidth = Math.floor(
            (DndWorldState.SCREEN_WIDTH - topRow.length - 1) / topRow.length
        );

        const box = this.grid[row][column];
        const lines = [
            Util.padSides(box.terrain, boxWidth)
        ];

        // Util.logDebug('lines[0].length is ' + lines[0].length + ', and boxWidth is ' + boxWidth);

        for (let i = 1; i < boxHeight - 1; i++) {
            const group =
                box.components &&
                box.components[i - 1];

            const groupString = group ?
                `${group.template.name} x${group.quantity}` :
                '';

            lines.push(
                Util.padSides(groupString, boxWidth)
            );
        }

        if (box.components && box.components[boxHeight - 1]) {
            lines.push(
                Util.padSides('...', boxWidth)
            );
        }

        return lines;
    }

    stitchBoxRow (lineSets) {
        const WALL = '|';
        const lines = [];

        for (let r = 0; r < lineSets[0].length; r++) {
            let line = WALL;

            for (let i = 0; i < lineSets.length; i++) {
                line += lineSets[i][r] + WALL;
            }

            lines.push(line);
        }

        return lines;
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

        timeline = timeline || new Timeline(worldState);
        timeline.currentWorldState = worldState;
        worldState.timeline = timeline;

        // worldState.addStartingGroups(startingGroups);

        return worldState;
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
