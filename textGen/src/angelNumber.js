// Pseudobinary numbering system mentioned in Unsong

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class AngelNumber extends TextGen { 
    constructor (number) { 
        super();

        this.number = number;
    }

    toString () {
        let output = '';
        let shrinkingNumber = this.number;

        for(let shifts = 0; shrinkingNumber > 0 && shifts < 26; shifts++) {
            if (shrinkingNumber % 2 === 1) {
                output = String.fromCharCode(65 + shifts) + output;
            }
        
            shrinkingNumber >>= 1; // Discard lowest bit by shifting right.
        }

        return output;
    }

    static demo () {
        for (let i = 0; i < 40; i++) {
            const num = new AngelNumber(i);
            console.log(`${num.toString()} is ${i}`);
        }
    }

    static run () {
        AngelNumber.demo();
    }
}

AngelNumber.run();
