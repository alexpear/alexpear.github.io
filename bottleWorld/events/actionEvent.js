'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
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

        // TODO Call a shoot function to figure out what happens. Perhaps in Battle20.
        // Store representations of what happens either here or in a UpdateEvent.
        // Give that BEvent a func that outputs a logging string, with a pretty and a verbose mode.

        // Then replace the shoot logic in fishtank/src/fishTank.js

        // Information to be persisted:
        // For every attack (shot), what happens to it
        // Could fail to fire (weapon jam, weapon explodes)
        // Could miss
        // Could hit cover and be stopped
        // Nonfinal outcome: Could hit cover and continue anyway
        // Could hit armor and be stopped
        // Nonfinal outcome: Could hit armor and continue anyway
        // Could hit target (and some combination of cover and/or armor) and do X damage to SP
        // Later, could do things besides damage too.
        // There could also be AoE (splash) damage
        // TLDR: Misfire, Miss, HitCover, HitArmor, Effect <- values of ShotOutcome enum
        // ShotEvent has a prop of type ShotOutcome[]
        // Or AttackEvent and AttackOutcome, or ProjectileEvent and ProjectileOutcome
        // AreaEvent or AoEEvent <- for explosions, AoEs, etc

        // ActionEvent should ask the actionTemplate how many shots to make (default 1).
        // For each, add a ProjectileEvent. Then the ActionEvent is done.
    }
};
