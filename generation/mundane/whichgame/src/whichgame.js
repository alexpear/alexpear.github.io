'use strict';

// Suggests which tabletop game to play, from a list.

const Util = require('../../../../util/util.js');

class Suggestor {
    constructor () {
        this.nameElement = document.getElementById('gameName');
        this.suggestions = Util.shuffle(Suggestor.games());
        this.index = 0;

        this.updateScreen();
    }

    updateScreen () {
        this.nameElement.innerHTML = this.suggestions[this.index];
    }

    next () {
        this.index++;

        if (this.index >= this.suggestions.length) {
            this.index = 0;
        }

        this.updateScreen();
    }

    static games () {

        const LIST = `
            regicide (Playing cards game)
            infiltraitors
            wuxia cards
            dominion
            netrunner
            star wars unlimited cards
            `;

        return LIST.split(/\n+/)
            .map(
                name => {
                    return name.trim()
                        .split(/\s+/)
                        .map(
                            word => Util.capitalized(word)
                        )
                        .join(' ');
                }
            )
            .filter(
                name => name // Remove whitespace entries.
            );
    }

    static run () {
        window.suggestor = new Suggestor();
    }
}

Suggestor.run();
