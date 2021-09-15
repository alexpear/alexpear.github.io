'use strict';

const WorldState = require('./worldState.js');

const ProjectileEvent = require('../bottleWorld/events/projectileEvent.js');

const WGenerator = require('../generation/wgenerator.js');

const Util = require('../util/util.js');

// Originally created to support Spaceless Halo Island project.
class HaloWorldState extends WorldState {
    // constructor () {
    //     super();


    // }

    static hitAnalysis () {
        const grid = [];

        const distances = [''];

        for (let c = 1; c <= 28; c++) {
            distances.push(5 * (c - 1) + 1);
        }

        // Header row
        grid.push(distances);

        for (let r = 1; r <= 36; r++) {
            const row = [r * 1]; //[r / 2];

            for (let c = 1; c < distances.length; c++) {
                // Shooting at a group of Spartans
                const advantage = row[0] * 4;
                
                const chance = advantage / (advantage + distances[c] + 1);

                row.push(((chance * 100).toFixed(0)).padStart(2) + '% ');
            }

            grid.push(row);
        }

        const str = Util.toChartString(grid);
        console.log('\nhit% by Hit stat & distance:\n' + str);

        return grid;
    }

    static randomFaction () {
        return Util.randomOf([
            'unsc',
            'cov',
            'forerunner',
            // 'flood'
        ]);
    }

    static randomArmy (cost) {
        cost = cost || 700;

        const faction = HaloWorldState.randomFaction();

        const groups = [];

        // 200 attempts
        for (let i = 0; i < 200; i++) {
            const newTemplate = HaloWorldState.randomTemplate(faction);

            const currentTotal = HaloWorldState.totalCost(groups);
            const costAvailable = cost - currentTotal;

            if (newTemplate.cost > costAvailable) {
                continue;
            }

            const maxThatFit = Math.floor(costAvailable / newTemplate.cost);

            const newQuantity = Math.ceil(Math.random() * maxThatFit);

            groups.push(
                WGenerator.newGroup(
                    newTemplate.codexPath + '/' + newTemplate.name,
                    newQuantity,
                    faction
                )
            );

            if (costAvailable - newQuantity * newTemplate.cost <= 10) {
                // Good enough.
                break;
            }
        }

        return groups.sort(
            (a, b) => {
                if (a.template.name < b.template.name) {
                    return -1;
                }
                if (b.template.name < a.template.name) {
                    return 1;
                }
                return 0;
            }
        );

    }

    static totalCost (groups) {
        return Util.sum(
            groups.map(
                g => g.cost()
            )
        );
    }

    static randomTemplate (faction) {
        const path = 'halo/' + faction + '/individual';

        // console.log(path);

        const glossary = WGenerator.generators[path].glossary;

        const templates = Object.keys(glossary).map(
            name => glossary[name]
        )
        .filter(
            t => (! HaloWorldState.ignoreTemplate(t)) && ! Util.contains(t.tags, 'action')
        );

        return Util.randomOf(templates);
    }

    static templateSpotCheck () {
        console.log();
        const haloPaths = WGenerator.codexPathsWithPrefix('halo')
            .filter(
                p => p.endsWith('individual')
            );

        const gens = haloPaths.map(
            path => WGenerator.generators[path]
        )
        .filter(
            gen => Object.keys(gen.glossary).length >= 1
            // LATER could also do the filtering below - does it have any nonignored templates?
        );

        const genA = Util.randomOf(gens);

        const codexPathA = genA.codexPath;
        const glossA = genA.glossary;

        const aTemplates = Object.keys(glossA).map(
            name => glossA[name]
        )
        .filter(
            t => (! HaloWorldState.ignoreTemplate(t)) && ! Util.contains(t.tags, 'action')
        );

        const templateA = Util.randomOf(aTemplates);
        const nameA = templateA && templateA.name;

        const missingA = HaloWorldState.missingStats(templateA);

        const genB = Util.randomOf(gens);

        const codexPathB = genB.codexPath;
        const glossB = genB.glossary;

        const bTemplates = Object.keys(glossB).map(
            name => glossB[name]
        )
        .filter(
            t => (! HaloWorldState.ignoreTemplate(t)) && ! Util.contains(t.tags, 'action')
        );

        const templateB = Util.randomOf(bTemplates);
        const nameB = templateB && templateB.name;
        const missingB = HaloWorldState.missingStats(templateB);

        if (
            ! templateA ||
            missingA.length > 1 ||
            (missingA[0] && missingA[0] !== 'cost') ||
            Object.keys(glossA).length === 0 ||
            ! templateB ||
            missingB.length > 1 ||
            (missingB[0] && missingB[0] !== 'cost') ||
            Object.keys(glossB).length === 0
        ) {
            const glossANote = glossA ?
                '' :
                ' (glossary missing)';

            const glossBNote = glossB ?
                '' :
                ' (glossary missing)';

            console.log(`\n${nameA} from ${codexPathA + glossANote} (template count is ${aTemplates.length})\n or ${nameB} from ${codexPathB + glossBNote} (template count is ${bTemplates.length}) has problems.`)
            return 'invalid';
        }

        const ratio = ProjectileEvent.costRatio(codexPathA + '/' + nameA, codexPathB + '/' + nameB);
        const costsA = HaloWorldState.costObj(templateA);
        const costsB = HaloWorldState.costObj(templateB);
        const stringA = HaloWorldState.costString(templateA);
        const stringB = HaloWorldState.costString(templateB);

        const adjustedA = costsB.total ?
            costsB.total * ratio :
            '?';

        const adjustedB = costsA.total ?
            costsA.total / ratio :
            '?';

        console.log(`\nCodex spot check: \n${templateA.name} has cost ${stringA} (ratio indicates ${adjustedA}) \n ratio is ${ratio} \n${templateB.name} has cost ${stringB} (ratio indicates ${adjustedB})`);
    }

