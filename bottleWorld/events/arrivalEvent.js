'use strict';

const ActionReadyEvent = require('./actionReadyEvent.js');
const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const ArrivalEvent = module.exports = class ArrivalEvent extends BEvent {
    constructor (templateName, coord) {
        super(
            BEvent.TYPES.Arrival,
            undefined,
            undefined,
            coord || new Coord(),
            templateName
        );
    }

    resolve (worldState) {
        const arriver = !! this.templateName ?
            worldState.fromTemplateName(this.templateName) :
            worldState.fromId(this.protagonistId);

        worldState.addThing(arriver, this.coord);

        const timeline = worldState.timeline;

        timeline.addEvent(
            new ActionReadyEvent(arriver, arriver.actions()[0].id),
            timeline.now() + ArrivalEvent.ACTION_DELAY
        );

        // Later ignore that ACTION_DELAY placeholder in favor of information found in codex templates.
    }
};

ArrivalEvent.ACTION_DELAY = 5;
