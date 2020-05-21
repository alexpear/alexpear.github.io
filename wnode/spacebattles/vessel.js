'use strict';

const Chassis = require('./codex/chassis.js');
const Parts = require('./codex/parts.js');
const Thing = require('../thing.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const _ = require('lodash');
const d20 = require('d20');
const Yaml = require('js-yaml');

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

        summary.components = [];

        for (const c of this.components) {
            // summary.components[c.template.name] = c.template.power || 0;
            summary.components.push(//`${c.template.name} (${c.template.power})`);
                {
                    name: c.template.name,
                    power: c.template.power || 0
                }
            );
        }

        summary.components.sort(
            (a, b) => a.power === b.power ?
                a.name.localeCompare(b.name) :
                b.power - a.power
        );

        summary.components = summary.components.map(
            c => `${c.name} (${c.power})`
        );


        return summary;
    }

    simpleYaml () {
        return '\n' + Yaml.dump(this.simpleJson());
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

    legal (techs) {
        techs = techs || [];

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
                for (const tech of (c.template.techsRequired || [])) {
                    const requirement = tech === 'this' ?
                        c.template.name :
                        tech;

                    if (! techs.includes(requirement)) {
                        return false;
                    }
                }

                if (seen[c.template.name]) {
                    // 2 of the same unique part.
                    return false;
                }

                if (c.template.unique) {
                    seen[c.template.name] = true;                    
                }
            }
        }

        return true;
    }

    getTraits () {
        return {
            legal: this.legal(),
            netPower: this.netPower(),
            travel: this.getTravelDistance(),
            initiative: this.getInitiative(),
            durability: this.getDurability(),
            aiming: this.getAimingModifier(),
            shieldPenalty: this.getShieldPenalty(),
            attacks: this.attackSummary()
        };
    }

    traitsString () {
        const traits = this.getTraits();

        const legalStr = traits.legal ? 'Legal' : 'Illegal';

        const formatted = {
            legal: '\t' + legalStr,
            netPower: `${traits.netPower}`,
            travel: Util.asBar(traits.travel),
            initiative: Util.asBar(traits.initiative),
            durability: Util.asBar(traits.durability),
            aiming: Util.asBar(traits.aiming),
            shields: Util.asBar(traits.shieldPenalty * -1),
            attacks: '\n' + traits.attacks.join('\n')
        };

        return Object.keys(formatted).map(
            key => `${Util.capitalized(key)}: \t${formatted[key]}`
        )
        .join('\n');
    }

    getInitiative () {
        const trait = 'initiative';
        return (this.template.bonus && this.template.bonus[trait] || 0) +
            (this.traitSumFromParts(trait) || 0);
    }

    getTravelDistance () {
        const trait = 'travel';
        return (this.template.bonus && this.template.bonus[trait] || 0) +
            (this.traitSumFromParts(trait) || 0);
    }

    getDurability () {
        const trait = 'durability';
        return 1 +
            (this.template.bonus && this.template.bonus[trait] || 0) +
            (this.traitSumFromParts(trait) || 0);
    }

    getAimingModifier () {
        const trait = 'aiming';
        return (this.template.bonus && this.template.bonus[trait] || 0) +
            (this.traitSumFromParts(trait) || 0);
    }

    getShieldPenalty () {
        const trait = 'shieldPenalty';
        return (this.template.bonus && this.template.bonus[trait] || 0) +
            (this.traitSumFromParts(trait) || 0);
    }

    traitSumFromParts (trait) {
        let sum = 0;

        for (const c of this.components) {
            if (c.template && c.template[trait]) {
                sum += c.template[trait];
            }
        }

        return sum;
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
        const fromChassis = this.template.bonus && this.template.bonus.attacks || [];

        const fromParts = this.components
            .filter(
                c => c.template.attack
            )
            .map(
                c => c.template.attack
            );

        return fromChassis.concat(fromParts);
    }

    // Returns string[]
    // For logging or display
    attackSummary () {
        const attacks = this.getAllAttacks();
        
        attacks.sort(
            (a, b) => a.damage - b.damage
        );

        const byDamage = {};

        attacks.forEach(a => {
            const newDice = a.dice || 0;
            const damage = a.damage || 'rift';

            if (! byDamage[damage]) {
                byDamage[damage] = {
                    dice: newDice,
                    missile: a.missile,
                    rift: a.rift
                };

                return;
            }

            byDamage[damage].dice += newDice;
        });

        // Util.logDebug(byDamage);

        return Object.keys(byDamage).map(
            damage => {
                const diceGroup = byDamage[damage];

                const missileNote = diceGroup.missile ?
                    ' (missile)' :
                    '';

                if (damage === 'rift') {
                    return `Rift x${diceGroup.dice}${missileNote}`;
                }

                let symbolic = '';

                for (let i = 0; i < damage; i++) {
                    symbolic = symbolic + '*';
                }

                return `${symbolic} x${diceGroup.dice}${missileNote}`;
            }
        )
    }

    totalDice (attacks) {
        attacks = Util.array(attacks);

        return Util.sum(
            attacks.map(a => a.dice)
        );
    }

    averageDamage (attacks) {
        attacks = Util.array(attacks);

        return Util.mean(
            attacks.map(
                a => a.rift ?
                    2 : // This is a approximation
                    a.damage
            )
        );
    }

    static example () {
        return Vessel.randomEclipseShip();
    }

    static riftExample () {
        const ship = Vessel.randomEclipseShip();
        ship.components.push(Vessel.makePart('riftCannon'));

        // Probably not a legal blueprint.
        return ship;
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
            // Later maybe itd be neater to give rollDie a options param that can have rift: true.
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

    // Has side effects, returns nothing.
    randomizeParts (techs, maxSurplus) {
        techs = techs || [];
        maxSurplus = maxSurplus || 20;

        // Remove all existing Part components
        this.components = this.components.filter(
            c => (! c.template) || c.template.context !== Vessel.ShipPartContext
        );

        const partNames = Object.keys(Parts);
        // const partNames = ['fissionReactor'];
        let slotsFilled = 0;

        let attempts = 0;
        while (slotsFilled < this.template.slots && attempts < 200) {
            const name = Util.randomOf(partNames);

            this.components.push(
                Vessel.makePart(name)
            );

            // Later, improve surplus logic. Should be able to add a big reactor but then add lots of power-hungry parts to use it.
            if (this.legal() && this.netPower() <= maxSurplus) {
                slotsFilled += 1;
            }
            else {
                this.components.pop();
            }

            attempts++;
        }
    }

    // Has side effects, returns nothing.
    improve () {
        let attempts = 0;

        while (attempts < 100) {
            attempts++;

            const startingPower = this.netPower();

            if (startingPower <= 0) {
                break;
            }

            const i = Util.randomUpTo(this.components.length - 1);
            const existing = this.components[i];

            // Dont replace reactors.
            if (existing.template.power > 0) {
                continue;
            }

            this.components[i] = Vessel.randomPart();

            if (! this.legal() || this.netPower() >= startingPower) {
                // Undo.
                this.components[i] = existing;
                continue;
            }

            // Util.logDebug(`Replacing ${existing.template.name} with ${this.components[i].template.name}`)
        }
    }

    static randomPart () {
        const name = Util.randomOf(Object.keys(Parts));

        return Vessel.makePart(name);
    }

    static makePart (partName) {
        const template = Parts[partName];

        template.name = partName;
        template.context = Vessel.ShipPartContext;

        const part = new Thing(template);
        delete part.coord;

        return part;
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

    static allTechs () {
        return Object.keys(Parts);
    }

    static test () {
        const ship = Vessel.randomEclipseShip();

        // Util.logDebug(ship.simpleYaml());
        // Util.logDebug(ship.getTraits());

        ship.improve();

        Util.logDebug(ship.simpleYaml());
        Util.logDebug('\n' + ship.traitsString());
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
