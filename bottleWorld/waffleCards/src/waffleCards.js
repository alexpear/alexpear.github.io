'use strict';

// Digital prototype of omni-genre card game system

const cardsString = require('../data/cards.yml.js');
const Util = require('../../../util/util.js');
const fs = require('fs');
const Yaml = require('js-yaml');

class Card {
    constructor (template) {
        this.props = {};

        Object.assign(this.props, template);
    }

    hasTag (tag) {
        const tags = this.props.tags.split(/\s+/)
            .concat(
                this.props?.ruleTags?.split(/\s+/) || []
            );

        return tags.includes(tag);
    }

    asHtml () {
        // Util.logDebug({
        //     context: `Card.asHtml()`,
        //     name: this.props.name,
        // });

        const SKIP_PROPS = [
            'name',
            'ruleTags',
            'copiesInDeck',
        ];

        const passageArray = [];

        // TODO extract some of this logic out into this.toString() if possible. Perhaps a func that returns a array of lines of text that will be displayed.
        for (let prop of Card.PROPS) {
            if (! this.props[prop] || SKIP_PROPS.includes(prop)) {
                // NOTE - We are filtering out both zero & undefined.
                continue;
            }

            let value = this.props[prop];

            const propName = Util.capitalized(prop);
            let displayStr;

            if ('tags' === prop) {
                displayStr = this.asTagStr(value);

                if (this.props.ruleTags) {
                    displayStr += ` <i>${this.asTagStr(this.props.ruleTags)}</i>`;
                }
            }
            // LATER group Attack info together somehow - perhaps at bottom?
            else if ('resist' === prop) {
                value = Object.entries(value)
                    .sort()
                    .filter(
                        pair => pair[1] !== 0
                    )
                    .map(
                        pair => `${Util.capitalized(pair[0])} ${pair[1]}`
                    )
                    .join(', ');

                displayStr = `${propName} ${value}`;
            }
            else if (['text', 'attackName'].includes(prop)) {
                displayStr = `${value}`;
            }
            else if ('context' === prop) {
                // LATER display context at bottom
                displayStr = `${propName}: ${Util.fromCamelCase(value)}`;
            }
            else {
                displayStr = `${propName} ${value}`;
            }

            passageArray.push(`<p>${displayStr}</p>`)
        }

        const passagesStr = passageArray.join('\n      ');

        return `<div class="card">
      <p class="center">${this.props.name}</p>
      ${passagesStr}
    </div>`;
    }

    asTagStr (strFromYml) {
        return strFromYml.split(/\s+/)
            .map(
                tag => Util.capitalized(tag)
            )
            .join(' ');
    }

    toString () {
        return Yaml.dump(
            this.props,
            {
                sortKeys: true,
                indent: 4,
            },
        );
    }

    print () {
        console.log(this.toString());
    }

    // TODO operate on a in-memory list of contexts so we dont have to recompute it every time.
    // contextArray is the list of cards within a context.
    static random (cardList) {
        cardList = cardList || Util.randomOf(
            Object.values(Card.Contexts)
                .filter(
                    array => array[0].name !== 'TODO'
                )
        );

        return new Card(
            Util.randomOf(cardList)
        );
    }

    static init () {
        Card.Contexts = Yaml.load(
            cardsString,
            { json: true } // json: true means duplicate keys in a mapping will override values rather than throwing an error.
        );

        for (let contextName in Card.Contexts) {
            const cards = Card.Contexts[contextName];

            for (let card of cards) {
                card.context = contextName;

                if (card.tags) {
                    card.tags = card.tags.toLowerCase();
                }
                if (card.ruleTags) {
                    card.ruleTags = card.ruleTags.toLowerCase();
                }
            }
        }

        // These are displayed in this order on the card:
        Card.PROPS = [
            'name',
            // LATER could put a whole obj here describing 'name', how to render it, what type it expects, abbreviation, etc.
            'cost',
            'tags',
            'ruleTags',

            // Attack props
            'attackName',
            'range',
            'accuracy', // Likely unused
            'damage',

            // Numbers:
            'agility',
            'durability',
            'focus',
            'knowledge',
            'magic',
            'observation',
            'size',
            'social',
            'speed',
            'stealth',

            'resist',
            'text',
            'context',

            // Not visually rendered on card:
            'copiesInDeck',
        ];

        // LATER
        // Card.test();
        // Test if any card has a prop not on PROPS list.
        // Test for values that are not of expected type (number, string, resist obj).
    }

