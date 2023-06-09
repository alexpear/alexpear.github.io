'use strict';

const Util = require('../util/util.js');

class Card {
    constructor (name) {
        this.name = name;
        this.location = 'deck';
        // TODO - model the ordering within a deck.
    }

    toString () {
        return this.name;
    }
}

class CardGame {
    constructor () {
        this.cards = this.cardNames().map(
            name => new Card(name)
        );
    }

    cardNames () {
        return [
            'Win',
            'Lose',
            'Banana'
        ];
    }

    // returns object keyed by location
    cardsByLocation () {
        const summary = {};

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
                outString += card.name + '\n';
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
        console.log(game.summaryString());
    }
}

module.exports = CardGame;

CardGame.run();
