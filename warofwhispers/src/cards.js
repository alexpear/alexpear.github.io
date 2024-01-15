'use strict';

// Utility for reskins of the tabletop game A War of Whispers

const Util = require('../../util/util.js');

class Card {
    constructor (theme, animal1, animal2) {
        this.theme = theme;
        this.animal1 = animal1;
        this.animal2 = animal2;
    }

    html () {
        const td = Util.htmlElement('td');
        const cardDiv = Util.htmlElement('div', 'cardBody');
        td.appendChild(cardDiv);

        const stageImage = new Image();
        stageImage.src = this.imagePath();

        const stageDiv = Util.htmlElement('div', 'stage');

        // LATER make theme-agnostic
        if (['bear', 'horse'].includes(this.animal1)) {
            stageDiv.setAttribute('class', this.animal1 + ' stage');
        }

        stageDiv.appendChild(stageImage);
        cardDiv.appendChild(stageDiv);

        this.addRow(cardDiv, this.animal1);
        this.addRow(cardDiv, this.animal1, this.animal1);
        this.addRow(cardDiv, this.animal1, this.animal2);

        return td;
    }

    loyalty () {
        const td = Util.htmlElement('td');
        const cardDiv = Util.htmlElement('div', 'cardBody');
        td.appendChild(cardDiv);

        const stageImage = new Image();
        stageImage.src = this.imagePath();

        const stageDiv = Util.htmlElement('div', 'stage');

        // LATER make theme-agnostic
        if (['bear', 'horse'].includes(this.animal1)) {
            stageDiv.setAttribute('class', this.animal1 + ' stage');
        }

        stageDiv.appendChild(stageImage);
        cardDiv.appendChild(stageDiv);

        const topSpacer = Util.htmlElement('div', 'houseSpacer');
        cardDiv.appendChild(topSpacer);

        // LATER make theme-agnostic
        const fullName = this.fullHiveName(this.animal1);
        const words = fullName.split(' ');

        const textDiv = Util.htmlElement('div', 'nameDiv');
        textDiv.classList.add(this.animal1);
        cardDiv.appendChild(textDiv);

        for (let word of words) {
            this.addBigText(textDiv, word, this.animal1);
        }

        return td;
    }

    imagePath (animal) {
        animal = animal || this.animal1;

        if (this.theme === 'masseffect') {
            return this.imageME(animal);
        }

        return `media/${ this.animal2theme(animal) }.jpg`;
    }

    imageME (animal) {
        const MAP = {
            bear: 'krogan.jpg',
            eagle: 'alliance.png',
            elephant: 'geth.jpg',
            lion: 'council.png',
            horse: 'quarian.png',
        };

        return 'media/' + MAP[animal];
    }

    // NOTE - sometimes animal1 === animal2 here
    addRow (card, animal1, animal2) {
        const rowSpan = Util.htmlElement('span');

        this.addSquareIcon(rowSpan, animal1);

        if (animal2) {
            this.addSquareIcon(rowSpan, animal2);
        }

        const text = this.effects(animal1, animal2);
        const colonIndex = text.indexOf(':');
        let italicized;

        if (colonIndex === -1) {
            italicized = text;
        }
        else {
            const title = text.slice(0, colonIndex + 1);
            const effect = text.slice(colonIndex + 1);
            italicized = `<i>${title}</i>${effect}`;
        }

        rowSpan.appendChild(
            Util.pElement(italicized)
        );

        card.appendChild(rowSpan);
    }

    addSquareIcon (div, animal) {
        const image = new Image();
        image.src = this.imagePath(animal);

        const square = Util.htmlElement('div', 'square');
        square.appendChild(image);
        div.appendChild(square);
    }

    addBigText (card, text, animal) {
        const house = Util.htmlElement('div', 'textRow');

        const header = Util.htmlElement('p', 'bigText', text);

        house.appendChild(header);
        card.appendChild(house);
    }

    static animals () {
        return ['bear', 'eagle', 'elephant', 'lion', 'horse'];
    }

    animal2theme (animal) {
        if (this.theme === 'terraignota') {
            return this.animal2ti(animal);
        }
        else if (this.theme === 'masseffect') {
            return this.animal2me(animal);
        }
        else {
            return animal;
        }
    }

    animal2ti (animal) {
        const MAP = {
            bear: 'europe',
            eagle: 'humanist',
            elephant: 'cousin',
            lion: 'mitsubishi',
            horse: 'mason',
        };

        return MAP[animal];
    }

    fullHiveName (animal) {
        const MAP = {
            bear: 'European Union',
            eagle: 'Humanist Hive',
            elephant: 'Cousins Collective',
            lion: 'Mitsubishi Corporation',
            horse: 'Masonic Empire',
        };

        return MAP[animal];
    }

    animal2me (animal) {
        const MAP = {
            bear: 'Krogans',
            eagle: 'Systems Alliance',
            elephant: 'Geth',
            lion: 'Citadel Council',
            horse: 'Quarians',
        };

        return MAP[animal];
    }

