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
                    box.components.sort((a, b) => a.alignment.localeCompare(b.alignment));

                    componentsString = box.components.map(
                        // group => `${group.template.name} x${group.quantity}`
                        group => group.toEcoString()
                    )
                    .join('\n');

                    // Util.logDebug(`DndWorldState.textGrid(), box.components[0].template.name is ${box.components[0] && box.components[0].template.name} ... componentsString is ${componentsString}`);
                }

                const terrainStr = box.terrain ?
                    DndWorldState.toSymbolString(box.terrain) + '\n' :
                    '';

                stringGrid[r].push(
                    terrainStr + componentsString
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
                        DndWorldState.newGroup()
                    ]
                },
                {
                    terrain: 'sea',
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
                    terrain: 'plains',
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

        // Quick test. Overwrites the grid.
        // worldState.makeGrid(
        //     Util.randomIntBetween(1, 10),
        //     Util.randomIntBetween(1, 11)
        // );

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
                    components: [DndWorldState.newGroup()]
                });
            }
        }
    }

    randomAdjacentCoord (r, c) {
        const candidateDirs = [];

        if (r > 0) {
            candidateDirs.push([-1, 0]);
        }
        if (r < this.grid.length - 1) {
            candidateDirs.push([1, 0]);
        }
        if (c > 0) {
            candidateDirs.push([0, -1]);
        }
        if (c < this.grid[0].length - 1) {
            candidateDirs.push([0, 1]);
        }

        const choice = Util.randomOf(candidateDirs);

        const newR = r + choice[0];
        const newC = c + choice[1];

        return this.grid[newR][newC];
    }

    computeNextInstant () {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[0].length; c++) {
                const box = this.grid[r][c];
                // LATER: Newcomers might arrive, if this is a edge box.
                
                for (let group of box.components) {
                    // Migrations
                    const CHANCE = 0.1;
                    const roll = Math.random();
                    // Util.logDebug(`roll is ${roll}`);
                    // Util.logDebug(`Thinking about whether ${group.toEcoString()} should migrate. They have lastMigrated ${group.lastMigrated} and the current t is ${this.t}`)

                    // LATER, Let solitary creatures migrate
                    if (group.quantity > 1 && roll <= CHANCE && group.lastMigrated < this.t) {
                        const migrants = group.split();
                        migrants.lastMigrated = this.t;

                        const destination = this.randomAdjacentCoord(r,c);

                        const incompatibleGroups = destination.components.filter(
                            denizen => ! Group.compatibleAlignments(group.alignment, denizen.alignment)
                        );

                        if (incompatibleGroups.length > 0) {
                            const incompatibleNames = incompatibleGroups.map(g => g.templateName).join(', ');
                            Util.log(`${migrants.toEcoString()} from the ${box.terrain} are fighting denizens of the ${destination.terrain} (${incompatibleNames}).`);

                            this.simulateConflict(migrants, incompatibleGroups);

                            // Filter out any extinct groups
                            destination.components = destination.components.filter(g => g.quantity > 0);
                        }

                        if (migrants.quantity > 0) {
                            if (incompatibleGroups.some(g => g.quantity > 0)) {
                                // Merge migrants back where they started.
                                group.quantity += migrants.quantity;
                                migrants.quantity = 0;
                            }
                            else {
                                // Complete the migration.
                                Util.log(`${migrants.toEcoString()} have migrated from the ${box.terrain} to the ${destination.terrain}.`);

                                this.addGroup(migrants, destination);
                            }
                        }
                    }

                    // Growth
                    const factor = 1 + 0.4 * Math.random();
                    group.quantity = Math.ceil(group.quantity * factor);

                    const k = group.template.terrains[box.terrain] || 0;

                    // TODO: 2 groups of same species & diff alignments should probably share a K.
                    if (group.quantity > k) {
                        group.quantity = k;

                        if (group.quantity <= 0) {
                            // Delete group.
                            box.components = box.components.filter(
                                g => g !== group
                            );
                        }
                    }
                }
            }
        }
    }

    // Old
    // migrantChallenge <= denizenChallenge ||
    // migrantChallenge - migrants.template.challenge < denizenChallenge

    // if all incompatible denizens now gone, migrants move in
    // else they rejoin their starting location
    // Might need to return a outcome obj for that. TODO

    simulateConflict (migrants, denizens) {
        const migrantChallenge = migrants.quantity * migrants.template.challenge;
        const denizenChallenge = Util.sum(
            denizens.map(g => g.quantity * g.template.challenge)
        );

        const total = migrantChallenge + denizenChallenge;
        const migrantsWon = Math.random() * total > denizenChallenge;

        if (migrantsWon) {
            // Loser takes casualties equal to winner's challenge total (round up the damage)
            this.damageGroups(denizens, migrantChallenge, true);

            // Winner takes 10% casualties (round down the damage)
            migrants.quantity = Math.ceil(migrants.quantity * 0.9);

        }
        else {
            // Loser takes casualties equal to winner's challenge total (round up the damage)
            migrants.quantity = Math.floor((migrantChallenge - denizenChallenge) / migrants.template.challenge);

            // Winner takes 10% casualties (round down the damage)
            this.damageGroups(denizens, denizenChallenge * 0.1, false);
        }

        // if (migrants.quantity > 0 && denizens.some(d => d.quantity > 0)) {
        //     return { migrantsRetreat: true };
        // }
    }

    // Shrink the groups until a total of challengeDue worth of challenge points has been removed.
    // You'll need to separately filter out quantity==0 groups afterwards.
    damageGroups (groups, challengeDue, roundUpDamage) {
        // Sort from low to high template challenge.
        groups.sort(
            (a, b) => a.template.challenge - b.template.challenge
        );

        for (let group of groups) {
            const groupChallenge = group.quantity * group.template.challenge;

            if (groupChallenge < challengeDue) {
                group.quantity = 0;
                challengeDue -= groupChallenge;
            }
            else {
                const newQuantity = group.quantity - challengeDue / group.template.challenge;
                group.quantity = roundUpDamage ?
                    Math.floor(newQuantity) :
                    Math.ceil(newQuantity);

                break;
            }
        }
    }

    addGroup (newcomers, destination) {
        const templateName = newcomers.templateName;

        const fellows = destination.components.filter(
            g => g.templateName === templateName && g.alignment === newcomers.alignment
        );

        if (fellows.length === 0) {
            destination.components.push(newcomers);
        }
        else if (fellows.length === 1) {
            fellows[0].quantity += newcomers.quantity;
            newcomers.quantity = 0;
        }
        else {
            throw new Error(`Duplicate found in box: ${fellows.length} copies of ${fellows[0].alignment} ${fellows[0].templateName}, terrain ${destination.terrain}`);
        }
    }

    static newGroup () {
        const templates = DndWorldState.creatureTemplates();
        const keys = Object.keys(templates);
        const name = Util.randomOf(keys);
        const template = templates[name];
        template.name = name;

        const totalChallenge = Math.random() * 50;
        const quantity = Math.ceil(totalChallenge / template.challenge);

        const group = new Group(template, quantity, template.alignments);

        group.lastMigrated = -1;
        return group;
    }

    static creatureTemplates () {
        // Later, read these from a data file in codices/ dir.
        return {
            human: {
                challenge: 0.25,
                alignments: 'any',
                terrains: {
                    forest: 1000,
                    mountain: 200,
                    plains: 100_000,
                    desert: 100
                }
            },
            elf: {
                challenge: 1,
                alignments: 'any',
                terrains: {
                    forest: 2000,
                    mountain: 100,
                    plains: 200,
                    desert: 100
                }
            },
            knight: {
                challenge: 3,
                alignments: 'lg ln le',
                terrains: {
                    forest: 1000,
                    mountain: 200,
                    plains: 10_000,
                    desert: 100
                }
            },
            sphynx: {
                challenge: 150,
                alignments: 'ln lg',
                terrains: {
                    forest: 1000,
                    mountain: 200,
                    plains: 1_000,
                    desert: 100
                }
            },
            lich: {
                challenge: 200,
                alignments: 'le ne ce',
                terrains: {
                    forest: 1,
                    mountain: 1,
                    plains: 1,
                    desert: 1,
                    sea: 1
                }
            },
            archmage: {
                challenge: 190,
                alignments: 'any',
                terrains: {
                    forest: 1,
                    mountain: 1,
                    plains: 1,
                    desert: 1,
                    sea: 1
                }
            },
            skeleton: {
                challenge: 0.25,
                alignments: 'ne',
                terrains: {
                    forest: 100_000,
                    mountain: 100_000,
                    plains: 100_000,
                    desert: 100_000,
                    sea: 10_000
                }
            },
            dragon: {
                challenge: 200,
                alignments: 'any',
                terrains: {
                    forest: 1,
                    mountain: 1,
                    plains: 1,
                    desert: 1
                }
            },
            kobold: {
                challenge: 0.125,
                alignments: 'cn ce ne',
                terrains: {
                    forest: 100_000,
                    mountain: 100_000,
                    plains: 100_000,
                    desert: 100_000
                }
            },
            angel: {
                challenge: 50,
                alignments: 'lg ng',
                terrains: {
                    forest: 100,
                    mountain: 100,
                    plains: 100,
                    desert: 100
                }
            }

        };
    }

    static terrains () {
        return [
            'forest',
            'mountain',
            'desert',
            'plains',
            'sea'
        ];
    }

    // Could combine with WNode.alignmentAsString(), which does something similar.
    static toSymbolString (input) {
        const symbol = DndWorldState.getSymbol(input);

        return symbol ?
            symbol + ' ' + Util.capitalized(input) :
            input;
    }

    static getSymbol (input) {
        const symbols = {
            forest: '🌲',
            mountain: '🗻',
            desert: '🌵',
            plains: '🌽',
            sea: '🌊'
        };

        return symbols[input];
    }

    static test () {
        Util.log(`Beginning the DndWorldState test...`, `debug`);

        const ws = new DndWorldState();
        ws.makeGrid(3, 4);

        for (let t = 0; t < 100; t++) {
            Util.log(`t=${t}`);
            ws.t = t;
            console.log(ws.textGrid() + '\n');

            ws.computeNextInstant();
        }

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
