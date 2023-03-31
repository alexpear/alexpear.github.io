'use strict';

const Util = require('../util/util.js');

class ScienceFantasy {
    static randomWord (type) {
        // console.log(`at top of randomWord(), type is ${type}, PEOPLE? ${!! ScienceFantasy.PEOPLE}`);

        const suffixType = ScienceFantasy[type] || Util.randomOf(ScienceFantasy.SUFFICES);

        const prefix = Util.randomOf(ScienceFantasy.PREFICES);
        let suffix = Util.randomOf(suffixType.content)[0];

        if (prefix.endsWith('-')) {
            if (suffix.startsWith('-')) {
                // Tidy up duplicate '-' characters.
                suffix = suffix.slice(1);
            }

            suffix = Util.capitalized(suffix);
        }
        else if (suffix.startsWith('-')) {
            suffix = '-' + Util.capitalized(suffix.slice(1));
        }

        return Util.capitalized(prefix) + suffix;
    }

    static randomLocation () {
        return ScienceFantasy.randomWord('LOCATIONS');
    }

    static randomItem () {
        return ScienceFantasy.randomWord('ITEMS');
    }    

    static fourLocations () {
        const northLocation = ScienceFantasy.randomLocation();
        const westLocation = ScienceFantasy.randomLocation();
        const eastLocation = ScienceFantasy.randomLocation();
        const southLocation = ScienceFantasy.randomLocation();
        const northBuffer = ' '.repeat(westLocation.length + 3 - Math.ceil(northLocation.length / 2));
        const southBuffer = ' '.repeat(westLocation.length + 3 - Math.ceil(southLocation.length / 2));

        return `${northBuffer}${northLocation}\n\n\n${westLocation}     ${eastLocation}\n\n\n${southBuffer}${southLocation}`;
    }

    static randomCharacterTitle () {
        const type = Util.randomOf(['PEOPLE', 'BEASTS']);
        return ScienceFantasy.randomWord(type);
    }

    static randomItemSet () {
        const set = [];

        while (Location.somethingHere()) {
            set.push(
                ScienceFantasy.randomItem()
            );
        }

        return set;
    }

    static randomCharacterSet () {
        const set = [];

        while (Location.somethingHere()) {
            set.push(
                new Character()
            );
        }

        return set;
    }

    static test () {
        // for (let i = 0; i < 20; i++) {
            // const name = ScienceFantasy.randomWord();
            // const name2 = ScienceFantasy.randomWord();

            // console.log(`\n  The ${name} of the ${name2}\n`);

            // console.log(`\n${ScienceFantasy.fourLocations()}\n`);


            const output = new Location().toString();

            console.log(`\n${output}\n`);
        // }
    }
}

ScienceFantasy.PREFICES = [
    'bio',
    'cyber',
    'hyper',
    'quick',
    'ultra',
    'neo',
    'arch',
    'necro',
    'thanato',
    'death',
    'xeno',
    'exo',
    'super',
    'power',
    'archaeo',
    'aqua',
    'litho',
    'phyto',
    'hemo',
    'botano',
    'myco',
    'ferro',
    'sand',
    'earth',
    'aero',
    'steam',
    'zoö',
    'leo',
    'tyranno',
    'deep',
    'void',
    'alethe',
    'info',
    'micro',
    'nano',
    'giga',
    'electro',
    'volt-',
    'ohm-',
    'chrono',
    'umber',
    'photo',
    'lux',
    'radio',
    'joule',
    'pyro',
    'sear',
    'fire',
    'burn',
    'thunder',
    'howl',
    'shriek',
    'wild',
    'theo',
    'god',
    'ark',
    'ring',
    'logo',
    'cranio',
    'neuro',
    'lexo',
    'digi',
    'q-',
    'mu-',
    'tau',
    'muon',
    'knot',
    'chain',
    'bottle',
    'scalpel',
    'knife',
    'blade',
    'shield',
    'cryo',
    'crpyto',
    // 'urso',
    'astro',
    'star',
    // 'ave',
    'diabolo',
    'hell',
    'mecha',
    'helio',
    'sun',
    'solar',
    'luna',
    'night',
    'tenebro',
    'black',
    'shadow',
    'proto',
    'macro',
    'giganto',
    'garganto',
    'kilo',
    'cubit-',
    'fathom',
    'phoenix',
    'ash',
    'silver',
    'porphy',
    'gold',
    'pain',
    'blood',
    'bone',
    'skull',
    'echo',
    'toxin',
    'eco',
    'geo',
    'draco',
    'thermo',
    'turbo',
    'arcano',
    // 'herpe',
    'snake-',
    'thaumo',
    'opto',
    'chromato',
    // 'meteoro', //eh
    'chemo',
    'holo',
    'bello',
    'war',
    'hate',
    'osseo',
    // 'osteo',
    'flora',
    'phospho',
    'gyro',
    'pseudo',
    'gene',
    'myrmo',
    'psycho',
    'psy',
    'hypno',
    'oneiro',
    // 'philo',
    'heart',
    'gastro',
    'fluoro',
    'robo',
    'servo',
    'techno',
    // 'magna',
    'arachno',
    'ovo',
    'chloro',
    'aesthe',
    'anesthe',
    'lethe',
    'noö',
    'pneuma',
    'econo',
    'mimeo',
    'anti',
    'lycanthro',
    'icthy',
    'sangui',
    'quatra',
    'penta',
    'hexa',
    'hepta',
    'octo',
    'corona',
    'phobo',
    'ergo',
    'hiero',
    'impero',
    'veloci',
    'herme', //eh
    'atheno',
    'ourano', //eh
    'orion',
    'sky',
    'cloud',
    'wind',
    'bacchu',
    'mirror',
    'kino',
    'uni', //eh
    'pan',
    'omni',
    'demo',
    'fury',
    'Ur-',
    'engine-',
    'raven',
    'owl',
    'forge',
];

