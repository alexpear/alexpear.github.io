'use strict';

// Markov chain that imitates 2 corpuses.

const TextGen = require('../textGen.js');
const Util = require('../../../util/util.js');

const FS = require('fs');
const Readline = require('node:readline');

const CORPUS1 = '../../../data/janeausten.txt';
const CORPUS2 = '../../../data/leviathan.txt';
// const CORPUS2 = '../../../data/eclipsephasecore.txt';

class Markov extends TextGen {
    static async new () {
        const chain = new Markov();

        await chain.train(CORPUS1);
        await chain.train(CORPUS2);

        // Util.logDebug({
        //     words: chain.words,
        // });

        // console.log(JSON.stringify(chain.words));

        return chain;
    }

    constructor () {
        super();

        this.currentTrainingCorpus = 0;

        // Pretend the document starts after the end of a hypothetical pre-document sentence.
        this.prevWords = [ '.', '.', ];
        this.ngrams = {
            '. .': {
                // '.': {
                //     occurrences: 1,
                //     corpus: -1,
                // },
            },
        };

/*      bigram model
        foo: {
            bar: 5,
            baz: 1
        }                       */

/*      trigram model would be
        { 'The best': { 'among': { occurrences: 2, corpus: 1, }, }, }                    */
    }

    async train (filePath) {
        this.currentTrainingCorpus++;

        const readStream = FS.createReadStream(filePath);
        const readInterface = Readline.createInterface({ input: readStream });

        await this.train3gram(readInterface);
    }

