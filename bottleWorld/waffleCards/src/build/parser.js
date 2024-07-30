'use strict';

// This file is run when building the Waffle Cards software.
// It writes cards.yml.js. Users should edit cards.yml as the source of truth.
// cards.yml.js will be a generated file that the software interacts with, & that browserify can bundle.

const Card = require('../waffleCards.js').Card;
const Util = require('../../../../util/util.js');
const fs = require('fs');
const path = require('path');
const Yaml = require('js-yaml');

class Parser {
    /* Background: I like how yaml is readable for nondevs, but it'll be tricky to make it compatible with browserify. For now, i'll just have my build script copy the .yml file to a string within a .js file.
    The user has to run the build script after editing. But that's true already because of browserify. */
    static writeYmlJsFile () {
        const ymlString = fs.readFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'cards.yml'),
            'utf8'
        );

        // Strip out initial comments, so the .yml.js file looks less confusing.
        const withoutComments = ymlString.split('contexts:').at(-1);

        fs.writeFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'cards.yml.js'),
            'module.exports = `' + withoutComments + '`;\n',
            'utf8'
        );
    }

    static convertWarband () {
        const ymlString = fs.readFileSync(
            path.join(__filename, '..', '..', '..', '..', '..', 'scifiWarband', 'data', 'config.yml'),
            'utf8'
        );

        const templates = Yaml.load(
            ymlString,
            { json: true } // json: true means duplicate keys in a mapping will override values rather than throwing an error.
        );

        const waffleCards = [];

        for (let factionName in templates.Halo) {
            const faction = templates.Halo[factionName];

            if (Util.isString(faction)) {
                continue;
            }

            const itemsObj = faction.Item;

            for (let [name, warbandItem] of Object.entries(itemsObj)) {
                const tags = [
                    'Item ' + factionName,
                    warbandItem.tags,
                    warbandItem.type,
                    warbandItem.group
                ].filter(
                    value => value
                )
                .join(' ');

                const range = Util.exists(warbandItem.preferredRange) ?
                    warbandItem.preferredRange :
                    10;

                const card = new Card({
                    name: warbandItem.name || name,
                    cost: warbandItem.cost || 0,
                    tags,
                    range,
                    damage: (warbandItem.damage || 0) * (warbandItem.rof || 1),
                    aoe: warbandItem.aoe || 1,
                    copiesInDeck: warbandItem.classic || 1,
                });

                if (warbandItem.color) {
                    // Could be useful for card visuals
                    card.color = warbandItem.color;
                }

                waffleCards.push(card);
            }

            const creaturesObj = faction.Creature;

            for (let [name, warbandCharacter] of Object.entries(creaturesObj)) {

                const tags = [
                    'Character ' + factionName,
                    warbandCharacter.tags,
                    warbandCharacter.type,
                    warbandCharacter.group
                ].filter(
                    value => value
                )
                .join(' ');

                let range = 10;
                if (Util.exists(warbandCharacter.preferredRange)) {
                    range = warbandCharacter.preferredRange;
                }
                else if (Util.exists(warbandCharacter.accuracy)) {
                    range = warbandCharacter.accuracy * 10;
                }

                const card = new Card({
                    name: warbandCharacter.name || name,
                    tags,
                    range,
                    durability: (warbandCharacter.durability || 0) / 5,
                    copiesInDeck: warbandCharacter.classic || 1,
                });

                const OPTIONAL_PROPS = ['cost', 'damage', 'gear', 'scale', 'size', 'source', 'transport'];

                for (let prop of OPTIONAL_PROPS) {
                    if (warbandCharacter[prop]) {
                        card.props[prop] = warbandCharacter[prop];
                    }
                }

                if (warbandCharacter.items) {
                    card.props.has = warbandCharacter.items[0].slice(5);
                }
                if (warbandCharacter.speed) {
                    card.props.speed = warbandCharacter.speed - 2;
                }

                waffleCards.push(card);
            }
        }

        const printList = waffleCards.map(
            card => card.props
        );

        Util.log(
            Yaml.dump(
                printList,
                {
                    indent: 4,
                },
            )
        );
    }

    static run () {
        Parser.writeYmlJsFile();
        Parser.convertWarband();
    }
}

Parser.run();
