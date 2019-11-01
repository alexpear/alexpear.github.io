'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const ProjectileEvent = require('./projectileEvent.js');
const Util = require('../../util/util.js');

module.exports = class ActionEvent extends BEvent {
    // protagonist is a input param of type Thing|string. It will be used to populate the appropriate field of BEvent.
    constructor (protagonist, target, coord, actionId) {
        super(
            BEvent.TYPES.Action,
            protagonist,
            target,
            coord
        );

        this.actionId = actionId;
    }

    resolve (worldState) {
        const protagonist = worldState.fromId(this.protagonistId);

        if (! protagonist.active) {
            return;
        }

        const target = worldState.fromId(this.targetId);
        const actionTemplate = worldState.fromId(this.actionId);

        // Util.logDebug(`In ActionEvent, this.actionId is ${this.actionId}. worldState.glossary[this.actionId] is ${worldState.glossary[this.actionId]}, actionTemplate is ${actionTemplate}, target is ${target}.`);

        // In this early build, we currently assume that all actions are projectile attacks.
        const shotsPerSecond = (actionTemplate && actionTemplate.shotsPerSecond) || 1;

        for (let i = 0; i < shotsPerSecond; i++) {
            const shot = new ProjectileEvent(protagonist, target, this.coord, actionTemplate);
            this.addOutcome(shot, worldState);
        }

        worldState.setUpNextAction(
            protagonist,
            actionTemplate,
            this
        );
    }
};
