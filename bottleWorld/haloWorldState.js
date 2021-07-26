'use strict';

const WorldState = require('./worldState.js');

const WGenerator = require('../generation/wgenerator.js');

// 
class HaloWorldState extends WorldState {







    static goodTemplate (creatureTemplate) {
        const missing = [];

        checkProps(
            ['cost', 'size', 'speed', 'durability'],
            // 'terrainCategory'
            creatureTemplate,
            missing
        );

        const attack = WGenerator.ids[creatureTemplate.weapon];

        if (! attack) {
            missing.push('attackInWGenerator');
        }
        else {
            checkProps(
                ['range', 'hit', 'damage', 'shotsPerSecond', 'damageType'],
                // 'targetCategories'
                creatureTemplate,
                missing
            );
        }

        if (missing.length === 0) {
            return true;
        }

        Util.logError(`ProjectileEvent: template is missing these: ${missing.join(' ')}`);
        return false;

        function checkProps (keys, template, output) {
            for (let key of keys) {
                checkProp(key, template, output);
            }
        }

        function checkProp (key, template, output) {
            if (! template[key]) {
                output.push(key);
            }
        }
    }
}

module.exports = HaloWorldState;
