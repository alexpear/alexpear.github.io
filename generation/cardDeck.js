'use strict';

const Util = require('../util/util.js');

class Card {
    constructor (name) {
        this.name = name;
        this.location = 'deck';
        // TODO - model the ordering within a deck.
    }

    toString () {
        return Util.capitalizedAllWords(this.name);
    }
}

class CardGame {
    constructor () {
        this.cards = this.cardNames().map(
            name => new Card(name)
        );
    }

    cardNames () {
        return `
princess of circuitry
princess admiral
hangar princess
prince of radio
electrosword
titanium breastplate
fine horse
abandoned castle
hoverbike
cybergibbon
helpful spirit
space trireme
robotic dragon
scholar of machines
        `.split('\n')
        .map(line => line.trim())
        .filter(line => line);
    }

    // returns object keyed by location
    cardsByLocation () {
        const summary = {
            deck: [],
            discard:[],
        };

        for (let card of this.cards) {
            if (! summary[card.location]) {
                summary[card.location] = [card];
            }
            else {
                summary[card.location].push(card);                
            }
        }

        return summary;
    }

    summaryString () {
        const summary = this.cardsByLocation();
        let outString = '';

        for (let loc in summary) {
            outString += loc + ':\n';

            for (let card of summary[loc]) {
                outString += card.toString() + '\n';
            }

            outString += '\n\n';
        }

        return outString;
    }

    dealTo (location = 'discard') {
        // select random card in deck
        let card;
        let i = Util.randomUpTo(this.cards.length - 1);
        let x = 0;

        while (x < this.cards.length) {
            let j = (i + x) % this.cards.length;

            if (this.cards[j].location === 'deck') {
                card = this.cards[j];
                break;
            }

            x++;
        }

        if (! card) {
            console.log('Cant deal because deck is empty.');
            return;
        }

        card.location = location;

        return card;
    }

    static run () {
        const game = new CardGame();
        game.dealTo();
        game.dealTo();
        console.log(game.summaryString());
    }
}

module.exports = CardGame;

CardGame.run();
