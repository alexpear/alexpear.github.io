'use strict';

const Util = require('../util/util.js');

// Sketch of populations of nested regions in 2020 Earth.
// For the Cape Demographics fan project.
class RegionTree {
    static fullTree () {
        return {
            total: 7600000000,
            eurasia: {
                total: 5360000000,
                china: {
                    total: 1415000000
                },
                india: {
                    total: 1354000000
                },
                pakistan: {
                    total: 201000000
                },
                bangladesh: 166000000,
                vietnam: 97000000,
                japan: {
                    total: 127000000
                },
                southKorea: {
                    total: 51000000
                },
                philippines: {
                    total: 107000000
                },
                indonesia: {
                    total: 267000000
                },
                iran: {
                    total: 82000000
                },
                turkey: {
                    total: 82000000
                },
                russia: {
                    total: 144000000
                },
                germany: {
                    total: 82000000
                }
            },
            africa: {
                total: 1288000000,
                nigeria: {
                    total: 196000000
                },
                ethiopia: {
                    total: 108000000
                },
                kenya: {
                    total: 51000000
                },
                egypt: 99000000,
                tanzania: 59000000
            },
            northAmerica: {
                total: 587000000,
                canada: {
                    total: 37000000
                },
                usa: {
                    total: 327000000,
                    alabama: {
                        total: 4900000,
                        montgomery: 206000
                    },
                    // ...
                    dc: 700000,
                    // ...
                    newHampshire: {
                        total: 1360000,
                        concord: 44000
                    },
                    // ...
                    // newYork: {
                    //     total: 1,
                    //     nyc: {
                    //         total: 1,
                    //         manhattan: {
                    //             total: 1,
                    //             fidi: 1
                    //         }
                    //     }
                    // }
                },
                mexico: {
                    total: 131000000
                }
                // TODO other nations...
            },
            southAmerica: {
                total: 428000000,
                brazil: {
                    total: 211000000
                }
            },
            oceania: {
                total: 41000000
            },
            antarctica: {
                total: 1000
            }
        };
    }

    // Returns array like ['westHollywood', 'losAngeles', 'california', 'usa', 'northAmerica']
    static randomLocation () {
        const tree = RegionTree.fullTree();
        let curNode = tree;
        const path = [];

        while (! RegionTree.isLeaf(curNode)) {
            const keysToPopulation = RegionTree.getKeysToPopulationObj(curNode);

            let roll = Math.random() * curNode.total;
            // TODO random select based on values of keysToPopulation obj.
            for (const key in keysToPopulation) {
                Util.logDebug(`About to decrement roll ${roll} by ${keysToPopulation[key]} thanks to ${key}`);

                roll -= keysToPopulation[key];

                if (roll <= 0) {
                    path.unshift(key);

                    // Note that when key is 'other', curNode will become undefined. isLeaf() will handle this.
                    curNode = curNode[key];
                    break;
                }
            }

            if (roll > 0) {
                throw new Error(`Didnt expect to match nothing with random roll ${roll} and path ${path}.`);
            }
        }

        return path;
    }

    // Returns a flat obj describing the pop of each child (inc other)
    static getKeysToPopulationObj (node) {
        if (RegionTree.isLeaf(node)) {
            return;
        }

        const keysToPopulation = {};

        for (const key in node) {
            if (key === 'total') {
                continue;
            }

            keysToPopulation[key] = RegionTree.getTotal(node[key]);
        }

        const missingCount = node.total - Util.sum(Object.values(keysToPopulation));

        if (missingCount > 0) {

            if (missingCount === undefined) {
                throw new Error(`weird bug again. node's keys are ${Object.keys(node)}`)
            }

            keysToPopulation.other = missingCount;
        }

        return keysToPopulation;
    }

    static printMissingCounts () {
        const tree = RegionTree.fullTree();

        addMissingCounts(tree);

        Util.log(tree);

        function addMissingCounts (node) {
            if (RegionTree.isLeaf(node)) {
                return;
            }

            const k2p = RegionTree.getKeysToPopulationObj(node);

            if (k2p.other) {
                node.other = k2p.other;
            }

            for (const key in node) {
                addMissingCounts(node[key]);
            }
        }
    }

    // static missingCount () {

    // }

    static isLeaf (node) {
        if (! node || Util.isNumber(node)) {
            return true;
        }

        const keys = Object.keys(node);

        if (keys.length === 1 && keys[0] === 'total') {
            return true;
        }

        return false;
    }

    static getTotal (node) {
        if (Util.isNumber(node)) {
            return node;
        }

        if (! node.total) {
            throw new Error(`Cant interpret tree node: ${Util.stringify(node)}`);
        }

        return node.total;
    }

    static run () {
        // RegionTree.printMissingCounts();
        const path = RegionTree.randomLocation();
        Util.log(path);
    }
};

module.exports = RegionTree;


RegionTree.run();

