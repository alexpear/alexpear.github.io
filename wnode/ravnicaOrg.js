'use strict';

const WNode = require('./wnode.js');
const Organization = require('./organization.js');

const NodeTemplate = require('../battle20/nodeTemplate.js');

const Coord = require('../util/coord.js');
const MtgColor = require('../util/mtgColor.js');
const MtgColorSet = require('../util/mtgColorSet.js');
const Util = require('../util/util.js');

module.exports = class RavnicaOrg extends Organization {
    constructor (colorA, colorB, leaderTemplateName) {
        super();

        this.colors = colorA ?
            [colorA, colorB] :
            MtgColor.randomSet(2);

        this.wealth = Util.randomUpTo(100);

        this.opinionOf = {};
    }

    initOpinions (worldState) {
        const orgs = worldState.activeNodes()
            .filter(
                n => n.constructor.name === 'RavnicaOrg'
            );

        orgs.forEach(
            o => {
                
            }
        );

    }

    colorOpinionOf (other) {
        return MtgColorSet.opinionOf(this.colors, other.colors);
    }

    hasColor (color) {
        return Util.contains(this.colors, color);
    }

    act (worldState) {

    }
};
