'use strict';

// Misheard words

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class Mispronounce extends TextGen {
    constructor () {
        super();

        const vowels = ['A', 'I', 'U'];
        const consonants = ['N', 'M', 'G', 'CH'];

        this.name = Util.randomOf(vowels) +
            Util.randomOf(consonants) +
            Util.randomOf(vowels) +
            Util.randomOf(consonants) +
            Util.randomOf(vowels) +
            Util.randomOf(consonants) +
            Util.randomOf(vowels) +
            Util.randomOf(consonants) +
            Util.randomOf(vowels) +
            Util.randomOf(consonants) +
            Util.randomOf(vowels);
    }

    output () {
        return Util.capitalized(this.name.toLowerCase());
    }
}

// $ node mispronounce.js 
// ANIMUNUCHUCHA

// $ node mispronounce.js 
// ANINUCHINUMA

module.exports = Mispronounce;
