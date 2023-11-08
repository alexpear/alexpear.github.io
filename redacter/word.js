'use strict';

//

class Word {
	constructor (str) {
		this.str = str;
		this.redacted = true;
		this.appearances = 1;
		// this.stem = this.findStem(); TODO
	}

	toString () {
		return this.redacted ?
			this.redactedForm() :
			this.str;
	}

	redactedForm () {
		return '█'.repeat(this.str.length);
	}
}

module.exports = Word;
