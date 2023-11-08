'use strict';

const BEvent = require('../bEvent.js');

const ActionTemplate = require('../../battle20/actiontemplate.js');

const WGenerator = require('../../generation/wgenerator.js');

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const Creature = require('../../wnode/creature.js');
const Group = require('../../wnode/group.js');

const Yaml = require('js-yaml');

class ProjectileEvent extends BEvent {
    // protagonist is a input param of type Thing.
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
        const target = this.target;
        if (! target.active) {
            // Do not bother to calculate the effect of this projectile. (LATER we could, if interesting, or if misses can affect others nearby.)
            return;
        }

        const protagonist = this.protagonist;
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

        target.sp -= ProjectileEvent.damagePerShot(actionTemplate, target);
        target.lastDamaged = worldState.now();
        this.resultantTargetSp = target.sp;

        if (target.sp <= 0) {
            target.active = false;
        }
    }

    // Later this could be static if that helps.
    doesItHit (protagonist, actionTemplate, target, worldState) {
        return Math.random() < ProjectileEvent.hitChance(
            actionTemplate,
            target,
            protagonist.distanceTo(target)
        );
    }

    // Returns number between 0 and 1
    static hitChance (actionTemplate, target, distance) {
        // Algorithm comes from WCW in hobby/warband/gameState.js
        // LATER gather modifiers of hit, including from creatures like spartan, instead of just base hit stat.
        const AIM_FUDGE = 1;

        // Decided on hard range limits 2020 Jan 14
        if (distance > actionTemplate.range) {
            return 0;
        }

        // In luckless calculations, quantity may be 0.2, but we treat that as 1 here.
        let size = target.quantity >= 1 ?
            target.getSize() :
            target.traitMax('size');

        const advantage = size * actionTemplate.hit / AIM_FUDGE;
        const chance = advantage / (advantage + distance + 1);

        // LATER could treat ranges under 10m as 10m in this calculation, to indicate that ability to hit is complicated by the chaos of close combat.

        // Util.logDebug(`ProjectileEvent.hitChance(): ${advantage} / (${advantage} + ${distance} + 1) === ${chance}`);

        return chance;
    }

    // Non SP based combat model.
    static damagePerShot (actionTemplate, target) {
        const damage = actionTemplate.damage - target.resistanceTo(actionTemplate.tags);

        // Min damage per projectile.
        return Math.max(1, damage);
    }

    static damagePerShotSp (actionTemplate, target) {
        const damage = ProjectileEvent.damagePerShot(actionTemplate, target);

        // Max damage per projectile
        return Math.min(damage, target.sp);
    }

    static ttk (actionTemplate, target) {

    }

    // Returns summary of expected damage over 1 sec of firing at various ranges.
    // Later could also add a similar func that calculates TTK for range/weap/target combinations
    static testActionDamage (actionTemplate, target) {
        actionTemplate = actionTemplate || ActionTemplate.example();

        if (! target) {
            // NOTE: Saw a weird error here involving WGenerator.makeNode(), possibly caused by the fact that Group and WGenerator both require() each other (circular dependency, 2020 Dec).
            target = WGenerator.marineCompany();
        }

        // const exampleSummary = {
        //     actionTemplateName: 'heavyStubber',
        //     targetTemplateName: 'marinePrivate',
        //     1: 2.5,
        //     2: 2.3,
        //     4: 1.9,
        //     ...
        // };

        const summary = {
            actionTemplateName: actionTemplate.name,
            targetTemplateName: target.templateName
        };

        const shots = actionTemplate.shotsPerSecond;

        const TOO_FAR = 10 * 1000; // 10km
        for (let range = 1; range < TOO_FAR; range = range * 2) {
            const expectedHits = shots * ProjectileEvent.hitChance(actionTemplate, target, range);
            const damage = ProjectileEvent.damagePerShot(actionTemplate, target);

            // Util.logDebug(`expectedHits is ${expectedHits}. damage is ${damage}.`);

            summary[range] = (expectedHits * damage).toFixed(2);
        }

        Util.log(summary);
        return summary;
    }

    // Display damage effectiveness numbers, for calibrating & balancing
    static koGrid () {
        // Later probably make these full codex paths
        const attacks = [
            'assaultRifle',
            'battleRifle',
            'plasmaRifle',
            'plasmaPistol',
        ];

        const templateNames = [
            'halo/unsc/individual/marinePrivate',
            'halo/unsc/individual/odst',
            'halo/unsc/individual/spartan',
            'halo/cov/individual/elite',
            'halo/cov/individual/gruntMinor',
            'halo/cov/individual/jackal',
        ];

        const grid = [];

        for (let a = 0; a < attacks.length; a++) {
            grid.push([]);

            for (let t = 0; t < templateNames.length; t++) {
                const action = WGenerator.ids[attacks[a]];
                const target = WGenerator.newGroup(templateNames[t], 4);

                Util.logDebug(`action name ${attacks[a]} \n action is ${action} \n template name ${templateNames[t]} \n target is ${target}`);

                grid[a].push(ProjectileEvent.koChance(action, target));
            }
        }

        // Now log grid
        const templateCaption = templateNames.map(
            path => path.slice(
                path.lastIndexOf('/') + 1,
                path.length
            )
            .padEnd(14)
        )
        .join(' ');

        const lines = [];
        for (let a = 0; a < attacks.length; a++) {
            const entries = grid[a].map(
                c => (c * 100).toFixed(0) + '%'
            )
            .join(' '.repeat(12));

            lines.push(attacks[a].padEnd(20, ' ') + ' ' + entries);
        }

        // const lines = grid.map(
        //     chances => chances.map(
        //         c => c.toFixed(2)
        //     )
        //     .join('  ')
        // );

        const str = ' '.repeat(21) + templateCaption + '\n' + lines.join('\n');

        console.log(str);

        return grid;
    }

    static koChance (actionTemplate, target) {
        return ProjectileEvent.koChanceByDamage(
            ProjectileEvent.damagePerShot(actionTemplate, target),
            target.template.durability
        );
    }

    static koChanceByDamage (damagePerShot, durability) {
        return damagePerShot /
            (damagePerShot + durability);
    }

    static costRatio (pathA, pathB) {
        const groupA = WGenerator.newGroup(pathA, 10);
        const groupB = WGenerator.newGroup(pathB, 10);

        let aScore = ProjectileEvent.performance(groupA, groupB);
        let prevScore = aScore;
        // prevScore could be used later to make a more precise estimate.

        if (aScore === 0) {
            return 1;
        }

        const startedPositive = aScore > 0;

        while (startedPositive ? aScore > 0 : aScore < 0) {

            if (startedPositive) {
                groupB.quantity += 1;
            }
            else {
                groupA.quantity += 1;
            }

            prevScore = aScore;
            aScore = ProjectileEvent.performance(groupA, groupB);

            console.log(`aScore from both: ${aScore}`);
        }

        // Eg 20 / 10 => return ratio 2
        // So if A costs 4 then B should cost around 2
        return groupB.quantity / groupA.quantity;
    }

    static performance (groupA, groupB) {
        // Convert 2nd call to be from A's perspective, then average the two.
        return (
            ProjectileEvent.performanceOrdered(groupA, groupB) +
            ProjectileEvent.performanceOrdered(groupB, groupA) * -1
        ) / 2;
    }

    // Assumed that A goes first. This func should probably be called twice, with switched inputs.
    // Assumed to start at the greater of their 2 ranges.
    // No side effects
    // Returns total remaining durability, negative if B survives.
    static performanceOrdered (groupA, groupB) {
        const aStartingQuantity = groupA.quantity;
        const bStartingQuantity = groupB.quantity;

        console.log(`  performanceOrdered( ${groupA.toSimpleString()} , ${groupB.toSimpleString()} )`);

        // Outcome var. If B has 2 survivors of durability 4 each, it would be -8.
        let aScore;

        const attackA = WGenerator.ids[groupA.template.weapon];
        const attackB = WGenerator.ids[groupB.template.weapon];

        let longRangedGroup;
        let shortRangedGroup;
        let longRange;
        let shortRange;

        const MIN_QUANTITY = 0.1;

        if (attackA.range < attackB.range) {
            longRangedGroup = groupB;
            longRange = attackB.range;
            shortRangedGroup = groupA;
            shortRange = attackA.range;
        }
        else {
            longRangedGroup = groupA;
            longRange = attackA.range;
            shortRangedGroup = groupB;
            shortRange = attackB.range;
        }

        let range = longRange;

        for (let t = 1; t < 10000; t++) {
            console.log(`    debug, top of performanceOrdered() loop: a quantity ${groupA.quantity}, b quantity ${groupB.quantity}, range ${range}`);

            const bCasualties = ProjectileEvent.lucklessCasualties(attackA, groupB, range) * groupA.quantity;

            groupB.quantity -= bCasualties;

            if (groupA.quantity < MIN_QUANTITY || groupB.quantity < MIN_QUANTITY) {
                aScore = groupA.totalDurability() - groupB.totalDurability();
                break;
            }

            const aCasualties = ProjectileEvent.lucklessCasualties(attackB, groupA, range) * groupB.quantity;

            groupA.quantity -= aCasualties;

            if (groupA.quantity < MIN_QUANTITY || groupB.quantity < MIN_QUANTITY) {
                aScore = groupA.totalDurability() - groupB.totalDurability();
                break;
            }

            // Move.
            if (range > shortRange) {
                // Speed unit is m/s
                range -= shortRangedGroup.template.speed;

                if (range < shortRange) {
                    range = shortRange;
                }
            }
        }

        groupA.quantity = aStartingQuantity;
        groupA.active = true;

        groupB.quantity = bStartingQuantity;
        groupB.active = true;

        console.log(`    aScore = ${aScore}`);

        return aScore;
    }

    // Per shooter.
    static lucklessCasualties (actionTemplate, targetGroup, range) {
        const hitChance = ProjectileEvent.hitChance(actionTemplate, targetGroup, range);
        const coverChance = 0.2;
        const damagePerShot = ProjectileEvent.damagePerShot(actionTemplate, targetGroup);
        const koChance = ProjectileEvent.koChanceByDamage(damagePerShot, targetGroup.template.durability);

        return actionTemplate.shotsPerSecond * hitChance * (1 - coverChance) * koChance;
    }

    // Simulates 1 second of firing against target, with randomness.
    // No side effects. Returns a summary in the dry-run style.
    // Uses the KO state system (non SP based)
    // Combatants are always in one of the following states: {OK, KO}
    static fireAt (attacker, actionTemplate, target, range, log) {
        // Util.logDebug(`fireAt(${attacker && attacker.templateName || ' '}, ${actionTemplate && actionTemplate.name || ' '}, ${target && target.templateName || ' '}, ${range || ' '}, ${log})`);

        const defaultAction = WGenerator.ids[
            attacker.template && attacker.template.weapon || 'assaultRifle'
        ];

        attacker       = Util.default(attacker,       WGenerator.marineCompany());
        actionTemplate = Util.default(actionTemplate, defaultAction);
        target         = Util.default(target,         WGenerator.marineCompany());
        range          = Util.default(range,          100);
        log            = Util.default(log,            true);

        const summary = {
            attacker: attacker.templateName,
            attackerQuantity: attacker.quantity,
            action: actionTemplate.name,
            target: target.templateName,
            targetQuantity: target.quantity,
            range,
            accurateShots: 0,
            hits: 0,
            casualties: 0
        };

        // Util.logDebug(`fireAt(), actionTemplate: ${actionTemplate && actionTemplate.name}, attacker.template: ${attacker.template}, attacker.template.weapon: ${attacker.template.weapon}, WGenerator.ids[assaultRifle]: ${WGenerator.ids['assaultRifle']}`);

        // const bEvent; // Later can output 1 or more BEvents

        const shots = attacker.quantity * actionTemplate.shotsPerSecond;

        // Noninteger shot counts are rounded up or down, with chance proportional to remainder.
        // This means that slow-firing weaps have eg a 20% chance of firing each second.
        const chanceOfShot = shots % 1;

        summary.shots = Math.random() < chanceOfShot ?
            Math.ceil(shots) :
            Math.floor(shots);

        summary.hitChance = ProjectileEvent.hitChance(actionTemplate, target, range);


        // LATER this will be a function of terrain, size, combat skill, and AoE attacks.
        summary.coverChance = 0.2;

        // Note that durability in the non-SP context means the value that has a 50% chance of KOing you. This is typically half as big as the SP definition of durability.
        summary.durability = target.template.durability || 5;
        summary.damagePerShot = ProjectileEvent.damagePerShot(actionTemplate, target);

        // Pseudosigmoid
        summary.koChance = ProjectileEvent.koChanceByDamage(summary.damagePerShot, summary.durability);

        // console.log(Yaml.dump(summary));

        for (let s = 0; s < summary.shots; s++) {
            if (Math.random() > summary.hitChance) {
                continue; // Miss.
            }

            summary.accurateShots++;
            
            if (Math.random() > summary.coverChance) {
                continue; // Shot hit cover.
            }

            summary.hits++;

            if (Math.random() > summary.koChance) {
                continue; // Victim not seriously hurt.
            }

            summary.casualties++;
        }

        // Util.log('\n' + Yaml.dump(summary));
        return summary;
    }

    // Simulates 1 second of firing against target, with randomness.
    // Uses the SP pool system (group.worstSp, etc)
    static testFireSp (attacker, actionTemplate, target, range, log) {
        // NOTE: Saw a weird error here involving WGenerator.makeNode(), possibly caused by the fact that Group and WGenerator both require() each other (circular dependency, 2020 Dec).
        attacker = Util.default(attacker, WGenerator.marineCompany());
        target = Util.default(target, WGenerator.marineCompany());
        actionTemplate = Util.default(actionTemplate, ActionTemplate.example());
        range = Util.default(range, 100);
        log = Util.default(log, true);

        const summary = {
            attacker: attacker.templateName,
            attackerQuantity: attacker.quantity,
            action: actionTemplate.name,
            target: target.templateName,
            targetQuantity: target.quantity,
            hits: 0
        };

        // const bEvent; // Later can output 1 or more BEvents

        // LATER: Note this will give slightly approximated results when shotsPerSecond is less than 1s.
        summary.shots = attacker.quantity * actionTemplate.shotsPerSecond;
        summary.hitChance = ProjectileEvent.hitChance(actionTemplate, target, range);

        for (let s = 0; s < summary.shots; s++) {
            if (Math.random() < summary.hitChance) {
                summary.hits++;
            }
        }

        summary.damagePerShot = ProjectileEvent.damagePerShot(actionTemplate, target);

        summary.totalDamage = summary.hits * summary.damagePerShot;

        if (! target.template) {
            Util.logDebug(`ProjectileEvent.testFireSp(). target.templateName is ${target.templateName}.`);
        }

        const naiveCasualties = summary.totalDamage / target.template.sp;
        const remainderCasualties = naiveCasualties - Math.floor(naiveCasualties);

        // Remainder damage that is enough to injure but not KO a final creature.
        const excessDamage = remainderCasualties * target.template.sp;

        summary.casualties = excessDamage >= target.worstSp ?
            naiveCasualties + 1 :
            naiveCasualties;

        // Util.logDebug(target.template);

        Util.log('\n' + Yaml.dump(summary));
        return summary;
        // Then: const bOutcome = b.takeDamage(aAttack.totalDamage);
    }

    static randomGroups (groupCount, sizeEach) {
        let groups = [];

        for (let i = 0; i < (groupCount || 12); i++) {
            groups.push(WGenerator.randomTemplate());
        }

        return groups;
    }

    static islandBattle () {
        const unsc = [
            WGenerator.newGroup('halo/unsc/individual/marinePrivate', 10),
            WGenerator.newGroup('halo/unsc/individual/odst', 10),
        ];

        const cov = [
            WGenerator.newGroup('halo/cov/individual/grunt', 10),
            WGenerator.newGroup('halo/cov/individual/elite', 10),
        ];

        const startCosts = [unsc, cov].map(ProjectileEvent.totalCost);

        const outcome = ProjectileEvent.resolveBattle(unsc, cov, 30);

        const endCosts = [unsc, cov].map(ProjectileEvent.totalCost);

        console.log(`\n  UNSC ${endCosts[0]}/${startCosts[0]} pts, Covenant ${endCosts[1]}/${startCosts[1]} pts \n`);

        return outcome;
    }

    static totalCost (groups) {
        return Util.sum(
            groups.map(
                g => (g.template.cost || 4) * g.quantity
            )
        );
    }

    // Groups do not move for now. Terrain is flat.
    // Does indeed mutate the Groups.
    static resolveBattle (aGroups, bGroups, range, log) {
        aGroups = Util.default(aGroups, ProjectileEvent.randomGroups());
        bGroups = Util.default(bGroups, ProjectileEvent.randomGroups());

        // Do note that if we set the range high, some groups might be unable to deal damage!
        const defaultRange = Math.ceil(Math.random() * 50);
        range = Util.default(range, defaultRange);
        log = Util.default(log, true);

        let aTotalSize = Util.sum(
            aGroups.map(
                g => g.getSize()
            )
        );

        let bTotalSize = Util.sum(
            bGroups.map(
                g => g.getSize()
            )
        );

        const summary = {
            // aGroups: array of objs with templateName and quantity
            // bGroups: same
            range: range
        };

        console.log(ProjectileEvent.spacelessBattleString(aGroups, bGroups, 0));

        const longerLength = Math.max(aGroups.length, bGroups.length);

        let t;

        for (t = 1; t < 10000; t++) {
            for (let i = 0; i < longerLength; i++) {
                let protag;

                if (aGroups[i]) {
                    protag = aGroups[i];

                    // Util.logDebug(protag.target && protag.target.active);

                    if (! (protag.target && protag.target.active)) {
                        // Later randomly roll up to bTotalSize, so that big groups get targeted more.
                        const available = bGroups.filter(
                            g => g.active
                        );

                        if (available.length === 0) {
                            console.log(ProjectileEvent.spacelessBattleString(aGroups, bGroups, t));

                            // later update summary
                            return summary;
                        }

                        protag.target = Util.randomOf(available);
                    }

                    const attack = ProjectileEvent.fireAt(
                        protag,
                        undefined,
                        protag.target,
                        range,
                        log
                    );

                    const outcome = protag.target.takeCasualties(attack.casualties);

                    // TODO make sure this cant go or start negative.
                    bTotalSize -= protag.target.getTrait('size') * attack.casualties;
                }

                if (! bGroups[i]) {
                    continue;
                }

                protag = bGroups[i];

                if (! (protag.target && protag.target.active)) {
                    // Later randomly roll up to aTotalSize
                    const available = aGroups.filter(
                        g => g.active
                    );

                    if (available.length === 0) {
                        console.log(ProjectileEvent.spacelessBattleString(aGroups, bGroups, t));

                        // later update summary
                        return summary;
                    }

                    protag.target = Util.randomOf(available);
                }

                const attack = ProjectileEvent.fireAt(
                    protag,
                    undefined,
                    protag.target,
                    range,
                    log
                );
                const outcome = protag.target.takeCasualties(attack.casualties);

                aTotalSize -= protag.target.getTrait('size') * attack.casualties;
            }

            console.log(ProjectileEvent.spacelessBattleString(aGroups, bGroups, t));
        }

        // TODO populate summary
        return summary;
    }

    // Only one number per group - the total size.
    static spacelessSizeString (aGroups, bGroups, t) {
        const aSizes = aGroups.map(
            g => g.getSize().toString().padStart(3, ' ')
        )
        .filter(
            size => size !== '  0'
        )
        .join(' ');

        const bSizes = bGroups.map(
            g => g.getSize().toString().padStart(3, ' ')
        )
        .filter(
            size => size !== '  0'
        )
        .join(' ');

        return `----------------------------------------------- ${t}s\n${aSizes}\n${bSizes}\n`;
    }

    // TODO i want a func like spacelessBattleString but also with total cost of each Group (inc weapon costs)

    // Later could combine this with Group.dotGrid() rectangle of dots.
    // Log each group like '6x Marine'
    static spacelessBattleString (aGroups, bGroups, t) {
        bGroups = bGroups || [];

        const COL_WIDTH = 50;

        const lines = [];

        for (let i = 0; i < Math.max(aGroups.length, bGroups.length); i++) {
            const ag = aGroups[i];
            const aText = ag && ag.active ?
                `${ag.quantity}x ${Util.fromCamelCase(ag.templateName)}` :
                '';

            const bg = bGroups[i];
            const bText = bg && bg.active ?
                `${bg.quantity}x ${Util.fromCamelCase(bg.templateName)}` :
                '';

            lines.push(
                aText.padEnd(COL_WIDTH, ' ') + bText
            );
        }

        return `\n-------------------------------------------------------------------------- ${t}s\n` +
            lines.join('\n');
    }

    // Tests a fight of arbitrary length between 2 Groups.
    // Groups do not move for now. Terrain is flat.
    // Does indeed mutate the Groups.
    static testEngagement (a, b, range, log) {
        a = Util.default(a, WGenerator.randomTemplate());
        b = Util.default(b, WGenerator.randomTemplate());

        const defaultRange = Math.ceil(Math.random() * 150);
        range = Util.default(range, defaultRange);
        log = Util.default(log, true);

        const aAction = a.actions[0] || ActionTemplate.example();
        const bAction = b.actions[0] || ActionTemplate.example();

        const summary = {
            a: a.templateName,
            aStartingQuantity: a.quantity,
            aAction: aAction.name,
            b: b.templateName,
            bStartingQuantity: b.quantity,
            bAction: bAction.name,
            range: range
        };

        // LATER maybe log a.progressBarSummary()
        // Util.log(a.toDebugString() + '\n' + b.toDebugString());

        const aName = Util.fromCamelCase(a.templateName);
        const bName = Util.fromCamelCase(b.templateName);

        let t;

        for (t = 0; t < 10000; t++) {
            const aAttack = ProjectileEvent.fireAt(a, aAction, b, range, log);
            const bOutcome = b.takeCasualties(aAttack.casualties);

            // if (log) {
            //     Util.log(`t=${ t }. A just fired at B (range ${ range }).\n${ a.dotGrid() }\n${ aName } x${ a.quantity }\nvs\n${ bName } x${ b.quantity }\n${ b.dotGrid() }`);
            // }

            if (! b.active) {
                break;
            }

            const bAttack = ProjectileEvent.fireAt(b, bAction, a, range, log);
            const aOutcome = a.takeCasualties(bAttack.casualties);

            if (log) {
                console.log(`${ aName } x${ a.quantity }\n${ a.dotGrid() }\n    vs (${ t }s)\n${ bName } x${ b.quantity }\n${ b.dotGrid() }\n\n\n`);
            }

            if (! a.active) {
                break;
            }
        }

        summary.secondsElapsed = t;
        summary.aFinalQuantity = a.quantity;
        summary.bFinalQuantity = b.quantity;

        if (log) {
            // console.log('\n' + Yaml.dump(summary));            
        }

        return summary;
    }

    static run () {
        // Only run test logic if the console command was something like 'node projectileEvent.js'
        if (! process.argv[1] || ! process.argv[1].endsWith('projectileEvent.js')) {
            return;
        }

        // const outcome = ProjectileEvent.islandBattle();


        const aName = 'gruntTest';
        const bName = 'grunt';
        const ratio = ProjectileEvent.costRatio(`halo/cov/individual/${aName}`, `halo/cov/individual/${bName}`);
        console.log(`1 ${aName} is worth ${ratio} ${bName}s`);

        const testCost = 6 * ratio;
        console.log(`That's ${testCost} (${testCost - 1} for the weapon) to a grunt's 6 (1+5 needler)`);
    }
};

// Old funcs from battle20 battleGroup.js:
// Actually originally from hobby/warband/gameState.js
// function hits (distance, targetArea, accuracy) {
//     // SCALING calibrates which accuracy stats are normal.
//     const SCALING = 100;
//     const advantage = targetArea * accuracy / SCALING;
//     const shotProbability = advantage / (advantage + distance + 1);

//     return Math.random() < shotProbability;
// }

// function damages (shot, victim) {
//     // Damage for now means the individual (victim) is converted from a combatant to a casualty.
//     const damageDiff = shot.damage - victim.durability; // + getDamageModifier(shot, victim);
//     const SCALING = 0.5; // To make the probabilities feel right

//     // quasi sigmoid probability curve between 0 and 1.
//     const exponentiated = Math.pow(2, SCALING * damageDiff);
//     const damageChance = exponentiated / (exponentiated + 1);
//     return Math.random() < damageChance;
// }

module.exports = ProjectileEvent;

// const outcome = ProjectileEvent.testEngagement();
// TODO Add hurdle so we only run test logic if this file is run with 'node projectileEvent.js'

ProjectileEvent.run();

