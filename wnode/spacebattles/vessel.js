'use strict';

const Chassis = require('./codex/chassis.js');
const Parts = require('./codex/parts.js');
const Thing = require('../thing.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const _ = require('lodash');
const d20 = require('d20');

// Modular spaceship minigame inspired by Eclipse: Second Dawn board game.
class Vessel extends Thing {
    constructor (chassisTemplate, parts, coord) {
        super(chassisTemplate);

        this.components = this.components.concat(parts || []);

        if (! this.legal()) {
            throw new Error(`I cannot construct this illegal ship! ${this.debugString()}`);
        }

        this.coord = coord;

        this.maxDurability = this.getDurability();
        this.currentDurability = this.maxDurability;
    }

    debugString () {
        return JSON.stringify(this.toJson(), undefined, '    ');
    }

    simpleJson () {
        const summary = {
            templateName: this.template.name,
            currentDurability: this.currentDurability
        };

        summary.components = {};

        for (const c of this.components) {
            summary.components[c.template.name] = c.template.power || 0;
        }

        return summary;
    }

    netPower () {
        const parts = this.getParts();

        return Util.sum(
            parts.map(
                p => p.template.power || 0
            )
        );
    }

    getParts () {
        return this.components.filter(
            c => c.template.context === Vessel.ShipPartContext
        );
    }

    legal () {
        const parts = this.getParts();

        if (parts.length > this.template.slots) {
            return false;
        }

        const netPower = this.netPower();

        if (netPower < 0) {
            return false;
        }

        const seen = {};

        for (const c of this.components) {
            if (c.template.context === Vessel.ShipPartContext) {
                if (seen[c.template.name]) {
                    // 2 of the same unique part.
                    return false;
                }

                seen[c.template.name] = true;
            }
        }

        // Later: Check tech requirements

        return true;
    }

    getInitiative () {
        return this.traitSumFromParts('initiative');
    }

    getTravelDistance () {
        return this.traitSumFromParts('travel');
    }

    // Hull total + 1
    getDurability () {
        return 1 + this.traitSumFromParts('durability');
    }

    getMissileAttacks () {
        const attacks = this.getAllAttacks()
            .filter(
                a => a.missile
            );

        return attacks;
    }

    getNormalAttacks () {
        const attacks = this.getAllAttacks()
            .filter(
                a => ! a.missile
            );

        return attacks;
    }

    getAllAttacks () {
        return this.components
            .filter(
                c => c.template.attack
            )
            .map(
                c => c.template.attack
            );
    }

    getAimingModifier () {
        return this.traitSumFromParts('aiming');
    }

    getShieldPenalty () {
        return this.traitSumFromParts('shieldPenalty');
    }

    static example () {
        const ship = Vessel.randomEclipseShip();
    }

    static getExampleAttack () {
        return {
            missile: true,
            aiming: 1,
            dice: 4,
            // damage is per die
            damage: 2
        };
    }

    traitSumFromParts (trait) {
        const sum = 0;

        for (const c of this.components) {
            if (c.template && c.template[trait]) {
                sum += c.template[trait];
            }
        }

        return sum;
    }

    // Returns array of effects
    rollAttackDice (missileMode) {
        const attacks = missileMode ?
            this.getMissileAttacks() :
            this.getNormalAttacks();

        const rolledDice = [];

        for (const attack of attacks) {
            for (let i = 0; i < attack.dice; i++) {
                const special = attack.rift ?
                    'rift' :
                    undefined;

                rolledDice.push(
                    this.rollDie(attack.damage, this.getAimingModifier(), special)
                );
            }
        }

        return rolledDice;
    }

    rollMissileDice () {
        return this.rollAttackDice(true);
    }

    rollDie (damage, modifier, special) {
        const summary = {
            damage: damage
            // outcome: undefined
        };

        const roll = d20.roll(6);

        if (special === 'rift') {
            // TODO, see face summary in parts.js
        }

        if (roll === 1) {
            summary.outcome = DieOutcome.Miss;
        }
        else {
            summary.outcome = roll === 6 ?
                DieOutcome.CriticalHit :
                DieOutcome.Number;
        }

        summary.value = roll + modifier;

        return summary;
    }

    getExampleAttackDice () {
        // These are the rolled dice that are available to be assigned to targets.
        return [
            {
                outcome: DieOutcome.CriticalHit,
                value: 6,
                damage: 2
            },
            {
                outcome: DieOutcome.Number,
                value: 7,
                damage: 2
            },
            {
                outcome: DieOutcome.Number,
                value: 3,
                damage: 2
            },
            {
                outcome: DieOutcome.Miss,
                value: 1,
                damage: 1
            }
        ];
    }

    // input: array of rolled dice.
    // Returns number of durability points that would be lost by absorbing these dice.
    // No side effects.
    damageFromDice (dice) {
        const expectedDamage = 0;
        const shieldPenalty = this.getShieldPenalty();

        for (const die of dice) {
            if (
                die.outcome === DieOutcome.CriticalHit ||
                die.outcome === DieOutcome.Number &&
                die.value - shieldPenalty >= 6
            ) {
                expectedDamage += die.damage;
            }
        }

        return expectedDamage;
    }

    // Side effects, returns nothing.
    randomizeParts (techs) {
        techs = techs || [];

        // Remove all existing Part components
        this.components = this.components.filter(
            c => (! c.template) || c.template.context !== Vessel.ShipPartContext
        );

        // TODO: Enable repeats of non-unique parts
        const partNames = _.shuffle(Object.keys(Parts));
        let slotsFilled = 0;

        for (const name of partNames) {
            if (slotsFilled >= this.template.slots) {
                break;
            }

            const part = Vessel.makePart(name);
            delete part.coord;

            this.components.push(part);

            if (this.legal()) {
                slotsFilled += 1;
            }
            else {
                this.components.pop();
            }
        }
    }

    static makePart (partName) {
        const template = Parts[partName];

        template.name = partName;
        template.context = Vessel.ShipPartContext;

        return new Thing(template);
    }

    static randomEclipseShip () {
        const chassisName = Util.randomOf([
            'interceptor',
            'cruiser',
            'dreadnought',
            'starbase',
            // 'ancient',
            // 'guardian',
            // 'gccs'
        ]);

        const vessel = new Vessel(Chassis[chassisName]);

        vessel.randomizeParts();

        return vessel;
    }

    static test () {
        const ship = Vessel.randomEclipseShip();

        Util.logDebug(ship.simpleJson());

        Util.logDebug(`Net Power: ${ship.netPower()}. Legal? ${ship.legal()}`)
    }
};

Vessel.ShipPartContext = 'shipPart';

Vessel.DieOutcome = Util.makeEnum([
    'Miss',
    'Number',
    'CriticalHit',
    'FriendlyFire'
]);

module.exports = Vessel;

Vessel.test();