// class Suffix = {
//     constructor (text, weight) {
//     }
// }


ScienceFantasy.BEASTS = {
    type: 'beast',
    content: [
        ['beast', 9],
        ['titan', 9],
        ['dragon', 9],
        ['spider', 9],
        ['wolf', 9],
        ['tiger', 9],
        ['falcon', 9],
        ['hawk', 9],
        ['bird', 9],
        ['serpent', 9],
        ['worm', 9],
        ['wyrm', 9],
        ['gorgon', 9],
        ['form', 9],
        ['morph', 9],
        ['spectre', 9],
        ['geist', 9],
        ['spirit', 9],
        ['phage', 9],
        ['vore', 1],
        ['horse', 9],
        ['bot', 9],
        ['demon', 9],
        ['devil', 9],
        ['fiend', 9],
        ['angel', 9],
        ['seraph', 9],
        ['cherub', 9],
        ['monad', 9],
        ['-archon', 9],
        ['mind', 9],
        ['brain', 9],
        ['skull', 9],
        ['wraith', 9],
        ['squid', 9],
        ['snail', 9],
        ['crow', 9],
        ['giant', 9],
        ['hulk', 9],
        ['sphynx', 9],
        ['fox', 9],
        ['hound', 9],
        ['kraken', 9],
        ['sapiens', 9],
        ['primate', 9],
        ['whale', 9],
    ]
};

ScienceFantasy.PEOPLE = {
    type: 'person',
    content: [
        ['master', 9],
        ['sorcerer', 9],
        ['mancer', 9],
        ['mage', 9],
        ['seer', 9],
        ['wizard', 9],
        ['lich', 9],
        ['queen', 9],
        // ['empress', 9],
        ['lord', 9],
        ['pharaoh', 9],
        ['princess', 9],
        ['prince', 9],
        ['baron', 9],
        ['duke', 9],
        ['duchess', 9],
        ['pirate', 9],
        ['scion', 9],
        ['savior', 9],
        ['phile', 9],
        ['crone', 9],
        ['prophet', 9],
        ['sage', 9],
        ['chieftain', 9],
        ['shaman', 9],
        ['witch', 9],
        ['priest', 9],
        ['priestess', 9],
        ['-oracle', 9],
        ['sybil', 9],
        ['tyrant', 9],
        ['scourge', 9],
        ['-imperator', 9],
        ['thief', 9],
        ['slayer', 9],
        ['killer', 9],
        ['bane', 9],
        ['foe', 9],
        ['friend', 9],
        ['champion', 9],
        ['sire', 9],
        ['mother', 9],
        ['father', 9],
        ['druid', 9],
        ['centurion', 9],
        ['captain', 9],
        ['patron', 9],
        ['christ', 9],
        ['saint', 9],
        ['child', 9],
        // ['babe', 9],
        ['girl', 9],
        ['maiden', 9],
        ['daughter', 9],
        ['deceiver', 9],
        ['liar', 9],
        ['kin', 9],
        ['squad', 9],
        ['corps', 9],
        ['legion', 9],
        ['cult', 9],
        ['clan', 9],
    ]
};

ScienceFantasy.LOCATIONS = {
    type: 'location',
    content: [
        ['castle', 9],
        // ['-polis', 9], //eh
        ['city', 9],
        ['fortress', 9],
        ['fort', 9],
        ['bastion', 9],
        ['tower', 9],
        ['maze', 9],
        ['prison', 9],
        ['mountain', 9],
        ['sea', 9],
        ['forest', 9],
        ['jungle', 9],
        ['river', 9],
        ['wastes', 9],
        ['farm', 9],
        ['sphere', 9],
        ['kingdom', 9],
        ['network', 9],
        ['web', 9],
        ['planet', 9],
        ['system', 9],
        ['tomb', 9],
        ['vault', 9],
        ['shrine', 9],
        ['temple', 9],
        ['church', 9],
        ['basilica', 9],
        ['cathedral', 9],
        ['crypt', 9],
        ['grave', 9],
        ['base', 9],
        ['zone', 9],
        ['realm', 9],
        ['region', 9],

    ]
};

