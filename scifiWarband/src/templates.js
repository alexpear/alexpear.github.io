'use strict';

//

const Util = require('../../util/util.js');

class Templates {
    static init () {
        const universe = Templates.Halo;
        for (let faction in universe) {
            for (let section in universe[faction]) {
                for (let entryName in universe[faction][section]) {
                    const entryObj = universe[faction][section][entryName];

                    Templates.setupAnything(entryObj, entryName);

                    if (section === 'Creature') {
                        Templates.setupCreature(entryObj);
                    }
                }
            }
        }
    }

    static setupAnything (obj, key) {
        obj.name = obj.name || key;
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
}

Templates.ATTACK_TYPE = {
    Kinetic: 'Kinetic',
    Plasma: 'Plasma',
    Impact: 'Impact',
    Explosive: 'Explosive',
    Hardlight: 'Hardlight',
    Electric: 'Electric',
};

Templates.Halo = {
    UNSC: {
        Item: {
            // Weapons
            SMG: {
                type: Templates.ATTACK_TYPE.Kinetic,
                damage: 1,
                rof: 4,
                accuracy: 1,
                preferredRange: 1,
            },

            // Non-Weapons

        },
        Creature: {
            // Infantry
            Marine: {
                size: 2,
                speed: 1, 
                durability: 10,
                accuracy: 1,
                items: [Templates.Halo.UNSC.Item.SMG],
            },

            // Vehicles

            // Motive for accuracy stat - Spartans better with firearms than Grunts, also makes takeUnshieldedDamage() status effects simpler.
        },
        Squad: {
            Marine: {
                name: 'Marine Fireteam',
                creature: Templates.Halo.UNSC.Creature.Marine,
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
            }

            // Non-Weapons

        },
        Creature: {
            // Infantry
            Grunt: {
                size: 1.5,
                speed: 1, 
                durability: 5,
                accuracy: 0,
                items: [Templates.Halo.Covenant.Item.PlasmaPistol],
            },
            
            // Vehicles

        },
        Squad: {
            // Infantry
            Grunt: {
                name: 'Grunt Lance',
                creature: Templates.Halo.Covenant.Creature.Grunt,
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
