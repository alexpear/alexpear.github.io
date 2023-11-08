'use strict';

//

const Item = require('./item.js');
const Event = require('./event.js');
const Templates = require('./templates.js');
const Util = require('../../util/util.js');

class Creature {
    constructor (creatureTemplate, items) {
        this.id = Util.uuid();
        this.template = creatureTemplate;
        this.items = [];
        this.shields = this.template.shields || 0;
        this.cooldownEnds = Infinity;

        // Used to track buffs, debuffs, injuries, whether ko, etc.
        this.status = {};

        if (items) {
            this.items = items;
        }
        else {
            const templateItems = this.template.items || [];
            for (let itemTemplate of templateItems) {
                this.items.push(
                    new Item(itemTemplate)
                );
            }
        }
    }

    isKO () {
        return !! this.status.ko;
    }

    faction () {
        return this.template.faction;
    }

    // creates Event
    update () {
        if (this.isKO()) { return; }

        if (this.cooldownEnds <= Event.t) {
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
        return Math.max(
            this.template.speed + (this.status.speed || 0),
            1
        );
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

        const unshieldedRatio = Util.min(
            this.traitHealthBar('speed'),
            this.traitHealthBar('accuracy'),
            this.traitHealthBar('durability'),
        );

        // LATER could establish proportion between shields & unshielded here, by looking at min of the 3 unshielded traits.
        const baseline = this.template.shields ?
            2 :
            1;

        return (unshieldedRatio + this.shieldHealthBar()) / baseline;
    }

    static testHealthBar () {
        const min = Util.min(0.1, 0.2, 0.3);
        const min2 = Util.min([0.1, 0.2, 0.3]);
        const expected = 0.1;

        if (min !== min2 || min2 !== expected) {
            throw new Error(`${min}, ${min2}`);
        }
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

    shieldHealthBar () {
        const current = this.shields || 0;
        const total = this.template.shields || Number.EPSILON;

        return current / total;
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
    takeHit (weaponTemplate) {
        let damage = weaponTemplate.damage;

        if (this.shields) {
            this.cooldownEnds = Event.t + (this.template.shieldDelay || 2);

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

    // LATER put in superclass Component.
    toJsonStr () {
        return Util.stringify(this.toJson());
    }

    name () {
        return this.nameGenerated || (this.template.name + ' ' + Util.shortId(this.id));
    }

    static example () {
        const cr = new Creature(
            Templates.Halo.UNSC.Creature.Marine
        );

        return cr;
    }
}

module.exports = Creature;

// Creature.testHealthBar();
