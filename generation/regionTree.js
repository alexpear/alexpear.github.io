'use strict';

const Util = require('../util/util.js');

// Sketch of populations of nested regions in 2020 Earth.
// For the Cape Demographics fan project.
module.exports = class RegionTree {
    static fullTree () {
        return {
            total: 7500000000,
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
                    newYork: {
                        total: 1,
                        nyc: {
                            total: 1,
                            manhattan: {
                                total: 1,
                                fidi: 1
                            }
                        }
                    }
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
        const curNode = tree;
        const path = [];

        while (! RegionTree.isLeaf(curNode)) {
            const keysToPopulation = {};

            for (const key in curNode) {
                if (key === 'total') {
                    continue;
                }

                keysToPopulation[key] = RegionTree.getTotal(curNode[key]);
            }

            const missingCount = curNode.total - Util.sum(Object.values(keysToPopulation));

            if (missingCount > 0) {
                keysToPopulation.other = missingCount;
            }

            const roll = Math.random() * curNode.total;
            // TODO random select based on values of keysToPopulation obj.
            // TODO unshift() chosen key onto path array
            // curNode = selectedNode;
        }
    }

    static getKeysToPopulationObj (node) {

    }

    static printMissingCounts () {
        const tree = RegionTree.fullTree();
        const curNode = tree;

    }

    // static missingCount () {

    // }

    static isLeaf (node) {
        if (Util.isNumber(node)) {
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
};