    async train3gram (readInterface) {
        for await (let line of readInterface) {
            // Util.logDebug({
            //     context: `.train()`,
            //     line,
            // });

            line = line.trim();

            // Remove commas, ()s, '" quotes
            line = line.replaceAll(/[,()'’"“”]/g, '');

            // If whole line is whitespace or empty, skip ahead.
            if (line.match(/^\s*$/)) {
                continue;
            }

            // Everything whitespace-isolated is a word
            // Preserve case. Yes this will treat 'and' differently from 'And' (middle vs beginning of sentences).
            const words = line.split(/\s+/);

            for (let i = 0; i < words.length; i++) {
                let word = words[i];

                // Treat these symbols as words even if not space-isolated: .:;?!- emdash
                const lastChar = word.slice(-1);

                if (word.length >= 2 && Markov.WORDLIKE_SYMBOLS.includes(lastChar)) {

                    const leftPart = word.slice(0, -1); // All of the word except the last symbol.

                    this.hear3gram(leftPart);
                    this.hear3gram(lastChar);
                }
                else {
                    this.hear3gram(word);
                }

                // LATER Reconnect line-spanning dashed words somehow
                // Okay to reconnect them with the dash still there
                // if (i === words.length - 1 && Markov.DASHES.includes(lastChar)) {

                // }
            }
        }
    }

    async train2gram (filePath) {
        const readStream = FS.createReadStream(filePath);
        const readInterface = Readline.createInterface({ input: readStream });

        // Pretend the document starts after the end of a hypothetical pre-document sentence.
        this.setPrevWord('.');

        for await (let line of readInterface) {
            // Util.logDebug({
            //     context: `.train()`,
            //     line,
            // });

            line = line.trim();

            // Remove commas, ()s, '" quotes
            line = line.replaceAll(/[,()'’"“”]/g, '');

            // If whole line is whitespace or empty, skip ahead.
            if (line.match(/^\s*$/)) {
                continue;
            }

            // Everything whitespace-isolated is a word
            // Preserve case. Yes this will treat 'and' differently from 'And' (middle vs beginning of sentences).
            const words = line.split(/\s+/);

            for (let i = 0; i < words.length; i++) {
                let word = words[i];

                // Treat these symbols as words even if not space-isolated: .:;?!- emdash
                const lastChar = word.slice(-1);

                if (word.length >= 2 && Markov.WORDLIKE_SYMBOLS.includes(lastChar)) {

                    const leftPart = word.slice(0, -1); // All of the word except the last symbol.

                    this.hear(leftPart);
                    this.hear(lastChar);
                }
                else {
                    this.hear(word);
                }

                // LATER Reconnect line-spanning dashed words somehow
                // Okay to reconnect them with the dash still there
                // if (i === words.length - 1 && Markov.DASHES.includes(lastChar)) {

                // }
            }
        }
    }

    hear3gram (nextWord) {
        const lastPhrase = this.prevWords.join(' ');

        // Util.logDebug({
        //     context: `.hear3gram()`,
        //     nextWord,
        //     lastPhrase,
        //     prevWords: this.prevWords,
        //     thisNgramsLastPhrase: this.ngrams[lastPhrase],
        //     ngrams: this.ngrams,
        // });

        if (this.ngrams[lastPhrase]) {
            if (this.ngrams[lastPhrase][nextWord]) {
                // A familiar situation.
                const situation = this.ngrams[lastPhrase][nextWord];
                situation.occurrences += 1;
    
                // -1 is for words that appear in multiple corpuses.
                if (! [this.currentTrainingCorpus, -1].includes(situation.corpus)) {
                    situation.corpus = -1;
                }
            }
            else {
                this.ngrams[lastPhrase][nextWord] = {
                    occurrences: 1,
                    corpus: this.currentTrainingCorpus,
                };
            }
        }
        else {
            this.ngrams[lastPhrase] = {
                [nextWord]: {
                    occurrences: 1,
                    corpus: this.currentTrainingCorpus,
                },
            };
        }

        this.prevWords = [ this.prevWords.at(-1), nextWord ];
    }

    hear2gram (nextWord) {
        // Util.logDebug({
        //     context: `hear()`,
        //     nextWord,
        //     prevWord: this.prevWord,
        // });

        if (this.words[this.prevWord][nextWord]) {
            this.words[this.prevWord][nextWord] += 1;
        }
        else {
            this.words[this.prevWord][nextWord] = 1;
        }

        this.setPrevWord(nextWord);
    }

    setPrevWord2Gram (word) {
        this.prevWord = word;

        if (! this.words[word]) {
            this.words[word] = {};
        }
    }

    output () {
        let words = ['.', '.',];

        this.lastOutputCorpus = 0;

        while (words.length <= 1000) {
            // TODO Standardize output length. If it is long currently, make '.' more likely based on the length, as a param to wordAfter().

            const nextWord = this.wordAfter( words.slice(-2) ); // 3grams

            words.push(nextWord);

            if (nextWord === '.') { break; }
        }

        // LATER adjust spacing before wordlike symbols.

        // slice() removes the starting '.'s
        let text = words.slice(2).join(' ');

        if (text.endsWith(' .')) {
            text = text.slice(0, -2) + '.';
        }

        return text;
    }

    output2gram () {
        let words = ['.'];

        while (words.length <= 1000) {
            const nextWord = this.wordAfter2gram(words.slice(-1));

            words.push(nextWord);

            if (nextWord === '.') { break; }
        }

        // LATER adjust spacing before wordlike symbols.
        // slice(1) removes the starting '.'
        return words.slice(1).join(' ');
    }

    wordAfter (prevWords) {
        const completionObj = this.ngrams[prevWords.join(' ')];

        // Util.logDebug({
        //     context: `.wordAfter()`,
        //     prevWords,
        //     completionObj,
        //     // ngrams: this.ngrams,
        // });

        const candidates = Object.keys(completionObj);

        if (! completionObj) {
            Util.error({
                message: `No completion found for words: ${prevWords.join(' ')}`,
                prevWords,
                ngrams: this.ngrams,
            });
        }

        // candidate: weight
        const weights = {};
        let totalWeight = 0;

        for (let candidate in completionObj) {
            weights[candidate] = completionObj[candidate].occurrences;

            if ( ! [this.lastOutputCorpus, -1].includes(completionObj[candidate].corpus) ) {
                // If this word is unique to a corpus distinct from the last output corpus,
                // Encourages output to switch corpuses often.
                weights[candidate] *= 2;
            }

            totalWeight += weights[candidate];
        }

        let roll = Math.random() * totalWeight;

        let start = Util.randomUpTo( candidates.length - 1 );

        for (let i = 0; i < candidates.length; i++) {
            // Start on random candidate, loop around
            const candidate = candidates[(start + i) % candidates.length];

            roll -= weights[candidate];

            if (roll <= 0) {
                // -1 means the word appears in multiple corpuses.
                const newCorpus = completionObj[candidate].corpus;
                if (newCorpus > 0) {
                    this.lastOutputCorpus = newCorpus;
                }

                return candidate;
            }
        }

        Util.error({
            message: `Should be impossible to be here after this for() loop.`,
            prevWord,
            situation,
            roll,
            start,
            candidates,
        });
    }

    wordAfter2gram (prevWord) {
        // Util.logDebug({
        //     prevWord,
        //     situation: this.words[prevWord],
        // });

        const situation = this.words[prevWord];
        const candidates = Object.keys(situation);

        const totalWeight = Util.sum(Object.values(situation));
        let roll = Math.random() * totalWeight;

        let start = Util.randomUpTo(candidates.length - 1);

        for (let i = 0; i < candidates.length; i++) {
            // Start on random candidate, loop around
            const candidate = candidates[(start + i) % candidates.length];

            roll -= situation[candidate];

            if (roll <= 0) {
                return candidate;
            }
        }

        Util.error({
            message: `Should be impossible to be here after this for() loop.`,
            prevWord,
            situation,
            roll,
            start,
            candidates,
        });
    }

    static async run () {
        const chain = await Markov.new();

        for (let i = 0; i < 20; i++) {
            console.log(chain.output() + '\n');
        }
    }
}

Markov.WORDLIKE_SYMBOLS = '.:;?!-';

module.exports = Markov;

Markov.run();
