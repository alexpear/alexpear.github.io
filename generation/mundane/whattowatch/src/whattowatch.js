'use strict';

// Suggests what to watch.

const Util = require('../../../../util/util.js');

class Suggestor {
    constructor () {
        this.adviceElement = document.getElementById('advice');
        this.randomizeAdvice();
    }

    updateScreen () {
        this.adviceElement.innerHTML = this.advice;
    }

    randomizeAdvice () {
        const type = Util.randomOf([
            'film',
            'series',
        ]);

        const percent = Util.randomUpTo(10) * 10;

        const letter = Util.randomOf(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('')
        );

        this.advice = `A ${type} which is ${percent}% thru the ${letter} section.`;

        this.updateScreen();
    }

    static run () {
        window.suggestor = new Suggestor();
    }
}

Suggestor.run();
