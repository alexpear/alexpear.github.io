'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ProjectileEvent extends BEvent {
    // protagonist is a input param of type Thing|string. It will be used to populate the appropriate field of BEvent.
    constructor (protagonist, target, coord, actionId) {
        super(
            BEvent.TYPES.Projectile,
            protagonist,
            target,
            coord
        );

        this.actionId = actionId;
    }

    // TODO: See Timeline.computeNextInstant(). Need to decide how to compute Events that create Events in the same second.
    resolve (worldState) {
        const protagonist = worldState.fromId(this.protagonistId);
        const target = worldState.fromId(this.targetId);
        const actionTemplate = worldState.fromId(this.actionId);

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
        // AreaEvent can have a duration prop, default value 1 (seconds)
        // Except ... also need to record how much damage the cover or armor absorbs.
        // ImpactEvent? HitEvent?
        // Should i also persist info about the cover? (coord, cover rating(s), id)
        // Should i also persist the coords of the origin and the target of the projectile?
        // What is a MRB 1 way to model this?
        // What are the most important things to persist?
        //   How much damage is done to target?
        //   Identity of target (especially if protag shoots at a squad and hits a random member of squad)
        //   .outcomes[] array, which could have AreaEvents for any resulting explosions
        //   Less important: Info about reasons why damage was zero/low, such as whether it hit cover and/or armor, or missed
        //   Even less: info about that cover

    }
};
