'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ArrivalEvent extends BEvent {
    constructor (protagonist, coord) {
        super(
            BEvent.TYPES.Arrival,
            protagonist,
            undefined,
            coord || new Coord()
        );
    }

    resolve (worldState) {
        const arriver = Util.isString(this.protagonist) ?
            worldState.fromTemplateName(this.protagonist) :  // Later write this func.
            this.protagonist;

        worldState.addThing(arriver, coord);
    }
};
