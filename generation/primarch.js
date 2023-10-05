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
                continue;
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
            { name: 'hammer', type: 'melee weapon' },
            { name: 'gladius', type: 'melee weapon' },
            { name: 'sword', type: 'melee weapon' },
            { name: 'blade', type: 'melee weapon' },
            { name: 'axe', type: 'melee weapon' },
            { name: 'spear', type: 'melee weapon' },
            { name: 'whip', type: 'melee weapon' },
            { name: 'chain', type: 'melee weapon' },
            { name: 'staff', type: 'melee weapon' },
            { name: 'glaive', type: 'melee weapon' },
            { name: 'flail', type: 'melee weapon' },
            { name: 'whip sword', type: 'melee weapon' },
            { name: 'rope dart', type: 'melee weapon' },
            { name: 'nunchaku', type: 'melee weapon' },
            { name: 'fist', type: 'melee weapon' },
            { name: 'scythe', type: 'melee weapon' },
            { name: 'javelin', type: 'ranged weapon' },
            { name: 'throwing axes', type: 'ranged weapon' },
            { name: 'throwing knives', type: 'ranged weapon' },
            { name: 'shuriken', type: 'ranged weapon' },
            { name: 'chakrams', type: 'ranged weapon' },
            { name: 'cannon', type: 'ranged weapon' },
            { name: 'precision rifle', type: 'ranged weapon' },
            { name: 'machine gun', type: 'ranged weapon' },
            { name: 'revolver', type: 'ranged weapon' },
            { name: 'shotgun', type: 'ranged weapon' },
            { name: 'bow', type: 'ranged weapon' },
            { name: 'crossbow', type: 'ranged weapon' },
            { name: 'netgun', type: 'ranged weapon' },
            { name: 'harpoon', type: 'ranged weapon' },
            { name: 'grenades', type: 'ranged weapon' },
            { name: 'missiles', type: 'ranged weapon' },
            { name: 'bomb', type: 'ranged weapon' },
            { name: 'vortex tube', type: 'ranged weapon' },
            { name: 'power pack', type: 'gear' },
            { name: 'arm shield', type: 'gear' },
            { name: 'plasma weapons', type: 'mod' },
            { name: 'cryo weapons', type: 'mod' },
            { name: 'electro weapons', type: 'mod' },
            { name: 'arcano weapons', type: 'mod' },
            { name: 'heavy weapons', type: 'mod' },
            { name: 'armor piercing weapons', type: 'mod' },
            { name: 'stealth weapons', type: 'mod' },
            { name: 'magnetic weapons', type: 'mod' },
            { name: 'poison weapons', type: 'mod' },
            { name: 'acid weapons', type: 'mod' },
            { name: 'tracker weapons', type: 'mod' },
            { name: 'toxigas weapons', type: 'mod' },
            { name: 'laser weapons', type: 'mod' },
            { name: 'rocket-propelled weapons', type: 'mod' },
            { name: 'density weapons', type: 'mod' },
            { name: 'graviton weapons', type: 'mod' },
            { name: 'tachyon weapons', type: 'mod' },
            { name: 'heat-seeking weapons', type: 'mod' },
            { name: 'spiderweb weapons', type: 'mod' },
            { name: 'cyberspam weapons', type: 'mod' },
            { name: 'stun weapons', type: 'mod' },
            { name: 'psychoactive weapons', type: 'mod' },
            { name: 'nanite weapons', type: 'mod' },
            { name: 'nanovirus weapons', type: 'mod' },
            { name: 'hardlight weapons', type: 'mod' },
            { name: 'void weapons', type: 'mod' },
            { name: 'phase weapons', type: 'mod' },
            { name: 'timestop weapons', type: 'mod' },
            { name: 'two weapons', type: 'mod' },
            { name: 'antigrav weapons', type: 'mod' },
            { name: 'incredible reflexes', type: 'mod' },

        ];
    }

    static asString (cardset) {
        return cardset.map(
            card => Util.capitalizedAllWords(card.name)
        ).join(
            '\n'
        );
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
            'falsefied enemy credentials', // limited influence over enemy cards
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
        const cardset = [];
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
        PrimarchCards.herschelDemo();
    }
}

module.exports = PrimarchCards;

PrimarchCards.run();
