'use strict';

const DamageTypes = require('./damageTypes.js');
const Dice = require('./dice.js');

// I found monsters.js on Github and am using it as a casual prototype starting point.
// Later could set up a hashmap if performance gets too slow.
const Monsters = require('./monsters.js');

const Util = require('../util/util.js');

const _ = require('lodash');
const Yaml = require('js-yaml');

// TODO require and extend Creature (which extends WNode)
class DndCreature {
    constructor (input) {
        if (! input) {
            input = DndCreature.randomTemplate();
        }
        else if (Util.isString(input)) {
            const inputString = input;

            input = Monsters.find(
                m => m.name.toLowerCase() === input.toLowerCase()
            );

            if (! input) {
                throw new Error(`I dont know of a species called '${inputString}'.`);
            }
        }

        this.id = Util.newId();
        this.monsterTemplate = input;
        this.parseResistances();
        // this.alignment = new Alignment(input.alignment); LATER
        // TODO initialize vague values like 'any alignment'.
        this.alignment = input.alignment;
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
            // TODO This does not parse notes about resistance/immunity being overcome by magical weapons or by certain materials (eg silver).
            // We also do not yet parse whether attacks are magical, such as those of the Androsphynx
            else if (template.damage_resistances.indexOf(damageType) >= 0) {
                template.resistances[damageType] = 2;
            }
            else if (template.damage_immunities.indexOf(damageType) >= 0) {
                // Util.logDebug(`damageType is ${damageType}`);
                template.resistances[damageType] = DndCreature.IMMUNE;
            }
        }
    }

    // Note that this might not follow the camelcase standard of other templateNames. Could tidy that later.
    templateName () {
        return this.monsterTemplate.name;
    }

    active () {
        return this.currentHp > 0;
    }

    getAlignment () {
        // TODO this will say 'unaligned' or 'any alignment' sometimes. Initialize those in constructor.
        return this.alignment;
    }

    getCr () {
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

    selectTarget (others, attackTemplate) {
        attackTemplate = attackTemplate || this.defaultAttack();

        // We use slice() to deep copy to prevent side effects from sort().
        const sorted = others.slice().sort(
            (a, b) => b.getCr() - a.getCr()
        );

        // set damage expectations
        let desiredDamage = this.damage(DndCreature.punchingBag(), attackTemplate);

        for (const target of sorted) {
            if (! this.isFoe(target)) {
                continue;
            }

            // This is a approximate algorithm.
            const wouldDamage = this.damage(target, attackTemplate);

            // Check whether resistances dont get in the way.
            if (wouldDamage >= desiredDamage) {
                return target;
            }

            // Lower expectations
            desiredDamage = wouldDamage;
        }

        // If all are hard, attack the lowest-CR target.
        return sorted[sorted.length - 1];
    }

    isFoe (target) {
        // Later make this more sophisticated between LG-NG, or LG-NN, etc. LG-CG can stay foes.
        return target.getAlignment() !== target.getAlignment();
    }

    // Has side effects on the target's .currentHp, and also returns a summary object.
    attack (targetCreature, attackTemplate) {
        attackTemplate = attackTemplate || this.defaultAttack();

        const outcome = {
            // result: undefined,
            targetHp: targetCreature.currentHp
        };

        if (! attackTemplate) {
            throw new Error(`No attack template found for DndCreature ${this.id} of type ${this.monsterTemplate.name}.`);
        }

        outcome.result = Dice.check(targetCreature.monsterTemplate.armor_class, attackTemplate.attack_bonus);

        if (outcome.result === Dice.Failure) {
            return outcome;
        }

        if (outcome.result === Dice.CriticalFailure) {
            // Later can implement some additional setback here. Lose 1 HP? Negative condition until next turn? Hit a ally?
            return outcome;
        }

        const damage = this.damage(
            targetCreature,
            attackTemplate,
            outcome.result === Dice.CriticalSuccess
        );

        targetCreature.currentHp -= damage;
        outcome.targetHp = targetCreature.currentHp;

        return outcome;
    }

    damage (target, attackTemplate, wasCrit) {
        attackTemplate = attackTemplate || this.defaultAttack();

        const modifier = attackTemplate.damage_bonus || 0;

        let damage = attackTemplate.damage_dice ?
            Dice.roll(`${attackTemplate.damage_dice} + ${modifier}`) :
            modifier;

        if (wasCrit) {
            damage += attackTemplate.damage_dice ?
                Dice.roll(attackTemplate.damage_dice) :
                1;
            // NOTE: The 5e PHB says that crits double the number of damage DICE, not modifiers. But i want to be nice to the lucky raven (0d4 + 1 damage).
        }

        if (! attackTemplate.damage_types) {
            return damage;
        }

        let resistedDamage = 0;
        const damageByType = Dice.divideAmong(damage, attackTemplate.damage_types);

        for (const type in damageByType) {
            const resistance = target.monsterTemplate.resistances[type] || 1;

            resistedDamage += resistance === DndCreature.IMMUNE ?
                0 :
                damageByType[type] * resistance;
        }

        return resistedDamage;
    }

    heal (hitDice) {
        hitDice = hitDice || 1;
        // Later flesh out

        // return outcome;
    }

    randomHpMax () {
        // LATER: Based on rolling hit dice
    }

    static fractionalCr (cr) {
        if (cr === 0.125) {
            return '1/8';
        }
        else if (cr === 0.25) {
            return '1/4';
        }
        else if (cr === 0.5) {
            return '1/2';
        }

        return cr;
    }

    async duel (other) {
        const yourName = this.monsterTemplate.name;
        const yourAttack = this.defaultAttack();
        const yourDamages = yourAttack ?
            yourAttack.damage_types :
            [];

        const otherName = other.monsterTemplate.name;
        const otherAttack = other.defaultAttack();
        const otherDamages = otherAttack ?
            otherAttack.damage_types :
            [];

        Util.log(`\n\n=== Start of a duel between ${yourName} (CR ${DndCreature.fractionalCr(this.getCr())}) & ${otherName} (CR ${DndCreature.fractionalCr(other.getCr())}) ===`);

        Util.log(`The ${yourName} has ${this.currentHp} HP. The ${otherName} has ${other.currentHp} HP.`);

        if (! yourAttack) {
            if (! otherAttack) {
                Util.log(`... Oh. This is awkward. Neither combatant has any way to attack under the current rules! Let's arbitrarily say the ${yourName} wins.`);
                return this;
            }

            Util.log(`The ${yourName} has no way to attack under the current rules! Thus, the ${otherName} wins.`);
            return other;
        }
        else if (! otherAttack) {
            Util.log(`The ${otherName} has no way to attack under the current rules! Thus, the ${yourName} wins.`);
            return this;
        }

        // TODO the immunity did not get logged in androsphynx vs dragon
        const yourRelevantResistances = this.unusualDamageResponses(otherAttack);
        const otherRelevantResistances = other.unusualDamageResponses(yourAttack);

        if (Object.keys(yourRelevantResistances).length > 0) {
            Util.log(`Relevantly, the ${yourName} has the following damage resistances:\n${Yaml.dump(yourRelevantResistances)}`);
        }

        if (Object.keys(otherRelevantResistances).length > 0) {
            Util.log(`Relevantly, the ${otherName} has the following damage resistances:\n${Yaml.dump(otherRelevantResistances)}`);
        }

        await Util.sleep(6);

        const startTime = new Date();

        let round = 0;
        while (this.currentHp > 0 && other.currentHp > 0 && round < 10000) {
            const elapsed = new Date() - startTime;

            if (elapsed < (round * 6000)) {
                // Util.logDebug(`Time to sleep! elapsed is ${elapsed}`);
                await Util.sleep(6);
            }

            round++;

            // Later randomize who goes first
            const yourHpWas = this.currentHp;
            const othersAttack = other.attack(this);

            Util.log(other.summarizeAttack(othersAttack, yourName, yourHpWas));

            if (this.currentHp <= 0) {
                break;
            }

            const othersHpWas = other.currentHp;
            const yourAttack = this.attack(other);

            Util.log(this.summarizeAttack(yourAttack, otherName, othersHpWas));

            Util.log(`Duel clock: ${Util.prettyTime(round * 6)}`);
        }

        const winner = this.currentHp <= 0 ?
            other :
            this;
        // Later make other win in timeouts.

        Util.log(`The winner is the ${winner.monsterTemplate.name}, with ${winner.currentHp} HP remaining! The duel lasted ${round} rounds.`)

        // Reset
        this.currentHp = this.monsterTemplate.hit_points;
        other.currentHp = other.monsterTemplate.hit_points;

        await Util.sleep(6);

        return winner;
    }

    // later make 2nd param target not targetSpecies, to access maxHp for logging %.
    // Later find a visual way to do this
    summarizeAttack (outcome, targetSpecies, targetPreviousHp) {
        const name = `The ${this.monsterTemplate.name}`;
        const targetName = `The ${targetSpecies || 'target'}`;

        const damage = Util.exists(targetPreviousHp) ?
            targetPreviousHp - outcome.targetHp :
            'unknown';

        if (Dice.successful(outcome.result)) {
            const criticalNote = outcome.result === Dice.CriticalSuccess ?
                ' (Critical hit!)' :
                '';

            return `${name} hits for ${damage} damage${criticalNote}. ${targetName} has ${outcome.targetHp} HP.`;
        }

        const summary = `${name} misses!`;

        if (outcome.result === Dice.CriticalFailure) {
            return summary + ' (Critical failure)';
        }

        return summary;
    }

    static randomDuel () {
        (new DndCreature()).duel(new DndCreature());
    }

    static randomWithCr (crNum) {
        return Util.randomOf(
            DndCreature.creaturesWithCr(crNum)
        );
    }

    static creaturesWithCr (crNum) {
        return Monsters.filter(
            m => m.challenge_rating === crNum
        );
    }

    static async tournamentOfCr (crNum) {
        let contestants = DndCreature.creaturesWithCr(crNum);
        contestants = _.shuffle(contestants);

        let champion = new DndCreature(contestants[0]);

        for (let i = 1; i < contestants.length; i++) {
            const challenger = new DndCreature(contestants[i]);
            // Later change to challenger.dule(champion), because it's like Chal is throwing a guantlet at Cham.
            const winner = await champion.duel(challenger);

            if (winner === challenger) {
                Util.log(`The ${challenger.monsterTemplate.name} is the new champion!`);
                champion = challenger;
            }
        }

        Util.log(`The ${champion.monsterTemplate.name} is the final champion!`);
    }

    // Overlap.
    unusualDamageResponses (attackTemplate) {
        const responses = {};

        for (const type of attackTemplate.damage_types) {
            // Util.logDebug(`The attack involves ${type} damage. This creature's resistance value to that is ${this.monsterTemplate.resistances[type]}`);

            if (Util.exists(this.monsterTemplate.resistances[type])) {
                responses[type] = this.monsterTemplate.resistances[type];
            }
        }

        return responses;
    }

    static punchingBag () {
        return new DndCreature({
            name: 'Punching Bag',
            size: 'Medium',
            type: 'construct',
            subtype: '',
            alignment: 'neutral',
            armor_class: 0,
            hit_points: 99999,
            hit_dice: '1d4',
            speed: '0 ft.',
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 1,
            wisdom: 1,
            charisma: 1,
            damage_vulnerabilities: '',
            damage_resistances: '',
            damage_immunities: '',
            condition_immunities: '',
            senses: 'passive Perception 10',
            languages: '',
            challenge_rating: 0,
            actions: []
        });
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
        return DndCreature.randomCreature();
    }

    static randomTemplate () {
        return Util.randomOf(Monsters);
    }

    static randomCreature () {
        return new DndCreature(DndCreature.randomTemplate());
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
            process.argv.length < 3 ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('dndCreature.js') ||
            ! process.argv[2].startsWith('test')) {
            // The following logic is for command-line use only.
            return;
        }

        DndCreature.test();
    }

    static async test () {
        DndCreature.testDefaultAttack();

        const dragon = new DndCreature('Ancient Red Dragon');
        const sphynx = new DndCreature('Androsphinx');
        const relevantResistances = sphynx.unusualDamageResponses(dragon.defaultAttack());
        // Util.log(relevantResistances);

        const herald = DndCreature.randomTemplate();
        await DndCreature.tournamentOfCr(herald.challenge_rating);
    }
}

DndCreature.IMMUNE = 9999;

module.exports = DndCreature;

// Run
DndCreature.run();

