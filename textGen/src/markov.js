'use strict';

// Markov chain that imitates 2 corpuses.

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

const FS = require('fs');
// const Readline = require('node:readline');

const CORPUS1 = '../../data/leviathan.txt';
const CORPUS2 = '../../data/eclipsephasecore.txt';

class Markov extends TextGen {
    constructor () {
        super();

        this.words = {};

/*      word1: [
            [ 'word2', 5 ]
        ]                       */

        this.train(CORPUS1);
        this.train(CORPUS2);
    }

    train (filePath) {
        const readStream = fs.createReadStream(filePath);
        const interface = Readline.createInterface({ input: readStream });

        // Pretend the document starts after the end of a hypothetical pre-document sentence.
        let lastWord = '.';

        interface.on('line', line => {
            line = line.trim();

            // Remove commas, ()s, '" quotes
            line = line.replaceAll(/[,()'"]/g, '');

            // If whole line is whitespace or empty, skip ahead.
            if (line.match(/^\s*$/)) {
                return;
            }

            // Everything whitespace isolated is a word
            // Preserve case.
            const wordsRaw = line.split('\s');

            const wordlikes = []; // Array(wordsRaw.length);

            for (let word of wordsRaw) {
                const lastChar = word.slice(-1);

                if (word.length >= 2 && Markov.WORDLIKE_SYMBOLS.includes(lastChar)) {
                    wordlikes.push(word.slice(0, -1)); // All of the word except the last character
                    wordlikes.push(lastChar);
                }
                else {
                    wordlikes.push(word);
                }
            }

            // TODO might need to take a first pass splitting all WORDLIKE_SYMBOL-including words in 2, then do another for loop. Because 1st word could be splittable & only its 1st part should connect to prevWord of last line.

            for (let i = 0; i < words.length; i++) {
                let word = words[i];

                // Treat these symbols as words even if not space-isolated: .:;?!- emdash
                const lastChar = word.slice(-1);

                if (word.length >= 2 && Markov.WORDLIKE_SYMBOLS.includes(lastChar) {
                    this.link(
                        word.slice(0, -1), // All of the word except the last character
                        lastChar
                    );

                    word = lastChar;
                    // Then link this symbol to the next word.
                }

                // this.link()
                // Okay maybe all link()s should be between something like prevWord & word?
            }

            // Reconnect line-spanning dashed words somehow
            // Okay to reconnect them with the dash still there

        });
    }

    link (word1, word2) {

    }

    output () {

    }

    wordAfter (prevWord) {
        
    }

    static run () {
        console.log(new Markov().output());
    }
}

Markov.WORDLIKE_SYMBOLS = '.:;?!-';

module.exports = Markov;

Markov.run();