    static costObj (template) {
        const weaponTemplate = WGenerator.ids[template.weapon];
        const weaponCost = weaponTemplate && weaponTemplate.cost;

        return {
            base: template.cost,
            weapon: weaponCost,
            total: Util.exists(template.cost) && Util.exists(weaponCost) ?
                template.cost + weaponCost :
                undefined
        };
    }

    static costString (template) {
        const costs = HaloWorldState.costObj(template);

        const total = costs.total || '?';
        const base = costs.base || '?';
        const weaponCost = costs.weapon || '?';

        return `${total} (${base} + ${weaponCost} for ${template.weapon})`;
    }

    static codexCompleteness () {
        const haloPaths = WGenerator.codexPathsWithPrefix('halo');

        for (let path of haloPaths) {
            const glossary = WGenerator.generators[path].glossary;

            for (let templateName in glossary) {
                HaloWorldState.goodTemplate(glossary[templateName]);
            }
        }
    }

    static goodTemplate (creatureTemplate) {
        return HaloWorldState.missingStats(creatureTemplate).length === 0;
    }

    static ignoreTemplate (template) {
        const IGNORE_TAGS = ['fleetGen', 'ringBottle', 'test'];

        return (! template) || Util.hasOverlap(IGNORE_TAGS, template.tags);
    }

    static missingStats (creatureTemplate) {
        if (HaloWorldState.ignoreTemplate(creatureTemplate)) {
            return [];
        }

        // console.log(`missingStats(): template tags are still: ${creatureTemplate.tags}`);

        const missing = [];

        if (Util.contains(creatureTemplate.tags, 'action')) {
          // It is a weapon, not a creature
          checkProps(
                ['cost', 'range', /*'canTarget',*/ 'shotsPerSecond', 'hit', 'damage', 'damageType'],
                // 'terrainCategory'
                creatureTemplate,
                missing
            );
        }
        else {
            // Util.logDebug(`template ${creatureTemplate.name} tags are ${creatureTemplate.tags}`);

            checkProps(
                ['cost', 'size', 'speed', 'durability', 'moveType'],
                // 'terrainCategory'
                creatureTemplate,
                missing
            );

            const attack = WGenerator.ids[creatureTemplate.weapon];

            if (! attack) {
                missing.push('attackInWGenerator');
            }
        }

        if (missing.length === 0) {
            return missing;
        }

        const messageStart = `Template ${creatureTemplate.name} is missing these:`;

        console.log(`${messageStart.padEnd(50)}${missing.join(' ')}`);
        return missing;

        function checkProps (keys, template, output) {
            for (let key of keys) {
                checkProp(key, template, output);
            }
        }

        function checkProp (key, template, output) {
            if (! Util.exists(template[key])) {
                output.push(key);
            }
        }
    }

    static run () {
        HaloWorldState.codexCompleteness();

        // HaloWorldState.hitAnalysis();

        let outcome = HaloWorldState.templateSpotCheck();

        const army = HaloWorldState.randomArmy();

        console.log(`\n${ProjectileEvent.spacelessBattleString(army, undefined, 0)}`);
    }
}

module.exports = HaloWorldState;

HaloWorldState.run();
