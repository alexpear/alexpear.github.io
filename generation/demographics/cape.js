'use strict';

const RegionTree = require('./regionTree.js');

const Util = require('../../util/util.js');

// For the Cape Demographics fan project.
class Cape {
    constructor () {
        // Also capeName, real initials, hero/rogue/villain, PRT classification, gender, MBTI, etc
        this.location = RegionTree.randomLocation().reverse();
    }

    toCsvRow () {
        const locString = this.location.join(',');

        return [locString].join(',');
    }

    // input: [continent, nation, province, city, borough, neighborhood]
    // returns: Cape[]
    static inLocation (path) {
        return Cape.EVERYONE.filter(
            cape => {
                for (let i = 0; i < path.length; i++) {
                    if (path[i] !== cape.location[i]) {
                        return false;
                    }
                }

                return true;
            }
        );
    }

    static toCsv (capes) {
        return capes.map(
            c => c.toCsvRow()
        ).join('\n');
    }

    static run () {
        Cape.EVERYONE = [];

        // for (let i = 0; i < 700000; i++) {
        for (let i = 0; i < 700000; i++) {
            Cape.EVERYONE.push(new Cape());

            if (i % 50000 === 0) {
                Util.log(i);
            }
        }

        const locals = Cape.inLocation(['northAmerica', 'usa', 'newHampshire']);
        // const locals = Cape.inLocation(['eurasia']);

        Util.log('\n' + Cape.toCsv(locals));
    }
};

module.exports = Cape;

Cape.run();
