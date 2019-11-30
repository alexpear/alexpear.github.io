'use strict';

const ActionEvent = require('./actionEvent.js');
const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ActionReadyEvent extends BEvent {
    // protagonist is a input param of type Thing.
    constructor (protagonist, actionId) {
        super(
            BEvent.TYPES.ActionReady,
            protagonist
        );

        this.actionId = actionId;
    }

    resolve (worldState) {
        const protagonist = this.protagonist;

        // Later could relax the requirement that protagonist.template be populated, if that seems unnecessary.
        if (
            ! protagonist.getActions ||
            protagonist.getActions().length === 0 ||
            ! protagonist.template
        ) {
            throw new Error(`ActionReadyEvent found a strange protagonist (type ${protagonist.constructor.name}) in WorldState.things. { id: ${protagonist.id}, getActions(): ${protagonist.getActions ? protagonist.getActions() : 'undefined'}, template: ${protagonist.template}, templateName: ${protagonist.templateName} }`);
        }

        if (! protagonist.active) {
            return this.happened = false;
        }

        const actions = protagonist.getActions();

        const action = actions.find(
            a => a.id === this.actionId
        ) || actions[0];

        const target = protagonist.chooseTarget(worldState, action);

        // TODO: See logs. There's a bug where ProjectileEvents keep appearing even after no targets are active anymore.
        if (! target) {
            return;
        }

        const actionEvent = new ActionEvent(protagonist, target, undefined, this.actionId);

        this.outcomes.push(actionEvent);

        // For graphics
        protagonist.lastAction = actionEvent;

        // Util.logDebug(`In ActionReadyEvent.resolve(), about to call timeline.addEvent(actionEvent, t)`);

        worldState.timeline.addEvent(
            actionEvent,
            this.t
        );

        // Util.logDebug(`Bottom of ActionReadyEvent.resolve(). Set up a future Action with range: ${action.range}.`);

    }
};
