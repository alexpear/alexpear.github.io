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

        if (['bear', 'horse'].includes(this.animal1)) {
            stageDiv.setAttribute('class', this.animal1 + ' stage');
        }

        stageDiv.appendChild(stageImage);
        cardDiv.appendChild(stageDiv);

        const topSpacer = Util.htmlElement('div', 'houseSpacer');
        cardDiv.appendChild(topSpacer);

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

        return `media/${ this.animal2ti(animal) }.jpg`;
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
        // house.classList.add(animal);

        const header = Util.htmlElement('p', 'bigText', text);

        house.appendChild(header);
        card.appendChild(house);
    }

    static animals () {
        return ['bear', 'eagle', 'elephant', 'lion', 'horse'];
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

    effects (animal1, animal2) {
        const EFFECTS = {
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
                lion: 'Add 3 friendly troops to any 1 Harbinger Knowledge location.',
                horse: 'Rearrange any hive\'s troops within its controlled locations. (Do not abandon a location or exceed supply.)',
            },
            Combo: {
                beareagle: 'Atë: Kill up to 3 troops in any 1 location.', // mercenaries
                bearelephant: 'Red Crystal: Add 3 friendly troops to any empty location(s).', // recruit
                bearhorse: 'The Prince Speaks: Take all troops in any location (abandoning it) & move them to any number of adjacent locations controlled by that hive.', // disperse
                bearlion: 'Peacewash: After your attack, for each enemy troop killed, add 1 troop of the active hive to any location the active hive controls.', // subjugate
                eagleelephant: 'Missiles Launched: Choose 1 troop of the active hive. Kill up to 5 enemy troops in any adjacent locations.', // alchemist's fire // gorgons
                eaglehorse: 'World Civil War: Your attack may target any location on the map.', // armada
                eaglelion: 'Servicers: Add a troop to each location the active hive controls.', // populate
                elephanthorse: 'Operation Baskerville: Add 4 friendly troops to any empty location that has no Harbinger Knowledge or Fortified Position.', // uprising
                elephantlion: 'World-Ringing River: Add up to 6 troops to the current attack from any location the active hive controls.', // reinforce
                horselion: 'Antisleep: After performing an action with an agent, take the same action again.', // midnight oil
            },
        };

        /* Terminology for TI
        banner -> troop
        army -> battle group (unused)
        region -> location
        empire -> hive
        council position -> hive square
        */

        if (animal2) {
            if (animal1 === animal2) {
                return EFFECTS.Double[animal1];
            }

            const alphabetized = [animal1, animal2].sort()
                .join('');

            return EFFECTS.Combo[alphabetized];
        }

        return EFFECTS.Single[animal1];
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
