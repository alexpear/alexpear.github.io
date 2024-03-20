'use strict';

const Util = require('../util/util.js');

class PrimarchCards {

    // returns array
    static newCardset () {
        const cardset = [];

        cardset.push(
            Util.randomOf(PrimarchCards.chassisTypes())
        );

        const gearCount = Util.randomUpTo(3) + 1;

        for (let i = 0; i < gearCount; i++) {
            const newGear = Util.randomOf(PrimarchCards.gearTypes());

            // Skip duplicate draws.
            if (cardset.some(
                card => card.name === newGear.name
            )) {
                i--;
                continue;
            }

            const GEAR_TYPES = [
                'weapon',
                'mod',
                'damageMod',
            ];

            if (! GEAR_TYPES.includes(newGear.type)) {
                i--;
                continue;
            }

            if (newGear.type === 'damageMod') {
                newGear.name += ' weapons';
            }

            cardset.push(newGear);
        }

        return cardset;
    }

    static chassisTypes () {
        return [
            { name: 'squad', type: 'infantry' },
            { name: 'champion', type: 'infantry' },
            { name: 'fortification', type: 'structure' },
            { name: 'mechasuit', type: 'vehicle' },
            { name: 'aircraft', type: 'vehicle' },
            { name: 'quadwalker', type: 'vehicle' },
            { name: 'cyberdragon', type: 'vehicle' },
            { name: 'cephalodroid', type: 'vehicle' },
            { name: 'landship', type: 'vehicle' },
            { name: 'insectoid bioform', type: 'bioform' },
            // { name: 'leonine bioform', type: 'bioform' },
            { name: 'avian bioform', type: 'bioform' },
            { name: 'reptoid bioform', type: 'bioform' },
            { name: 'crustacean bioform', type: 'bioform' },
            { name: 'molluscoid bioform', type: 'bioform' },
            { name: 'arcanofiend bioform', type: 'bioform' },
        ];
    }

    static gearTypes () {
        return [
            { name: 'hammer', type: 'weapon', distance: 'melee' },
            { name: 'gladius', type: 'weapon', distance: 'melee' },
            { name: 'sword', type: 'weapon', distance: 'melee' },
            { name: 'blade', type: 'weapon', distance: 'melee' },
            { name: 'axe', type: 'weapon', distance: 'melee' },
            { name: 'spear', type: 'weapon', distance: 'melee' },
            { name: 'whip', type: 'weapon', distance: 'melee' },
            { name: 'chain', type: 'weapon', distance: 'melee' },
            { name: 'staff', type: 'weapon', distance: 'melee' },
            { name: 'glaive', type: 'weapon', distance: 'melee' },
            { name: 'flail', type: 'weapon', distance: 'melee' },
            { name: 'whip sword', type: 'weapon', distance: 'melee' },
            { name: 'rope dart', type: 'weapon', distance: 'melee' },
            { name: 'nunchaku', type: 'weapon', distance: 'melee' },
            { name: 'fist', type: 'weapon', distance: 'melee' },
            { name: 'scythe', type: 'weapon', distance: 'melee' },
            { name: 'javelin', type: 'weapon', distance: 'ranged' },
            { name: 'throwing axes', type: 'weapon', distance: 'ranged' },
            { name: 'throwing knives', type: 'weapon', distance: 'ranged' },
            { name: 'shuriken', type: 'weapon', distance: 'ranged' },
            { name: 'chakrams', type: 'weapon', distance: 'ranged' },
            { name: 'cannon', type: 'weapon', distance: 'ranged' },
            { name: 'precision rifle', type: 'weapon', distance: 'ranged' },
            { name: 'machine gun', type: 'weapon', distance: 'ranged' },
            { name: 'revolver', type: 'weapon', distance: 'ranged' },
            { name: 'shotgun', type: 'weapon', distance: 'ranged' },
            { name: 'bow', type: 'weapon', distance: 'ranged' },
            { name: 'crossbow', type: 'weapon', distance: 'ranged' },
            { name: 'netgun', type: 'weapon', distance: 'ranged' },
            { name: 'harpoon', type: 'weapon', distance: 'ranged' },
            { name: 'grenades', type: 'weapon', distance: 'ranged' },
            { name: 'missiles', type: 'weapon', distance: 'ranged' },
            { name: 'bomb', type: 'weapon', distance: 'ranged' },
            { name: 'vortex tube', type: 'weapon', distance: 'ranged' },

            { name: 'plasma', type: 'damageMod' },
            { name: 'cryo', type: 'damageMod' },
            { name: 'electro', type: 'damageMod' },
            { name: 'arcano', type: 'damageMod' },
            { name: 'heavy', type: 'damageMod' },
            { name: 'armor piercing', type: 'damageMod' },
            { name: 'stealth', type: 'damageMod' },
            { name: 'magnetic', type: 'damageMod' },
            { name: 'poison', type: 'damageMod' },
            { name: 'acid', type: 'damageMod' },
            { name: 'tracker', type: 'damageMod' },
            { name: 'toxigas', type: 'damageMod' },
            { name: 'laser', type: 'damageMod' },
            { name: 'rocket-propelled', type: 'damageMod' },
            { name: 'density', type: 'damageMod' },
            { name: 'graviton', type: 'damageMod' },
            { name: 'tachyon', type: 'damageMod' },
            { name: 'heat-seeking', type: 'damageMod' },
            { name: 'spiderweb', type: 'damageMod' },
            { name: 'cyberspam', type: 'damageMod' },
            { name: 'stun', type: 'damageMod' },
            { name: 'psychoactive', type: 'damageMod' },
            { name: 'nanite', type: 'damageMod' },
            { name: 'nanovirus', type: 'damageMod' },
            { name: 'hardlight', type: 'damageMod' },
            { name: 'void', type: 'damageMod' },
            { name: 'phase', type: 'damageMod' },
            { name: 'timestop', type: 'damageMod' },
            { name: 'antigrav', type: 'damageMod' },

            { name: 'two weapons', type: 'mod' },
            { name: 'incredible reflexes', type: 'mod' },
            { name: 'power pack', type: 'mod' },
            { name: 'arm shield', type: 'mod' },
            { name: 'active camo', type: 'mod' },

            { name: 'chainmesh', type: 'worn' },
            { name: 'ceramic plate armor', type: 'worn' },
            { name: 'camo cloak', type: 'worn' },
            { name: 'knightscale forcefield', type: 'worn' },
            { name: 'heavy castle armor', type: 'worn' },
            { name: 'heavy VTOL armor', type: 'worn' },
        ];
    }

