'use strict';

const Util = require('../util/util.js');

class ScienceFantasy {
    static randomWord () {
        const suffixType = Util.randomOf(ScienceFantasy.suffices);

        const prefix = Util.randomOf(ScienceFantasy.prefices);
        const suffixDraft = Util.randomOf(suffixType.content)[0];

        // Tidy up duplicate '-' characters.
        const suffix = prefix.endsWith('-') && suffixDraft.startsWith('-') ?
            suffixDraft.slice(1) :
            suffixDraft;

        return Util.capitalized(prefix + suffix);
    }

    // static processTemp () {
    //     const raw = `
    //     `;

    //     let better = raw.split('\n')
    //         .map(n => Util.capitalized(n.toLowerCase()))
    //         .join(`',\n'`);

    //     console.log(better);
    // }

    static test () {
        // for (let i = 0; i < 20; i++) {
            const name = ScienceFantasy.randomWord();
            const name2 = ScienceFantasy.randomWord();

            console.log(`\n  The ${name} of the ${name2}\n`);
        // }
    }
}

ScienceFantasy.prefices = [
    'bio',
    'cyber',
    'hyper',
    'necro',
    'thanato',
    'xeno',
    'exo',
    'archaeo',
    'aqua',
    'litho',
    'phyto',
    'botano',
    'myco',
    'ferro',
    'zoo',
    'alethe',
    'info',
    'micro',
    'nano',
    'giga',
    'electro',
    'chrono',
    'umbra',
    'photo',
    'pyro',
    'theo',
    'god',
    'logo',
    'q-',
    'cryo',
    'crpyto',
    // 'urso',
    'astro',
    'star',
    'aero',
    // 'ave',
    'diabolo',
    'hell',
    'mecha',
    'helio',
    'luna',
    'tenebro',
    'eco',
    'geo',
    'draco',
    'thermo',
    'arcano',
    'herpe',
    'thaumo',
    'opto',
    'chromato',
    // 'meteoro', //eh
    'chemo',
    'holo',
    'bello',
    'war',
    'osseo',
    'osteo',
    'flora',
    'phospho',
    'gyro',
    'pseudo',
    'gene',
    'myrmo',
    'psycho',
    'hypno',
    'gastro',
    'fluoro',
    'robo',
    'servo',
    'magna',
    'arachno',
    'chloro',
    'aesthe',
    'anesthe',
    'lethe',
    'noo',
    'pneuma',
    'econo',
    'anti',
    'lycanthro',
    'corona',
    'phobo',
    'ergo',
    'hiero',
    'impero',
    'herme', //eh
    'atheno',
    'ourano',
    'bacchu',
    'kino',
    'uni', //eh
    'demo',
    'fury',
    'Ur-',
    'engine-',
];

// class Suffix = {
//     constructor (text, weight) {
//     }
// }

ScienceFantasy.suffices = [
    {
        type: 'beast',
        content: [
            ['beast', 9],
            ['titan', 9],
            ['dragon', 9],
            ['spider', 9],
            ['wolf', 9],
            ['tiger', 9],
            ['serpent', 9],
            ['gorgon', 9],
            ['form', 9],
            ['morph', 9],
            ['spectre', 9],
            ['geist', 9],
            ['spirit', 9],
            ['phage', 9],
            ['horse', 9],
            ['bot', 9],
            ['demon', 9],
            ['devil', 9],
            ['angel', 9],
            ['seraph', 9],
            ['cherub', 9],
            ['mind', 9],
            ['brain', 9],
        ]
    },
    {
        type: 'person',
        content: [
            ['master', 9],
            ['sorcerer', 9],
            ['mancer', 9],
            ['mage', 9],
            ['seer', 9],
            ['wizard', 9],
            ['queen', 9],
            ['lord', 9],
            ['princess', 9],
            ['prince', 9],
            ['baron', 9],
            ['duke', 9],
            ['duchess', 9],
            ['pirate', 9],
            ['scion', 9],
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
            ['christ', 9],
            ['child', 9],
            // ['babe', 9],
            ['girl', 9],
            ['daughter', 9],
            ['kin', 9],
        ]
    },
    {
        type: 'location',
        content: [
            ['castle', 9],
            ['polis', 9],
            ['fortress', 9],
            ['fort', 9],
            ['bastion', 9],
            ['tower', 9],
            ['maze', 9],
            ['prison', 9],
            ['mountain', 9],
            ['sea', 9],
            ['sphere', 9],
            ['kingdom', 9],
            ['network', 9],
            ['planet', 9],
            ['system', 9],
            ['tomb', 9],
            ['vault', 9],
            ['shrine', 9],
            ['temple', 9],
            ['base', 9],

        ]
    },
    {
        type: 'item',
        content: [
            ['sword', 9],
            ['codex', 9],
            ['cannon', 9],
            ['-orb', 9],
            ['spear', 9],
            ['blade', 9],
            ['helm', 9],
            ['ship', 9],
            ['craft', 9],
            ['vessel', 9],
            ['furnace', 9],
            ['shield', 9],
            ['seed', 9],
            ['clade', 9],
            ['strain', 9],
            ['plague', 9],
            ['pox', 9],
            ['curse', 9],
            ['rage', 9],
            ['fury', 9],
            ['science', 9],
            ['lore', 9],
            ['data', 9],
            ['womb', 9],
            ['cortex', 9],
            ['soul', 9],
            ['mandate', 9],
        ]
    }
];

module.exports = ScienceFantasy;

ScienceFantasy.test();
