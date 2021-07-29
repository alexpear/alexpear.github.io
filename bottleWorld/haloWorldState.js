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
        const IGNORE_TAGS = ['fleetGen', 'ringBottle'];

        if (Util.hasOverlap(IGNORE_TAGS, creatureTemplate.tags)) {
            return true;
        }

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
            return true;
        }

        const messageStart = `Template ${creatureTemplate.name} is missing these:`;

        console.log(`${messageStart.padEnd(50)}${missing.join(' ')}`);
        return false;

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

        HaloWorldState.hitAnalysis();
    }
}

module.exports = HaloWorldState;

HaloWorldState.run();