    static asString (cardset) {
        return cardset.map(
            card => Util.capitalizedAllWords(card.name)
        ).join(
            '\n'
        );
    }

    /* Razorfire version
    Space Gothic setting
    A warrior has 4 slots, each with 0-1 cards in it
    Default weapon is Sword.
    */
    static razorfireDemo () {
        const str = PrimarchCards.razorfireStr(
            PrimarchCards.razorfireWarrior()
        );

        console.log(str);
    }

    static razorfireWarrior () {
        const SLOT_CHANCES = {
            damageMod: 0.5,
            weapon: 0.8,
            worn: 0.5,
            mod: 0.3,
        };

        const warrior = {};

        for (let slot in SLOT_CHANCES) {
            if (Math.random() > SLOT_CHANCES[slot]) {
                continue;
            }

            // warrior[slot]
            const template = Util.randomOf(
                PrimarchCards.gearTypes().filter(
                    t => t.type === slot
                )
            );

            warrior[slot] = template;
        }

        return warrior;
    }

    static razorfireStr (warrior) {
        const wornPhrase = warrior.worn ?
            ` in ${warrior.worn.name}` :
            '';

        const damageModPhrase = warrior.damageMod ?
            ` ${warrior.damageMod.name}` :
            '';

        const weaponPhrase = warrior.weapon ?
            `${warrior.weapon.name}` :
            'sword';

        const modPhrase = warrior.mod ?
            `\n & ${warrior.mod.name}` :
            '';

        return `warrior${wornPhrase}\n w/${damageModPhrase} ${weaponPhrase}${modPhrase}`;
    }

    /* Herschel version notes
    Perhaps each combatant cardset comes with a identical chassis card, as a reminder.
    Standard Issue Carbine 
    */
    static herschelCard () {
        const name = Util.randomOf([
            'chameleon paint',
            'wing pack',
            'chainmesh armor',
            'netinfil suite',
            'personal forcefield',
            'strength exoskeleton',
            'agility exoskeleton',
            'infrared visor',
            'guncopter trio',
            'spiderbot trio',
            'falsified enemy credentials', // limited influence over enemy cards
            'enemy net wiretap', // + initiative
            'nanoswarm grenades', // vulnerable to netinfil, fire, & antisynthetic effects

            // infantry weapons
            'sniper rifle',
            'rotary chaingun',
            'missile launcher',
            'laser cannon',
            'flamethrower',
            'silenced SMG',
            'plasma sword',

            'EMP',
            'demolition charge',
            'flashbang',
            'stun gas grenades',

            // mecha weapons
            'heavy railgun',
            'heavy plasma cannon',
            'tankbuster laser',
            'point defense lasers',
            'knightcatcher netgun',
            'knightscale hammer',
            'magnet grenade',

            'ceramic plate armor',
            'heavy castle armor', // comes with power reactor, exoskeleton, etc. Increases max weight. Permits using multiple weapons at once.
            'heavy VTOL module',
            'knightscale forcefield',
        ]);

        return { name };
    }

    // 2023 July 25. Sketching out a new style of gear cards. Arbitrarily calling this version Herschel, after a fictional weapons manufacturer.
    // No chassis - cardset can represent infantry or mecha.
    static herschelDemo () {
        const cardset = [
            {
                name: 'soldier',
            }
        ];
        const cardCount = Util.randomIntBetween(1, 6);

        for (let i = 0; i < cardCount; i++) {
            cardset.push(PrimarchCards.herschelCard());
        }

        console.log();
        console.log(PrimarchCards.asString(cardset));
        console.log();
    }

    // drop pod deployment

    static demo () {
        const cardset = PrimarchCards.newCardset();

        console.log();
        console.log(PrimarchCards.asString(cardset));
        console.log();
    }

    static run () {
        // PrimarchCards.demo();
        // PrimarchCards.herschelDemo();
        PrimarchCards.razorfireDemo();
    }
}

module.exports = PrimarchCards;

PrimarchCards.run();
