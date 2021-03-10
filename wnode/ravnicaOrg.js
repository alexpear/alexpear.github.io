'use strict';

const WNode = require('./wnode.js');
const Organization = require('./organization.js');

const NodeTemplate = require('../battle20/nodeTemplate.js');

const RandomNames = require('../generation/randomNames.js');

const Coord = require('../util/coord.js');
const MtgColor = require('../util/mtgColor.js');
const MtgColorSet = require('../util/mtgColorSet.js');
const Util = require('../util/util.js');

module.exports = class RavnicaOrg extends Organization {
    constructor (colorA, colorB, leaderTemplateName) {
        super();

        this.displayName = RandomNames.name();

        // [], not MtgColorSet obj.
        this.colors = colorA ?
            [colorA, colorB] :
            MtgColor.randomSet(2);

        this.wealth = Util.randomUpTo(100);

        this.opinionOf = {};
    }

    initOpinionOn (other) {
        if (other === this || other.constructor.name !== 'RavnicaOrg') {
            return;
        }

        this.opinionOf[other.id] = this.colorOpinionOf(other);
    }

    colorOpinionOf (other) {
        return MtgColorSet.opinionOf(this.colors, other.colors);
    }

    hasColor (color) {
        return Util.contains(this.colors, color);
    }

    // Could rename to chooseAction() or getAction()
    act (worldState) {
        let nemesisId;

        for (let id in this.opinionOf) {
            if (id === this.id) {
                continue;
            }

            if (! nemesisId || this.opinionOf[nemesisId] > this.opinionOf[id]) {
                nemesisId = id;
            }
        }

        return {
            action: 'stealFrom',
            target: nemesisId
        };
    }
};
