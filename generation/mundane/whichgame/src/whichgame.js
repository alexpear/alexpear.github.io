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
            i'm going to the beach

            dutch blitz
            infiltraitors
            oh hell
            regicide (Playing cards game)
            texas hold em poker
            wuxia cards

            dominion
            netrunner
            star wars unlimited (Card game)
            lorcana
            magic cards

            agricola: creatures great & small
            backgammon
            chess
            codenames duet
            convert
            hive
            homeworlds
            magic: duels of the planeswalkers
            quarto
            six making

            azul
            azul stained glass
            betrayal at house on the hill
            cubitos
            forbidden desert
            innovation
            pangaea
            race for the galaxy
            root
            splendor
            tiny epic tactics
            war of whispers

            clone wars pandemic
            cosmic encounter
            creature comforts
            die crew
            flamecraft
            king of new york
            point salad
            risk godstorm
            risk legacy
            smallworlds
            sushi go

            coup rebellion
            eclipse
            resistance
            sub terra

            the captain is dead
            complicity

            camel up
            insider

            anomia
            bananagrams
            boggle
            concept
            drawful (Jackbox)
            exquisite corpse
            halo
            jenga
            loaded questions
            the mind
            quiplash (Jackbox)
            quixx
            perudo (Liar's dice)
            set
            sherlock holmes
            skull
            spaceteam
            superfight
            super smash brothers
            telestrations
            triple charades

            werewolf

            2 rooms & a boom
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

// Util.logDebug({
//     unshuffled: Suggestor.games(),
//     randomed: Util.shuffle(Suggestor.games()),
// });
