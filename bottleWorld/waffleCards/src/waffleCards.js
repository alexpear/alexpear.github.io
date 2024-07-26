'use strict';

// Digital prototype of omni-genre card game system

const cardsString = require('../data/cards.yml.js');
const Util = require('../../../util/util.js');
const fs = require('fs');
const Yaml = require('js-yaml');

class Card {
    constructor (template) {
        Object.assign(this, template);
    }

    asHtml () {
        Util.logDebug({
            context: `Card.asHtml()`,
            name: this.name,
        });

        // TODO translate all props to html

        return ```<div class="card">
      <p class="center">${this.name}</p>
      <p>character human male child criminal biotech</p>
    </div>```;
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

        return ```<!DOCTYPE html>
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
</html>```;
    }

    // Writes a file cardSet.html that displays 1+ cards.
    writeHtml () {
        fs.writeFileSync(
            __dirname + '/cardSet.html',
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
