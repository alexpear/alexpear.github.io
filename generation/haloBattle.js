'use strict';

const HaloArmy = require('./haloArmy.js');
const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

const WNode = require('../wnode/wnode.js');

class HaloBattle extends WNode {
    constructor () {

    }



    prettyPrint () {
        Util.log(this.pretty());
    }

    static init () {
        HaloBattle.FACTIONS = {
            FORERUNNER: 'forerunner',
            FLOOD: 'flood',
            COVENANT: 'covenant',
            UNSC: 'unsc'
        };

        HaloBattle.LOCATIONS = {
            bloodGulch: {
                size: 460,
                faction: HaloBattle.FACTIONS.FORERUNNER
            },

        }

    }

    static test () {

    }
}

module.exports = HaloBattle;

HaloBattle.init();
HaloBattle.test();
