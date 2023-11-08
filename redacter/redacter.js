'use strict';

//

const Corpus = require('./corpus.js');
const Word = require('./word.js');

class Redacter {
	constructor () {
		this.documentStr = Corpus.randomDoc();
		this.parseDoc();
		this.startingWords();
		this.updateDisplay();
	}

	parseDoc () {
		this.words = [];
		this.dictionary = {};

		const rawWords = this.documentStr.split('\s');
		this.totalWords = rawWords.length;
		this.visibleWords = 0;

		for (let rawWord of rawWords) {
			rawWord = rawWord.toLowerCase();

			let wordObj = this.dictionary[rawWord];

			if (! wordObj) {
				wordObj = new Word(rawWord);
				this.dictionary[rawWord] = wordObj;
			}
			else {
				wordObj.appearances++;
			}
		}
	}

	startingWords () {
		for (let starter of Redacter.STARTING_WORDS) {
			const wordObj = this.dictionary[starter];
			
			wordObj.redacted = false;
			this.visibleWords += wordObj.appearances;
		}
	}

	unredact (wordObj) {
		if (wordObj.redacted) {
			wordObj.redacted = false;
			this.visibleWords += wordObj.appearances;
		}
	}

	updateDisplay () {
		const displayString = this.words.map(
			wordObj => wordObj.toString()
		)
		.join(' ');
		// TODO newlines, & perhaps other persistent formatting.

		// TODO init documentDisplay field.
		this.documentDisplay.innerHTML = displayString;
	}
}

Redacter.STARTING_WORDS = [
	'a',
	'aboard',
	'about',
	'above',
	'across',
	'after',
	'against',
	'along',
	'amid',
	'among',
	'an',
	'and',
	'are',
	'around',
	'as',
	'at',
	'because',
	'be',
	'been',
	'being',
	'before',
	'behind',
	'below',
	'beneath',
	'beside',
	'between',
	'beyond',
	'but',
	'by',
	'concerning',
	'considering',
	'despite',
	'down',
	'during',
	'except',
	'\'d',
	'had',
	'has',
	'\'ve',
	'have',
	'following',
	'for',
	'from',
	'if',
	'in',
	'inside',
	'into',
	'is',
	'it',
	'like',
	'minus',
	'near',
	'next',
	'of',
	'off',
	'on',
	'onto',
	'opposite',
	'or',
	'out',
	'outside',
	'over',
	'past',
	'per',
	'plus',
	'regarding',
	'round',
	'save',
	'since',
	'\'s',
	'than',
	'that',
	'the',
	'there',
	'they',
	'this',
	'through',
	'till',
	'to',
	'toward',
	'under',
	'underneath',
	'unlike',
	'until',
	'up',
	'upon',
	'use',
	'used',
	'uses',
	'using',
	'versus',
	'via',
	'was',
	'were',
	'which',
	'will',
	'\'ll',
	'with',
	'within',
	'without',
];
