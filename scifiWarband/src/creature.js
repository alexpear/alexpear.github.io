'use strict';

//

const Event = require('./event.js');
const Templates = require('./templates.js');
const Util = require('../../util/util.js');

class Creature {
    constructor (creatureTemplate) {
        this.id = Util.uuid();
        this.template = creatureTemplate;
        this.shields = this.template.shields || 0;
        this.cooldownEnds = Infinity;

        // Used to track buffs, debuffs, injuries, whether ko, etc.
        this.status = {};
    }

    isKO () {
        return !! this.status.ko;
    }

    // creates Event
    update (t) {
        if (this.isKO()) { return; }

        if (this.cooldownEnds <= t) {
            if (this.shields < this.template.shields) {
                this.shields = this.shields + this.template.shieldRegen;

                if (this.shields >= this.template.shields) {
                    this.shields = this.template.shields;
                    this.cooldownEnds = Infinity;
                }

                return Event.update(this);
            }
        }
    }

    speed () {
        return this.template.speed + (this.status.speed || 0);
    }

    intrinsicAccuracy () {
        return this.template.accuracy + (this.status.accuracy || 0);
    }

    accuracy (weaponTemplate) {
        return this.intrinsicAccuracy() + (weaponTemplate.accuracy || 0);
    }

    durability () {
        return this.template.durability + (this.status.durability || 0);
    }

    weapon (targetSquad) {
        return this.template.items[0]; // LATER choose a weapon, or have a better preset system.
        // LATER use this.items, to track things theyve picked up during battle.
    }

    // Returns number in range [0, 1]
    healthBar () {
        if (this.isKO()) {
            return 0;
        }

        // const stats = {
        //     speed: {
        //         base: this.template.speed,
        //         modifier: this.status.speed || 0,
        //     },
        //     accuracy: {
        //         base: this.template.speed,
        //         modifier: this.status.speed || 0,
        //     },
        //     durability: {
        //         base: this.template.speed,
        //         modifier: this.status.speed || 0,
        //     },
        // };

        return Math.min(
            this.traitHealthBar('speed'),
            this.traitHealthBar('accuracy'),
            this.traitHealthBar('durability')
        );
    }

    traitHealthBar (trait) {
        // Note - Epsilon prevents division by zero.
        const base = this.template[trait] || Number.EPSILON;
        const modifier = this.status[trait] || 0;

        const ratio = (base + modifier) / base;

        if (! Util.exists(ratio)) {
            Util.logDebug(`Creature.traitHealthBar(${trait}): modifier is ${modifier}, ratio is ${ratio}`);
            throw new Error(this.toJson());
        }

        return ratio;
    }

    // returns number in range [-10, 10]
    // For squads to poll their members' perspectives.
    morale () {
        return 5; // Later add complexity
    }

    // LATER Could move this to main encounter class if that makes cover calc easier.
    // returns Event[]
    attack (otherSquad, coverPercent = 0) {
        const distance = this.squad.distanceTo(otherSquad);
        const weaponTemplate = this.weapon(); 

        // eg: Melee weapons have a strict max range.
        if (distance > weaponTemplate.maxRange) {            
            Util.logEvent(`Creature ${this.id} won't participate in attack because it's beyond this weapon's maxRange: ${weaponTemplate.maxRange}`);
            return;
        }

        const advantage = otherSquad.size() * this.accuracy(weaponTemplate);
        const events = [];

        for (let shot = 1; shot <= Math.ceil(weaponTemplate.rof || 1); shot++) {
            //    static attack (t, attackingCreature, target, weaponTemplate, attackOutcome, shieldsTo, statusChanges) {
            const event = Event.attack(this, otherSquad, weaponTemplate);
            events.push(event);

            if (Math.random() > advantage / (advantage + distance + 1)) {
                event.details.attackOutcome = Event.ATTACK_OUTCOME.Miss;
                continue;
            }

            if (Math.random() <= coverPercent) {
                event.details.attackOutcome = Event.ATTACK_OUTCOME.Cover;
                continue;
            }

            const victim = otherSquad.whoGotHit();
            event.details.targetCreature = victim;
            event.details.attackOutcome = Event.ATTACK_OUTCOME.Hit;

            events.push(victim.takeHit(weaponTemplate));
        }

        return events;
    }

    // After considering cover.
    // returns Event
    takeHit (weaponTemplate, t) {
        let damage = weaponTemplate.damage;

        if (this.shields) {
            // TODO decide whether to get t by passing, by a static variable, or set it later.
            this.cooldownEnds = t + this.template.shieldDelay;

            if (weaponTemplate.attackType === Creature.ATTACK_TYPE.Plasma) {
                this.shields -= damage * 2;

                if (this.shields < 0) {
                    damage = Math.abs(this.shields) / 2;
                    this.shields = 0;
                    this.takeUnshieldedDamage(damage, weaponTemplate);    
                }
            }
            else {
                this.shields -= damage;

                if (this.shields < 0) {
                    damage = Math.abs(this.shields);
                    this.shields = 0;
                    this.takeUnshieldedDamage(damage, weaponTemplate);    
                }
            }
        }
        else {
            this.takeUnshieldedDamage(damage, weaponTemplate);    
        }

        // Looks at this.shields, this.cooldownEnds maybe, this.status
        const event = Event.hit(this, weaponTemplate);
        return event;
    }

    takeUnshieldedDamage (damage, weaponTemplate) {
        const resistance = this.template.resistance[weaponTemplate.attackType];
        if (resistance) {
            damage *= resistance;
        }

        const harm = damage / ((damage + this.durability()) * Math.random());

        if (harm < 1) { return; }

        const harmedTrait = Util.randomOf(['speed', 'accuracy', 'durability']);

        if (this.status[harmedTrait]) {
            this.status[harmedTrait] -= Math.floor(harm);
        }
        else {
            this.status[harmedTrait] = Math.floor(harm) * -1;
        }

        if (this.template[harmedTrait] + this.status[harmedTrait] < 0) {
            // Too much damage in 1 category causes KO.
            this.status.ko = true;
        }
    }

    toJson () {
        const json = Util.certainKeysOf(
            this, 
            ['id', 'template', 'shields', 'cooldownEnds', 'status']
        );

        json.squad = this.squad?.id;

        return json;
    }

    static example () {
        const cr = new Creature(
            Templates.Halo.UNSC.Creature.Marine
        );

        return cr;
    }
}

// TODO move this and Squad.TEMPLATES to a WarbandTemplates.js file
// TODO restructure - WarbandTemplates.UNSC.Creature.Marine
// Creature.TEMPLATES = {
//     Marine: {
//         size: 2,
//         speed: 1, 
//         durability: 10,
//         accuracy: 1, // Later finalize how this calc works.
//         resistance: {},
//         items: [Item.TEMPLATES.UNSC.Weapon.SMG]
//     },
//     // Motive for accuracy stat - Spartans better with firearms than Grunts, also makes takeUnshieldedDamage() status effects simpler.
//     // LATER How does damage work for: Scorpion, Scarab, UNSC Frigate? Based on status debuffs?
// };

module.exports = Creature;
