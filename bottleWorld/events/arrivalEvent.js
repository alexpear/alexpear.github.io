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
        const arriver = this.templateName ?
            worldState.fromTemplateName(this.templateName) :
            worldState.fromId(this.protagonistId);

        worldState.addThing(arriver, this.coord);

        const firstAction = arriver.actions()[0];

        // Util.logDebug(`arriver.templateName: ${arriver.templateName}, arriver.template: ${arriver.template}, arriver.constructor.name: ${arriver.constructor.name}, firstAction: ${firstAction}, worldState.glossary.soldier.actions.length: ${worldState.glossary.soldier.actions.length}`);

        if (! firstAction) {
            return;
        }

        const actionReadyEvent = new ActionReadyEvent(arriver, firstAction.id);

        this.outcomes.push(actionReadyEvent);

        worldState.timeline.addEvent(
            actionReadyEvent,
            this.t + ArrivalEvent.ACTION_DELAY
        );

        // Later ignore that ACTION_DELAY placeholder in favor of information found in codex templates.
    }
};

ArrivalEvent.ACTION_DELAY = 5;
