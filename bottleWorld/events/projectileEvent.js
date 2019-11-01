'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ProjectileEvent extends BEvent {
    // protagonist is a input param of type Thing|string. It will be used to populate the appropriate field of BEvent.
    constructor (protagonist, target, coord, action) {
        super(
            BEvent.TYPES.Projectile,
            protagonist,
            target,
            coord
        );

        this.actionId = action.id || action;
        this.hitTarget;
        this.resultantTargetSp;
    }

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

        // Detailed scheme:
        // Whenever a projectile impacts anything (cover or a Creature), model this with a ImpactEvent
        // This could be useful later if we want things to trigger based on loud noises, or a spark being struck and igniting a room full of flammable material.
        // (Well ... i guess those 2 things might just be caused by the ProjectileEvent directly, since they would happen even if the shot misses.)
        // For armored creatures, we could have just one ImpactEvent, and have a prop that indicates whether the armor mitigated the damage.
        // This is mildly at odds with the low-res nature of SP ... but whatever. MRB 1, right?

        // Summary of current scheme
        // ArrivalEvents create Creatures and set them up with starting ActionReadyEvents.
        // AREs entail choosing the details/parameters/target of a action and creating a ActionEvent. (You can think of them as 'Choose Action Events')
        // ActionEvents entail creating some consequential other event, such as 1 or more ProjectileEvents. They also place another ActionReadyEvent into the future.
        // ProjectileEvents may or may not hit their targets. If they do hit, they deal damage, mitigated by armor. The details of this outcome is persisted in the ProjectileEvent. Suggestion: They store a number describing the resultant SP of the target.
        // Hits by explosive weapons or on explosive objects can cause a ExplosionEvent. Grenades cause a delayed ExplosionEvent regardless of whether they hit. Certain machines also cause EEs when eliminated.
        // Other consequences that could be modeled in the ProjectileEvent: Injury effects (MRB 2), morale effects from the hit (probably a separate Event that looks back retrospectively? MRB 2 regardless.), probably a specific EliminationEvent or CasualtyEvent.
        // But for now i could just include the creature-removal logic (upon 0 SP) in ProjectileEvent.resolve()

        // Old:
        // If they do hit, they cause a ImpactEvent (or ExplosionEvent, for explosive weapons etc).
        // ImpactEvent.resolve() includes determining whether the attack does damage. If so, the target.sp prop is updated and this is persisted in the ImpactEvent. This can cause a CasualtyEvent if the target is out of action.
        // ^ Old ^

        // Summary of current combat algorithm:
        // When attacking, attacker selects a random active (ie not eliminated) creature of a different faction.
        // MRB 1: Totally ignore range. Ignore all concerns of space for now.
        // The ProjectileEvent rolls to hit. Undecided whether to use WCW ballistics or Battle20 d20 roll. Just do something MRB 1 and quick, and make it modular so i can change the func later. Computationally fast is good too.
        // MRB 1: Ignore the concept of cover for now.
        // If hit, apply damage.
        // MRB 1: Ignore armor and/or resistance for now.
        // If SP is now 0 or less, set target.active = false
        // (For MRB 2, note that 10 Projectiles might hit a target in one second, the first bringing the SP to 0, and the rest being redundant. Later check for this scenario here. For now it's fine to just keep decrementing the SP negative and setting false to false.)

        // Later can persist more detailed outcomes, such as the projectile bursting thru cover into target, or critical hits.
        this.hitTarget = this.doesItHit(protagonist, actionTemplate, target, worldState);

        if (! this.hitTarget) {
            // Util.logDebug(`In ProjectileEvent, targetId is ${this.targetId}`);

            this.resultantTargetSp = target.sp;
            return;
        }

        // Util.logDebug(`In ProjectileEvent, actionId is ${this.actionId}`);

        target.sp -= actionTemplate.damage;
        this.resultantTargetSp = target.sp;

        if (target.sp <= 0) {
            target.active = false;
        }
    }

    doesItHit (protagonist, actionTemplate, target, worldState) {
        // TODO Replace this func with any hit-roll alg.
        // return Util.randomOf([true, false, false]);
        return true;
    }
};
