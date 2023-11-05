'use strict';

//

const Util = require('../../util/util.js');

class Templates {
    static init () {
        // Util.logDebug(`Templates.init(), top.`);

        for (let universe of Templates.universes()) {
            for (let faction in universe) {
                // Util.logDebug(`Templates.init(), faction=${faction}`);

                if (Util.isString(universe[faction])) { continue; }

                universe[faction].name = faction;

                for (let section in universe[faction]) {
                    const sectionObj = universe[faction][section];

                    if (Util.isString(sectionObj)) { continue; }

                    for (let entryName in sectionObj) {
                        const entryObj = sectionObj[entryName];

                        // Util.logDebug(`Templates.init() loop, faction=${faction} entryName=${entryName}`)

                        if (section === 'Creature') {
                            Templates.setupCreature(entryObj);
                        }
                        else if (section === 'Item') {
                            Templates.setupItem(entryObj);
                        }

                        Templates.setupAnything(
                            entryObj,
                            [universe.name, faction, section, entryName]
                        );
                    }
                }
            }
        }
    }

    static setupAnything (obj, pathArray) {
        // Util.logDebug(`Templates.setupAnything(obj=${Util.stringify(obj)}, pathArray=${pathArray})`)

        obj.name = obj.name || pathArray[pathArray.length - 1];
        obj.faction = obj.faction || pathArray[1];

        // Links
        if (obj.creature) {
            obj.creature = Templates.translateDotPath(pathArray, obj.creature);
        }

        if (obj.items) {
            for (let i = 0; i < obj.items.length; i++) {
                obj.items[i] = Templates.translateDotPath(pathArray, obj.items[i]);
            }
        }
    }

    static translateDotPath (pathArray, dotPath) {
        const words = dotPath.split('.');
        const translatedPath = [];

        // universe, faction, section, entry
        for (let i = 0; i < pathArray.length; i++) {
            const lengthDiff = pathArray.length - words.length;

            // Util.logDebug(`translateDotPath(${pathArray.join('.')}, ${dotPath}): i=${i}, pathArray.length - i = ${pathArray.length - i}, words[i - lengthDiff] is ${words[i - lengthDiff]}`);

            // If dotPath is long enough, use that. Else use pathArray.
            const narrowerKey = words.length >= (pathArray.length - i) ?
                words[i - lengthDiff] :
                pathArray[i];

            translatedPath.push(narrowerKey);
        }

        // Util.logDebug(`${dotPath} in context ${pathArray.join('.')} translates to ${translatedPath.join('.')}`);

        let obj = Templates;
        for (let key of translatedPath) {
            obj = obj[key];
        }

        // Util.logDebug(`Templates.translateDotPath(${pathArray}, foo...): obj=${Util.stringify(obj)}`);

        return obj;
    }

    static setupItem (item) {
        const DEFAULTS = {
            size: 0.1,
            cost: 0.1,
            durability: 1,
        };

        for (let key in DEFAULTS) {
            if (! Util.exists(item[key])) {
                item[key] = DEFAULTS[key];
            }
        }
    }

    static setupCreature (creature) {
        const DEFAULTS = {
            size: 2,
            // LATER we could also add bulk or weight, if useful.
            cost: 1,
            speed: 1,
            durability: 1,
            shields: 0,
            accuracy: 0,
            resistance: {},
            items: [],
        };

        for (let key in DEFAULTS) {
            if (! Util.exists(creature[key])) {
                creature[key] = DEFAULTS[key];
            }
        }
    }

    static allSquads () {
        return Templates.allEntries('Squad');
    }

    static allEntries (type) {
        let entries = [];
        for (let universe of Templates.universes()) {
            for (let factionKey in universe) {
                const faction = universe[factionKey];
                if (Util.isString(faction)) { continue; }

                // Util.logDebug(`Templates.allEntries(${type || ''}), factionKey=${factionKey}`);

                if (type) {
                    entries = entries.concat(Object.values(faction[type]));
                }
                else {
                    entries = entries.concat(Object.values(faction.Item));
                    entries = entries.concat(Object.values(faction.Creature));
                    entries = entries.concat(Object.values(faction.Squad));
                }
            }
        }

        return entries;
    }

    static test () {
        Util.logDebug(Templates.universes());
    }

    static universes () {
        return [
            Templates.Halo,
        ];
    }
}

Templates.ATTACK_TYPE = {
    Kinetic: 'Kinetic',
    Plasma: 'Plasma',
    Impact: 'Impact',
    Explosive: 'Explosive',
    Hardlight: 'Hardlight',
    Electric: 'Electric',
};

// LATER this obj could be defined in its own file in YAML, to make it easier for nondevs to edit.
Templates.Halo = {
    name: 'Halo',
    UNSC: {
        Item: {
            // Weapons
            SMG: {
                type: Templates.ATTACK_TYPE.Kinetic,
                damage: 1,
                rof: 4,
                accuracy: 1,
                preferredRange: 1,
                color: 'yellow'
            },

            // Non-Weapons

        },
        Creature: {
            // Infantry
            Marine: {
                size: 2,
                speed: 1.5,
                durability: 10,
                accuracy: 1,
                items: ['Item.SMG'],
            },

            // Vehicles

            // Motive for accuracy stat - Spartans better with firearms than Grunts, also makes takeUnshieldedDamage() status effects simpler.
        },
        Squad: {
            Marine: {
                name: 'Marine Fireteam',
                creature: 'Creature.Marine',
                quantity: 3,
                image: 'marine.png',
           },

        },
    },
    Covenant: {
         Item: {
            // Weapons
            PlasmaPistol: {
                name: 'Plasma Pistol',
                type: Templates.ATTACK_TYPE.Plasma,
                damage: 2,
                rof: 2,
                accuracy: 1.5,
                preferredRange: 2,
                color: 'lime',
            }

            // Non-Weapons

        },
        Creature: {
            // Infantry
            Grunt: {
                size: 1.5,
                speed: 1.5,
                durability: 5,
                accuracy: 0,
                items: ['Item.PlasmaPistol'],
            },
            
            // Vehicles

        },
        Squad: {
            // Infantry
            Grunt: {
                name: 'Grunt Lance',
                creature: 'Creature.Grunt',
                quantity: 4,
                image: 'grunt.png',
           },

            // Vehicles

        },
    },
    Forerunner: {
        Item: {
            // Weapons

            // Non-Weapons

        },
        Creature: {
            // Infantry
            
            // Vehicles

        },
        Squad: {
            // Infantry
            
            // Vehicles

        },
    },
    Flood: {
        Item: {
            // Weapons

            // Non-Weapons

        },
        Creature: {
            // Infantry
            
            // Vehicles

        },
        Squad: {
            // Infantry
            
            // Vehicles

        },
    },
};

module.exports = Templates;

Templates.init();
// Templates.test();