    static printSorted () {
        Util.log(
            Yaml.dump(
                Card.sortedBy('cost')
            )
        );
    }

    static sortedBy (prop) {
        return Card.all().sort(
            (a, b) => (a[prop] || 0) - (b[prop] || 0)
        );
    }

    static all () {
        return Util.flatten(
            Object.values(Card.Contexts)
        )
        .filter(
            card => ! card.meta
        );
    }
}

class CardSet {
    constructor (contextName) {
        this.cards = [];

        const context = Card.Contexts[contextName];

        if (context[0].meta) {
            const names = context[0]?.pairWith
                ?.split(/\s+/)
                || [];

            // The list of all cards that could be drawn for this CardSet.
            this.deck = context.slice(1);

            for (let name of names) {
                let otherContext = Card.Contexts[name];

                if (otherContext[0].meta) {
                    otherContext = otherContext.slice(0);
                }

                this.deck = this.deck.concat(otherContext);
            }
        }
        else {
            this.deck = context;
        }

        this.dealCharacter();

        // LATER avoid 2 of the same Unique card
        // LATER pay attention to .copiesInDeck prop
    }

    asHtml () {
        const cardsAsHtml = this.cards.map(
            c => c.asHtml()
        )
        .join('\n    ');

        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Waffle Cards - Deal</title>
  <link href="cardSet.css" rel="stylesheet" />
</head>

<body>
  <div id="header">
    <a class="linkbutton" href="../../..">
      <span>Home</span>
    </a>
  </div>

  <h1>Stack:</h1>

  <div class="cardStack">
    ${cardsAsHtml}
  </div>
</body>
</html>`;
    }

    // Writes a file cardSet.html that displays 1+ cards.
    writeHtml () {
        fs.writeFileSync(
            __dirname + '/../cardSet.html',
            this.asHtml(),
            'utf8'
        );
    }

    deckSubset (criteria) {
        return this.deck.filter(
            card => {
                for (let [prop, value] of Object.entries(criteria)) {

                    if (prop.toLowerCase().startsWith('tag')) {
                        const requiredTags = value.split(/\s+/);

                        const hasTags = requiredTags.every(
                            tag => card.prop.tags.includes(tag)
                        );

                        if (! hasTags) {
                            return false;
                        }
                    }
                    else {
                        if (card.props[prop] !== value) {
                            return false;
                        }
                    }
                }

                return true;
            }
        );
    }

    dealCharacter () {
        if (! this.deck) {
            Util.throw({
                cards: this.cards
            });
        }

        for (let i = 0; i < 6; i++) {
            const card = new Card(
                Util.randomOf(this.deck)
            );

            this.cards.push(card);

            if (card.hasTag('character')) {
                break;
            }
        }
    }

    // TODO - func that returns 1 character card & X other cards

    static fromRandomContext () {
        const [contextName, context] = Util.randomOf(
            Object.entries(Card.Contexts)
                .filter(
                    pair => ! pair[0].startsWith('Generic')
                )
        );

        return new CardSet(contextName);
    }

    static fromRandomContextWeighted () {
        const card = Util.randomOf(
            Card.all()
        );

        return new CardSet(card.context);
    }

    static demo () {
        // const set = CardSet.fromRandomContext();
        const set = CardSet.fromRandomContextWeighted();

        set.writeHtml();
    }
}

module.exports = { Card, CardSet };

Card.init();
// Card.printSorted();
CardSet.demo();
