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
        const target = worldState.fromId(this.targetId);
        const actionTemplate = worldState.fromId(this.actionId);

        // Then replace the shoot logic in fishtank/src/fishTank.js

        const shotsPerSecond = (actionTemplate && actionTemplate.shotsPerSecond) || 1;

        for (let i = 0; i < shotsPerSecond; i++) {
            const shot = new ProjectileEvent(actionTemplate, target, this.coord);
            this.outcomes.push(shot);

            // Util.logDebug(`In ActionEvent.resolve(), about to call timeline.addEvent(ProjectileEvent, t)`);

            worldState.timeline.addEvent(
                shot,
                this.t
            );
        }
    }
};
