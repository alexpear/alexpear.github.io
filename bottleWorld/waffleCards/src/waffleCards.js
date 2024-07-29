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

    asHtml () {
        Util.logDebug({
            context: `Card.asHtml()`,
            name: this.props.name,
        });

        const SKIP_PROPS = [
            'name',
            'copiesInDeck',
        ];

        const TAG_PROPS = [
            'tags',
            'ruleTags',
        ];

        const passageArray = [];

        for (let prop of Card.PROPS) {
            if (! this.props[prop] || SKIP_PROPS.includes(prop)) {
                continue;
            }

            let value = this.props[prop];

            const propName = Util.capitalized(prop);
            let displayStr;

            if (TAG_PROPS.includes(prop)) {
                // TODO combine ruleTags with tags list, in italics or something.

                displayStr = value.split(' ')
                    .map(
                        tag => Util.capitalized(tag)
                    )
                    .join(' ');
            }
            // TODO group Attack info together somehow - perhaps at bottom?
            else if ('resist' === prop) {
                value = Object.entries(value)
                    .sort()
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
                displayStr = `${propName}: ${value}`;
            }
            else {
                displayStr = `${propName} ${value}`;
            }

            passageArray.push(`<p>${displayStr}</p>`)
        }

        //2042

        const passagesStr = passageArray.join('\n');

        // TODO in .css file, decrease spacing between <p>s.

        return `<div class="card">
      <p class="center">${this.props.name}</p>
      ${passagesStr}
    </div>`;
    }

    static random () {
        const validContexts = Object.keys(Card.Contexts).filter(
            contextName => Card.Contexts[contextName][0].name !== 'TODO'
        );

        const context = Util.randomOf(validContexts);

        // const context = Util.randomOf(
        //     Object.keys(Card.Contexts)
        // );

        // const key = Util.randomOf(
        //     Object.keys(Card.Contexts[context])
        // );

        return new Card(
            // Card.Contexts[context][key]
            Util.randomOf(
                Card.Contexts[context]
            )
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

        // Card.test();
        // Test if any card has a prop not on PROPS list.
        // Test for values that are not of expected type (number, string, resist obj).
    }
}

class CardSet {
    constructor (cards) {
        this.cards = cards || [];
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

    static fromRandomContext () {
        // LATER make this from a more sophisticated distribution of possible combinations of contexts.
        const set = new CardSet();

        for (let i = 0; i < 4; i++) {
            set.cards.push(Card.random());
        }

        return set;
    }

    static demo () {
        const set = CardSet.fromRandomContext();

        set.writeHtml();
    }
}

Card.init();
CardSet.demo();
