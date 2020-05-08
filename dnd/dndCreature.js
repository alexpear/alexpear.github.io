'use strict';

const DamageTypes = require('./damageTypes.js');

// I found monsters.js on Github and am using it as a casual prototype starting point.
// Later could set up a hashmap if performance gets too slow.
const Monsters = require('./monsters.js');

const Util = require('../util/util.js');

const d20 = require('d20');

class DndCreature {
    constructor (input) {
        if (Util.isString(input)) {
            input = Monsters.find(
                m => m.name.toLowerCase() === input.toLowerCase()
            );
        }

        this.monsterTemplate = input;
        this.parseResistances();
        this.currentHp = input.hit_points;
        this.conditions = [];
    }

    parseResistances () {
        const template = this.monsterTemplate;
        template.resistances = {};

        for (let damageType in DamageTypes) {
            if (template.damage_vulnerabilities.indexOf(damageType) >= 0) {
                template.resistances[damageType] = 0.5;
            }
            // This does not parse notes about resistance/immunity being overcome by magical weapons or by certain materials (eg silver).
            else if (template.damage_resistances.indexOf(damageType) >= 0) {
                template.resistances[damageType] = 2;
            }
            else if (template.damage_immunities.indexOf(damageType) >= 0) {
                // Util.logDebug(`damageType is ${damageType}`);
                template.resistances[damageType] = 9999;
            }
        }
    }

    templateName () {
        return this.monsterTemplate.name;
    }

    isActive () {
        return this.currentHp > 0;
    }

    cr () {
        return this.monsterTemplate.challenge_rating;
    }

    level () {
        return parseInt(this.monsterTemplate.hit_dice);
    }

    skills () {
        // Later can look for stray properties in the template that represent skills.
        return {};
    }

    toJson () {
        return {
            monsterTemplate: this.monsterTemplate
        }
    }

    defaultAttack () {
        const actions = this.monsterTemplate.actions;

        if (!actions) {
            return;
        }

        return actions.find(
            a => a.desc.indexOf('Attack:') >= 0
        )
        || actions[0];
    }

    attack (targetCreature, attackTemplate) {
        attackTemplate = attackTemplate || this.defaultAttack();

        const outcome = {
            // result: undefined,
            targetHp: targetCreature.currentHp
        };

        if (! attackTemplate) {
            return outcome;
        }

        outcome.result = Dice.check(targetCreature.monsterTemplate.armor_class, attackTemplate.attack_bonus);

        if (outcome.result === Dice.Failure) {
            return outcome;
        }

        if (outcome.result === Dice.CriticalFailure) {
            // Later can implement some additional setback here. Lose 1 HP? Negative condition until next turn? Hit a ally?
            return outcome;
        }

        let damage = d20.roll(`${attackTemplate.damage_dice} + ${attackTemplate.damage_bonus}`);

        if (outcome.result === Dice.CriticalSuccess) {
            damage += d20.roll(attackTemplate.damage_dice);
        }

        // Later: Look at target DR vs damage type. Requires parsing damage type out of description, perhaps regex for 'slashing damage.' etc.
        // const resistance = targetCreature.monsterTemplate.resistances[damageType];

        targetCreature.currentHp -= damage;
        outcome.targetHp = targetCreature.currentHp;

        return outcome;
    }

    heal (hitDice) {
        hitDice = hitDice || 1;
        // Later flesh out

        // return outcome;
    }

    static testDefaultAttack () {
        for (let template of Monsters) {
            // Check for TypeErrors
            const attack = new DndCreature(template).defaultAttack();
        }
    }

    speed () {
        Util.log('Note that parsing nonland speeds is not yet implemented in class DndCreature.', 'warn');

        return parseInt(this.monsterTemplate.speed);
    }

    static example () {
        return new DndCreature(Util.randomOf(Monsters));
    }

    static angelExample () {
        const angel = new DndCreature();

        angel.templateName = 'deva';
        angel.ac = 17;
        angel.hitDieSize = 8;
        angel.level = 16;
        angel.speed = 90;
        angel.flight = true;
        angel.str = 18;
        angel.dex = 18;
        angel.con = 18;
        angel.int = 17;
        angel.wis = 20;
        angel.cha = 20;
        // LATER can make skills and damage types into enums
        angel.skills = ['insight', 'perception'];;
        angel.damageResistance = ['radiant', 'bludgeoning', 'piercing', 'slashing'];
        angel.immunities = ['charmed', 'exhaustion', 'frightened'];
        // ... later

        return angel;
    }

    static run () {
        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('dndCreature.js') ||
            ! process.argv[2].startsWith('test')) {
            // The following logic is for command-line use only.
            return;
        }

        DndCreature.test();
    }

    static test () {
        DndCreature.testDefaultAttack();

        const creature = DndCreature.example();

        Util.logDebug(creature.toJson());
        Util.logDebug(creature.defaultAttack());
    }
}

module.exports = DndCreature;

// Run
DndCreature.run();