    effects (animal1, animal2) {
        const EFFECTS = {
            terraignota: {
                Single: {
                    bear: 'After your attack, you may make an additional attack with any surviving troops.',
                    eagle: 'Move the active agent to any empty hive square & immediately take that square\'s action instead. Then proceed from after where it was.',
                    elephant: 'Add 1 troop to your attack.',
                    lion: 'Instead of using your current hive square action, use a hive square action controlled by one of your other agents.',
                    horse: 'Choose 2 locations controlled by the active hive. Move any number of troops between them.',
                },
                Double: {
                    bear: 'After your attack, kill ALL troops involved in that attack (on both sides).',
                    eagle: 'Your attack may target any empty enemy location.',
                    elephant: 'Add 3 troops to your attack.',
                    lion: 'Reinforce a Harbinger Knowledge location with 3 more troops of the controlling hive.',
                    horse: 'Rearrange any hive\'s troops within its controlled locations. (Do not abandon a location or exceed supply.)',
                },
                Combo: {
                    beareagle: 'Atë: Kill up to 3 troops in any 1 location.', // mercenaries
                    bearelephant: 'Red Crystal: Reinforce an empty location with 3 troops of the controlling hive.', // recruit
                    bearhorse: 'The Prince Speaks: Take all troops in any location (abandoning it) & move them to any number of adjacent locations controlled by that hive.', // disperse
                    bearlion: 'Peacewash: After your attack, for each enemy troop killed, add 1 troop of the active hive to any location the active hive controls.', // subjugate
                    eagleelephant: 'Missiles Launched: Choose 1 troop of the active hive. Kill up to 5 enemy troops in any adjacent locations.', // alchemist's fire // gorgons
                    eaglehorse: 'World Civil War: Your attack may target any location on the map.', // armada
                    eaglelion: 'Servicers: Add 1 troop to each location the active hive controls.', // populate
                    elephanthorse: 'Operation Baskerville: Reinforce an empty location with no Harbinger or Fortified Position by adding 4 troops of the controlling hive.', // uprising
                    elephantlion: 'World-Ringing River: Add up to 6 troops to the current attack from any location the active hive controls.', // reinforce
                    horselion: 'Antisleep: After performing an action with an agent, take the same action again.', // midnight oil
                },
            },

            masseffect: {
                Single: {
                    bear: 'After your attack, you may make an additional attack with any surviving units.',
                    // LATER make theme-agnostic
                    eagle: 'Move the active agent to any empty VIP square & immediately take that VIP\'s action instead. Then proceed from after where it was.',
                    elephant: 'Add 1 unit to your attack.',
                    lion: 'Instead of the current VIP\'s actions, use an action controlled by one of your other agents.',
                    horse: 'Choose 2 planets controlled by the active faction. Move any number of units between them.',
                },
                Double: {
                    bear: 'After your attack, kill ALL units involved in that attack (on both sides).',
                    eagle: 'Your attack may target any empty enemy planet.',
                    elephant: 'Add 3 units to your attack.',
                    lion: 'Add 3 friendly units to any 1 planet with a Prothean beacon.',
                    horse: 'Rearrange any faction\'s units within its controlled planets. (Do not abandon a planet or exceed supply.)',
                },
                Combo: {
                    beareagle: 'Atë: Kill up to 3 units in any 1 planet.', // mercenaries
                    bearelephant: 'Red Crystal: Add 3 friendly units to any empty planet(s).', // recruit
                    bearhorse: 'The Prince Speaks: Take all units in any planet (abandoning it) & move them to any number of adjacent planets controlled by that faction.', // disperse
                    bearlion: 'Peacewash: After your attack, for each enemy unit killed, add 1 unit of the active faction to any planet the active faction controls.', // subjugate
                    eagleelephant: 'Missiles Launched: Choose 1 unit of the active faction. Kill up to 5 enemy units in any adjacent planets.', // alchemist's fire // gorgons
                    eaglehorse: 'World Civil War: Your attack may target any planet on the map.', // armada
                    eaglelion: 'Servicers: Add 1 unit to each planet the active faction controls.', // populate
                    elephanthorse: 'Operation Baskerville: Add 4 friendly units to any empty planet that has no Harbinger Knowledge or Fortified Position.', // uprising
                    elephantlion: 'World-Ringing River: Add up to 6 units to the current attack from any planet the active faction controls.', // reinforce
                    horselion: 'Antisleep: After performing an action with an agent, take the same action again.', // midnight oil
                },
            },
        };

        /* Terminology for TI
        banner -> troop
        army -> battle group (unused)
        region -> location
        empire -> hive
        council position -> hive square

        for Mass Effect
        empire -> faction
        region -> planet (despite incorrect for citadel etc)
        banner -> unit
        army -> army (unused)
        agent -> agent
        council position -> faction VIP
        */

        const lines = EFFECTS[this.theme];

        if (animal2) {
            if (animal1 === animal2) {
                return lines.Double[animal1];
            }

            const alphabetized = [animal1, animal2].sort()
                .join('');

            return lines.Combo[alphabetized];
        }

        return lines.Single[animal1];
    }

    static createCards (theme) {
        theme = theme || 'terraignota';
        const table = document.getElementById('main');
        let row;
        let colNum = 99; // Must start >= row width.

        for (let animal1 of Card.animals()) {
            for (let animal2 of Card.animals()) {
                for (let repeat = 1; repeat <= 2; repeat++) {
                    if (animal1 === animal2) { continue; }

                    const card = new Card(theme, animal1, animal2);
                    const td = card.html();

                    if (colNum > 3) {
                        row = Util.htmlElement('tr');
                        table.appendChild(row);
                        colNum = 1;
                    }

                    row.appendChild(td);
                    colNum++;
                }
            }
        }

        // Also cards for facedown loyalties.
        for (let animal of Card.animals()) {
            for (let i = 1; i <= 4; i++) {
                const card = new Card(theme, animal);
                const td = card.loyalty(animal);

                if (colNum > 3) {
                    row = Util.htmlElement('tr');
                    table.appendChild(row);
                    colNum = 1;
                }

                row.appendChild(td);
                colNum++;
            }
        }
    }

    static run () {
        Card.createCards();
    }
}

Card.run();
