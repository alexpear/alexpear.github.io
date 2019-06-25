'use strict';

const ActionReadyEvent = require('./actionReadyEvent.js');
const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const ArrivalEvent = module.exports = class ArrivalEvent extends BEvent {
    constructor (protagonist, coord) {
        super(
            BEvent.TYPES.Arrival,
            protagonist,
            undefined,
            coord || new Coord()
        );
    }

    resolve (worldState) {
        // Util.log(`Top of ArrivalEvent.resolve()`, `debug`);

        const arriver = Util.isString(this.protagonist) ?
            worldState.fromTemplateName(this.protagonist) :
            this.protagonist;

        worldState.addThing(arriver, this.coord);

        const timeline = worldState.timeline;

        timeline.addEvent(
            new ActionReadyEvent(this.protagonist, 'basicAttack'),
            timeline.now() + ArrivalEvent.ACTION_DELAY
        );
    }
};

ArrivalEvent.ACTION_DELAY = 6;
