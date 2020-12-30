'use strict';

const Chassis = require('./codex/chassis.js');
const Parts = require('./codex/parts.js');
const Thing = require('../thing.js');
const WNode = require('../wnode.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const _ = require('lodash');
const d20 = require('d20');
const Yaml = require('js-yaml');

// Modular spaceship minigame inspired by Eclipse: Second Dawn board game.
class Vessel extends Thing {
    constructor (chassisTemplate, parts, coord) {
        super(chassisTemplate);

        const startingUpgrades = chassisTemplate.startingUpgrades &&
            chassisTemplate.startingUpgrades.map(
                key => Vessel.makePart(key)
            );

        this.components = this.components.concat(parts || startingUpgrades || []);

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
                        continue; // Ignore tech requirements for now.
                        // return false;
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

        // const diagnostics = {
        //     name: this.template.name,
        //     bonusDurability: this.template.bonus && this.template.bonus[trait],
        //     traitSum: this.traitSumFromParts(trait)
        // };
        // const diagString = Util.stringify(diagnostics);
        // Util.logDebug(`getDurability() diagnostics: ${diagString}`);

        return (this.template.durability || 1) +
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

    // Returns something like this: [{
    //     missile: true,
    //     dice: 1,
    //     damage: 4
    // }]
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

    // Returns: {
    //     outcome: DieOutcome
    //     value: number
    // }
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
            summary.outcome = Vessel.DieOutcome.Miss;
        }
        else {
            summary.outcome = roll === 6 ?
                Vessel.DieOutcome.CriticalHit :
                Vessel.DieOutcome.Number;
        }

        summary.value = roll + modifier;

        return summary;
    }

    static rollString (rollSummary) {
        if (rollSummary.outcome === Vessel.DieOutcome.Miss) {
            return 'Miss';
        }

        if (rollSummary.outcome === Vessel.DieOutcome.Miss) {
            return 'Crit';
        }

        return rollSummary.value.toString();
    }

    getExampleAttackDice () {
        // These are the rolled dice that are available to be assigned to targets.
        return [
            {
                outcome: Vessel.DieOutcome.CriticalHit,
                value: 6,
                damage: 2
            },
            {
                outcome: Vessel.DieOutcome.Number,
                value: 7,
                damage: 2
            },
            {
                outcome: Vessel.DieOutcome.Number,
                value: 3,
                damage: 2
            },
            {
                outcome: Vessel.DieOutcome.Miss,
                value: 1,
                damage: 1
            }
        ];
    }

    // input: array of rolled dice.
    // Returns number of durability points that would be lost by absorbing these dice.
    // No side effects.
    damageFromDice (dice) {
        let expectedDamage = 0;
        const shieldPenalty = this.getShieldPenalty();

        for (const die of dice) {
            if (
                die.outcome === Vessel.DieOutcome.CriticalHit ||
                die.outcome === Vessel.DieOutcome.Number &&
                die.value + shieldPenalty >= 6
                // Note: shieldPenalty is either 0 or negative.
            ) {
                expectedDamage += die.damage;
            }
        }

        return expectedDamage;
    }

    takeDamage (n) {
        this.currentDurability -= n;

        if (this.currentDurability <= 0) {
            this.active = false;
        }

        return this.currentDurability;
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

    addPart (partName) {
        this.components.push(
            Vessel.makePart(partName)
        );
    }

    static randomEclipseShip () {
        const chassisName = Util.randomOf([
            'interceptor',
            'cruiser',
            'dreadnought',
            'starbase',
            // 'ancient',
            // 'guardian',
            // 'gcds'
        ]);

        const vessel = new Vessel(Chassis[chassisName]);

        vessel.randomizeParts();

        return vessel;
    }

    static fromChassis (chassisName) {
        return new Vessel(Chassis[chassisName]);
    }

    static orionDreadnought () {
        const vessel = Vessel.fromChassis('dreadnought');

        vessel.components.push(
            Vessel.makePart('gaussShield')
        );

        return vessel;
    }

    static allTechs () {
        return Object.keys(Parts);
    }

    static armsRace (iterations) {
        iterations = iterations || 12;

        // If they are not the same chassis, that is still a realistic battle.
        const terranShip = Vessel.randomEclipseShip();
        const martianShip = Vessel.randomEclipseShip();

        for (let i = 0; i < iterations; i++) {
            if (terranShip.beats(martianShip)) {
                martianShip.mutate();

                Util.log(`Terra wins, with ${terranShip.currentDurability} durability remaining! Now Mars is thinking about a new design: \n${martianShip.simpleYaml()}`)
            }
            else {
                terranShip.mutate();

                Util.log(`Mars wins, with ${martianShip.currentDurability} durability remaining! Now Terra is thinking about a new design: \n${martianShip.simpleYaml()}`)
            }

            terranShip.repair();
            martianShip.repair();
        }
    }

    isActive () {
        this.active = this.currentDurability > 0;
        return this.active;
    }

    // Returns boolean
    // Performs 1 stochastic 1-on-1 battle
    // Does not repair afterwards
    beats (other) {
        const outcome = Vessel.battle([this], [other]);

        return outcome.attackersWon;
    }

    // TODO add unit tests.
    // Example: deep copy a ship and see if a.winRate(b) is sufficiently different from b.winRate(a)
    winRate (other) {
        let wins = 0;
        const FIGHTS = 400000;

        for (let i = 0; i < FIGHTS; i++) {
            if (i % 100000 === 50000) {
                Util.log(`vessel.winPercent(), iteration ${i}, ${(wins / i * 100).toFixed(0)}% win rate.`);
            }

            if (this.beats(other)) {
                wins++;
            }

            this.repair();
            other.repair();
        }

        return wins / FIGHTS;
    }

    // WIP
    // Nonstochastic estimation.
    // No side effects.
    expectedDamage (target) {
        const missileDamage = this.expectedDamagePerRound(target, true);
        const ROUNDS = 2; // A guess
        const cannonDamage = this.expectedDamagePerRound(target) * ROUNDS;

        return missileDamage + cannonDamage;
    }

    expectedDamagePerRound (target, missileMode) {
        const attacks = missileMode ?
            this.getMissileAttacks() :
            this.getNormalAttacks();

        // Reminder: The shield penalty is negative.
        const netModifier = this.getAimingModifier() + target.getShieldPenalty();
        const faceCount = Util.constrain(netModifier + 1, 1, 5);
        const chance = faceCount / 6;

        return attacks.reduce(
            (expected, attack) => expected + (chance * attack.dice * attack.damage),
            0
        );
    }

    // This func does not yet look at missiles.
    // Allies & target must be homogenous
    expectedRoundsToBeat (targetArray, allyCount = 0) {
        const target = targetArray[0];
        const totalDurability = target.getDurability() * targetArray.length;

        const damagePerRound = this.expectedDamagePerRound(target) * (1 + allyCount);

        return totalDurability / damagePerRound;
    }

    // Has side effects
    // Does not repair afterwards
    static battle (attackers, defenders) {
        attackers = WNode.activesAmong(attackers);
        defenders = WNode.activesAmong(defenders);

        let activeAttackers = Util.arrayCopy(attackers);
        let activeDefenders = Util.arrayCopy(defenders);

        const allVessels = attackers.concat(defenders);
        const byInitiative = {};

        allVessels.forEach(v => {
            const init = v.getInitiative();

            const factionSymbol = defenders.includes(v) ?
                'D' :
                'A';

            // Eg, a defending ship might be stored under initiative key '2D'.
            const key = init + factionSymbol;
            
            if (byInitiative[key]) {
                byInitiative[key].push(v);
            }
            else {
                byInitiative[key] = [v];
            }
        });

        // const initKeys = Vessel.sortedInitiative(byInitiative);

        let remaining = allVessels.length;
        
        // Missile round, in init order.
        Vessel.engagementRound(byInitiative, activeAttackers, activeDefenders, true);

        activeAttackers = WNode.activesAmong(activeAttackers);
        activeDefenders = WNode.activesAmong(activeDefenders);

        // Nonmissile rounds, in init order.
        let t;
        for (t = 0; (t < 100) && activeAttackers.length && activeDefenders.length; t++) {
            Vessel.engagementRound(byInitiative, activeAttackers, activeDefenders);

            activeAttackers = WNode.activesAmong(activeAttackers);
            activeDefenders = WNode.activesAmong(activeDefenders);
        }

        let attackersWon = false;

        if (activeAttackers.length > 0) {
            if (activeDefenders.length > 0) {
                Util.log(`The battle was a tie!`);
            }
            else {
                // Util.log(`Attackers win!`);
                attackersWon = true;
            }
        }
        else {
            if (activeDefenders.length > 0) {
                // Util.log(`Defenders win!`);
            }
            else {
                Util.log(`There were no survivors on either side!`);
            }
        }

        // Util.log(`After ${t} engagement rounds, ${activeAttackers.length} attacking vessels and ${activeDefenders.length} defending vessels survived.`);

        return {
            activeAttackers,
            activeDefenders,
            attackersWon
        };
    }

    static sortedInitiative (byInitiative) {
        return Object.keys(byInitiative).sort(
            (a, b) => {
                const diff = parseInt(b) - parseInt(a);

                if (diff !== 0) {
                    return diff;
                }

                // In ties, defenders act first.
                return a[a.length - 1] === 'D' ?
                    -1:
                    1;
            }
        );
    }

    static testSortedInitiative () {
        const out1 = Vessel.sortedInitiative({
            '0D': true,
            '0A': true,
            '24D': true,
            '-12A': true,
            '-12D': true,
            '24A': true
        });

        Util.logDebug(out1);

        // Import some simple expect/assert functions later
        if (out1.length !== 6) {
            throw new Error(out1);
        }
    }

    static engagementRound (byInitiative, activeAttackers, activeDefenders, missileMode) {
        Vessel.sortedInitiative(byInitiative).forEach(key => {
            const defendersTurn = key.endsWith('D');

            const rolled = byInitiative[key].reduce(
                (rolledSoFar, v) => {
                    if (! v.isActive()) {
                        return [];
                    }

                    return rolledSoFar.concat(
                        missileMode ?
                            v.rollMissileDice() :
                            v.rollAttackDice()
                    );
                },
                []
            );

            const shipTemplates = byInitiative[key].map(v => v.template.name);
            const dieSummaries = rolled.map(d => Vessel.rollString(d));
            // Util.logDebug(`In initiative step ${key}${ missileMode ? ' (Missile mode)' : '' }, we have [${shipTemplates}]. They rolled ${rolled.length} dice, as follows: [${dieSummaries}]`);

            // Assign to targets following the Eclipse rules' heuristics for nonplayer ships (LATER)
            rolled.forEach(die => {
                if (die.outcome === Vessel.DieOutcome.Miss) {
                    // Util.log(`In initiative step ${key}, a attack die with damage ${die.damage} has outcome ${die.outcome}.`);
                    return;
                }

                if (die.outcome === Vessel.DieOutcome.FriendlyFire) {
                    Util.log(`In initiative step ${key}, a rift die is doing its thing.`);

                    // Later deal with rift case.
                    return;
                }

                // Note: We could refresh activeAttackers or activeDefenders after each die is randomly assigned. But the heuristics in the Eclipse rulebook will be better anyway.
                const target = Util.randomOf(
                    defendersTurn ?
                        activeAttackers :
                        activeDefenders
                );

                const damage = target.damageFromDice([die]);
                const subsequentDurability = target.takeDamage(damage);

                // Util.log(`In initiative step ${key}, a attack die with damage ${die.damage} & result ${Vessel.rollString(die)} targets ${target.template.name} ${Util.shortId(target.id)}, dealing ${damage} damage and reducing it to ${subsequentDurability} durability.`);
                // Later persist info about where the die came from, what its value was, and where it was assigned.
            });

            if (defendersTurn) {
                activeAttackers = WNode.activesAmong(activeAttackers);
            }
            else {
                activeDefenders = WNode.activesAmong(activeDefenders);
            }
        });
    }

    // Adds 1 random part, so long as that is legal
    // Returns nothing
    mutate () {
        // Later
    }

    repair () {
        this.active = true;
        this.currentDurability = this.maxDurability;
    }

    static test () {
        // const ship = Vessel.randomEclipseShip();
        // ship.improve();

        // const hero = Vessel.fromChassis('cruiser');
        // hero.addPart('electronComputer');

        // const foe = Vessel.fromChassis('cruiser');
        // foe.addPart('ionCannon');

        const hero = Vessel.orionDreadnought();
        const foe = Vessel.fromChassis('advancedAncient');

        Util.logDebug(hero.simpleYaml());
        Util.logDebug('\n' + hero.traitsString());
        Util.logDebug(foe.simpleYaml());
        Util.logDebug('\n' + foe.traitsString());

        // const diagnostics = {
        //     getDurability: foe.getDurability(),
        //     maxDurability: foe.maxDurability,
        //     currentDurability: foe.currentDurability,
        //     heroGetDurability: hero.getDurability()
        // };

        // Util.logDebug(`diagnostics: ${Util.stringify(diagnostics)}`);

        const percent = hero.winRate(foe) * 100;
        const heroRounds = hero.expectedRoundsToBeat([foe]).toFixed(1);
        const foeRounds = foe.expectedRoundsToBeat([hero]).toFixed(1);

        Util.log(`My ${hero.template.name} can beat this ${foe.template.name} ${percent.toFixed(0)}% of the time in a 1v1. \nThe ${hero.template.name} usually takes ${heroRounds} rounds to win, whereas the ${foe.template.name} usually takes ${foeRounds} to win.`);

        // Vessel.armsRace();
    }
};

Vessel.ShipPartContext = 'shipPart';

Vessel.DieOutcome = Util.makeEnum([
    'Miss',
    'Number',
    'CriticalHit',
    'FriendlyFire'
    // Later might need more rift cases.
]);

module.exports = Vessel;

Vessel.test();
