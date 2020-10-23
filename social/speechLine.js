'use strict';

// Conversation genregen

const Util = require('../util/util.js');

class SpeechLine {
    constructor (input) {
        if (Util.isArray(input)) {
            this.words = input;
        }
        else if (Util.isString(input)) {
            this.words = input.split();

            if (this.words.length >= 4) {
                this.words[3] = Number(this.words[3]);  // Store opinion adverb numbers as numbers.
            }
        }
        else {
            this.words = [];
        }
    }

    getSubject () {
        // Later probably change to obj model instead of array
        const sub = this.words[0];

        if (! sub) {
            throw new Error(`no subject in line: ${sub}`);
        }

        return sub;
    }

    getVerb () {
        return this.words[1];
    }

    getObject () { 
        return this.words[2];
    }

    getAdverb () {
        return this.words[3];
    }

    renderVerb (personTense = 3) {
        if (this.getVerb() !== 'opinion') {
            // Most verbs are not yet supported. Later.
            return this.getVerb();
        }

        const adverb = this.getAdverb();
        let output = '';

        if (adverb > 80) {
            output = 'love';
        }
        else if (adverb > 50) {
            output = 'enjoy';
        }
        else if (adverb > 10) {
            output = 'like';            
        }
        else if (adverb > 5) {
            output = 'appreciate';
        }
        else if (adverb > -5) {
            output = 'ignore';
        }
        else if (adverb > -20) {
            output = 'tolerate';
        }
        else if (adverb > -60) {
            output = 'dislike';
        }
        else if (adverb > -70) {
            output = 'despise';
        }
        else if (adverb > -90) {
            output = 'hate';
        }
        else {
            output = 'loathe';
        }

        // Third person (present tense) conjugation.
        if (personTense === 3) {
            return output + 's';
        }

        return output;
    }

    // returns string[]
    static example () {
        // 'I love the Weird Sisters,' said Malfoy.
        // SpeechLines dont use pronouns. Everyone talks about themself and others in the third person.
        return new SpeechLine('malfoy opinion weirdSisters 99');
    }

    // Experimental format
    static examplePojo () {
        return {
            subject: 'malfoy',
            relation: 'opinion',
            object: 'weirdSisters',
            adverb: 99
        };
    }
}

module.exports = SpeechLine;


// malfoy likes weirdSisters
// ron likes weirdSisters
// harry dislikes weirdSisters
// or
// malfoy opinion weirdSisters 99
// harry opinion weirdSisters -4
// ron opinion weirdSisters ?
// where '?' is a word meaning 'please fill in the blank'

// or could potentially store names as alphanumeric ids
// and we could have a worldwide hashmap of mentionable nouns. similar to WorldState.thingById() etc

