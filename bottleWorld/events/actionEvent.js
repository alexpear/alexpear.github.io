'use strict';

const ProjectileEvent = require('./projectileEvent.js');

const BEvent = require('../bEvent.js');

const WorldState = require('../../bottleWorld/worldState.js');

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ActionEvent extends BEvent {
    // protagonist is a input param of type Thing.
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
        const protagonist = this.protagonist;

        if (! protagonist.active) {
            return;
        }

        const target = this.target;
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

    // TODO draft a func for calculating the outcome of one Group shooting another. Probably high precision if that's more familiar. Easy to change later.
    // Note: Since it's multiple projectiles, this seems more relevant to ActionEvent than ProjectileEvent
    resolveForGroups (worldState) {

    }

    static testGroupAttack (protagonistGroup, targetGroup, actionTemplate) {
        const dummyWorldState = new WorldState();
        const event = new ActionEvent(protagonistGroup, targetGroup, undefined, actionTemplate.id);

        event.resolveForGroups(dummyWorldState);

        Util.logDebug(event);
    }

};