ScienceFantasy.ITEMS = {
    type: 'item',
    content: [
        ['sword', 9],
        ['codex', 9],
        ['cannon', 9],
        ['-orb', 9],
        ['stone', 9],
        ['diamond', 9],
        ['prize', 9],
        ['vox', 9],
        ['voice', 9],
        ['flask', 9],
        // ['vial', 9],
        ['phial', 9],
        ['crown', 9],
        ['fighter', 9],
        ['cruiser', 9],
        ['wall', 9],
        ['cross', 9],
        ['machina', 9],
        ['machine', 9],
        ['crux', 9],
        ['core', 9],
        ['spear', 9],
        ['blade', 9],
        ['knife', 9],
        ['scythe', 9],
        ['helm', 9],
        ['visor', 9],
        ['gauntlet', 9],
        ['fist', 9],
        ['boots', 9],
        ['scepter', 9],
        ['glass', 9],
        ['ship', 9],
        ['throne', 9],
        ['forge', 9],
        ['craft', 9],
        ['vessel', 9],
        ['furnace', 9],
        ['shield', 9],
        ['seed', 9],
        ['clade', 9],
        ['plague', 9],
        ['pox', 9],
        ['map', 9],
        // ['status', 9],
        ['womb', 9],
        ['vortex', 9],
        ['storm', 9],
        ['cortex', 9],
        ['soul', 9],
    ]
};

ScienceFantasy.ABSTRACTS = {
    type: 'abstract',
    content: [
        ['decimal', 9],
        ['digital', 9],
        ['strain', 9],
        ['curse', 9],
        ['power', 9],
        ['rage', 9],
        ['fury', 9],
        ['science', 9],
        ['lore', 9],
        ['data', 9],
        ['saga', 9],
        ['chronicle', 9],
        ['doctrine', 9],
        ['faith', 9],
        ['pact', 9],
        ['truce', 9],
        ['sophy', 9],
        ['future', 9],
        ['birth', 9],
        ['history', 9],
        ['vision', 9],
        ['quest', 9],
        ['path', 9],
        ['destiny', 9],
        ['fate', 9],
        ['disaster', 9],
        ['rescue', 9],
        ['stillness', 9],
        ['force', 9],
        ['winter', 9],
        ['mandate', 9],
    ]
};

ScienceFantasy.SUFFICES = [
    ScienceFantasy.BEASTS,
    ScienceFantasy.PEOPLE,
    ScienceFantasy.LOCATIONS,
    ScienceFantasy.ITEMS,
    ScienceFantasy.ABSTRACTS,
];

class Character {
    constructor () {
        this.name = ScienceFantasy.randomCharacterTitle();
        this.inventory = ScienceFantasy.randomItemSet();
    }

    toString () {
        const itemEntries = this.inventory.map(
            item => 'the ' + item
        );

        // let inventoryStr = this.inventory.length === 0
        //     ? ''
        //     : ', possessor of ';

        // for (let i = 0; i < this.inventory.length; i++) {
        //     inventoryStr += 'the ' + this.inventory[i];
        // }

        // return `${this.name}${inventoryStr}`;

        return itemEntries.length === 0
            ? this.name 
            : `${this.name}, possessor of ${itemEntries.join(' & ')}.`
    }
}

class Location {
    constructor () {
        this.name = ScienceFantasy.randomLocation();
        this.leader = Location.somethingHere()
            ? new Character()
            : undefined;
        this.court = ScienceFantasy.randomCharacterSet();
        this.prison = ScienceFantasy.randomCharacterSet();
        this.treasury = ScienceFantasy.randomItemSet();
        // .hidden?
    }

    toString () {
        let output = 'The ' + this.name;

        if (this.leader) {
            output += '\n\n    ruled by the ' + this.leader.toString();
        }

        if (this.court.length > 0) {
            output += '\n\n    persons at court:';

            for (let courtier of this.court) {
                output += '\n        The ' + courtier.toString();
            }
        }

        if (this.prison.length > 0) {
            output += '\n\n    incarcerated beings:';

            for (let prisoner of this.prison) {
                output += '\n        The ' + prisoner.name;
            }
        }

        if (this.treasury.length > 0) {
            output += '\n\n    in the vaults:';

            for (let treasure of this.treasury) {
                output += '\n        The ' + treasure;
            }
        }

        return output;
    }

    static somethingHere () {
        return Math.random() < 0.5;
    }
}

// Further ideas
// Daughter of the Archdragon
// The infamous Cyberspider 
// The Neocrux, Prize of the Seven Seas

module.exports = ScienceFantasy;

ScienceFantasy.test();
