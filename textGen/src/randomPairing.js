'use strict';

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

// By rough centrality to the story.
const LIST = [
    'Mycroft Canner',
    'Carlyle Foster',
    'JEDD Mason',
    'Sniper',
    'Cornel MASON',
    'Bryar Kosala',
    'Vivien Ancelet',
    'Bridger',
    'Hotaka Ando Mitsubishi',
    'Danaë de la Tremouïlle',
    'Achilles Mojave',
    'Ockham Saneer',
    'Thisbe Saneer',
    'Cato Weeksbooth',
    'King Isabel Carlos of Spain',
    'Duke Ganymede de la Tremouïlle',
    'Dominic Seneschal',
    'Madame',
    'Martin Guildbreaker',
    'Felix Faust',
    'Casimir Perry',
    'Julia Doria-Pamphili',
    'Ektor Papadelias',
    'Saladin',
    '9A',
    'Apollo Mojave',
    
    'Jin Im-Jin',
    'Charlemagne Guildbreaker',
    'Lieutenant Aimer (Patroclus)',
    'Croucher',
    'Mommadoll',
    'Lorelai "Cookie" Cook',
    'Gibraltar Chagatai',
    'Su-Hyeon Ancelet-Kosala',
    'Heloïse',
    'Eureka Weeksbooth',
    'Sidney Koons',
    'Robin Typer',
    'Kat Typer',
    'Lesley Juniper Saneer',
    'Blacklaw Tribune Natekari',
    'Aesop Quarriman',
    'Xiaoliu Guildbreaker',
    'Huxley Mojave',
    'Mushi Mojave',
    'Tully Mardi',

    'Darcy Sok',
    'Brody DeLupa',
    'Leonor Valentin',
    'Tsuneo Sugiyama',
    'Hiroaki Mitsubishi',
    'Masami Mitsubishi',
    'Toshi Mitsubishi',
    'Mycroft MASON',
    'Agrippa MASON',
    'Thomas Carlyle',
    'Aldrin Bester',
    'Voltaire Seldon',
    'Halley the Pillarcat',
    'Aeneus Mardi',
    'Chiasa Mardi',
    'Kohaku Mardi',
    'Luther Mardigras',
    'Mercer Mardi',
    'Seine Mardi',
    'the Reader',
    'Thomas Hobbes',
];

class Pairing extends TextGen {
    constructor () {
        super();

        this.a = this.randomEntry();
        this.b = this.randomEntry();
    }

    randomEntry () {
        // Weight of each entry in LIST is:
        // 1st entry: length
        // 2nd entry: length - 1
        // ...
        // last entry: 1

        // The last expression here is the sum of the 1st n terms in the sequence 1 + 2 + 3 + ...
        let roll = Math.random() * LIST.length * (LIST.length + 1) / 2;

        for (let i = 0; i < LIST.length; i++) {
            roll -= (LIST.length - i);

            if (roll <= 0) {
                return LIST[i];
            }
        }
    }

    static testRandomEntryMath () {
        for (let length = 2; length <= 10; length++) {
            let rollRange = length * (length + 1) / 2;

            for (let i = 0; i < length; i++) {
                rollRange -= (length - i);
            }

            if (rollRange !== 0) {
                Util.error({
                    rollRange,
                    length,
                });
            }
        }
    }

    toString () {
        return `A steamy encounter between ${this.a} & ${this.b}.`;
    }

    // Called by TextGen.outputHTML()
    output () {
        return this.toString();
    }

    static demo () {

    }

    static run () {
        const TIMES = 1;
        
        for (let i = 0; i < TIMES; i++) {
            const pair = new Pairing();
            console.log(pair.output());            
        }

        // Pairing.testRandomEntryMath();
    }
}

module.exports = Pairing;

Pairing.run();
