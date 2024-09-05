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
        this.divColor(stageDiv);

        stageDiv.appendChild(stageImage);
        cardDiv.appendChild(stageDiv);

        this.addRow(cardDiv, this.animal1);
        this.addRow(cardDiv, this.animal1, this.animal1);
        this.addRow(cardDiv, this.animal1, this.animal2);

        return td;
    }

    divColor (div, animal) {
        animal = animal || this.animal1;

        if (this.theme === 'terraignota') {
            if (['elephant', 'lion', 'eagle'].includes(animal)) {
                // These have white backgrounds.
                return;
            }
        }

        div.classList.add(animal);
    }

    loyalty () {
        const td = Util.htmlElement('td');
        const cardDiv = Util.htmlElement('div', 'cardBody');
        td.appendChild(cardDiv);

        const stageImage = new Image();
        stageImage.src = this.imagePath();

        const stageDiv = Util.htmlElement('div', 'stage');
        this.divColor(stageDiv);

        stageDiv.appendChild(stageImage);
        cardDiv.appendChild(stageDiv);

        const topSpacer = Util.htmlElement('div', 'houseSpacer');
        cardDiv.appendChild(topSpacer);

        const fullName = this.fullEmpireName(this.animal1);
        const words = fullName.split(' ');

        const textDiv = Util.htmlElement('div', 'nameDiv');
        textDiv.classList.add(this.animal1);
        cardDiv.appendChild(textDiv);

        for (let word of words) {
            this.addBigText(textDiv, word, this.animal1);
        }

        return td;
    }

    // HTML element for a wildcard.
    wild () {
        const td = Util.htmlElement('td');
        const cardDiv = Util.htmlElement('div', 'cardBody');
        cardDiv.setAttribute('class', 'striped');

        td.appendChild(cardDiv);

        const ANIMALS_ORDERED = ['elephant', 'bear', 'eagle', 'horse', 'lion'];

        for (const animal of ANIMALS_ORDERED) {
            const icon = new Image();
            icon.src = this.imagePath(animal);

            const iconDiv = Util.htmlElement('div', 'evenStripe');
            this.divColor(iconDiv, animal);

            iconDiv.appendChild(icon);
            cardDiv.appendChild(iconDiv);
        }

        return td;
    }

    darkAlliance (askToControl) {
        const td = Util.htmlElement('td');
        const cardDiv = Util.htmlElement('div', 'cardBody');
        td.appendChild(cardDiv);

        const stageImage = new Image();
        stageImage.src = this.imagePath();

        const stageDiv = Util.htmlElement('div', 'stage');
        this.divColor(stageDiv);

        stageDiv.appendChild(stageImage);
        cardDiv.appendChild(stageDiv);

        const titleDiv = Util.htmlElement('div');
        const title = Util.htmlElement('p', 'center', 'Dark Alliance');
        titleDiv.appendChild(title);
        cardDiv.appendChild(titleDiv);

        const timingDiv = Util.htmlElement('div');
        const timingText = Util.htmlElement(
            'p',
            'center',
            "You may play this at the start of an opponent's action."
        );
        timingDiv.appendChild(timingText);
        cardDiv.appendChild(timingDiv);

        const offerString = askToControl ?
            'Ask to control their action.' :
            'Offer to increase their current attack by +4 troops.';
        const offerDiv = Util.htmlElement('div');
        const offerText = Util.htmlElement(
            'p',
            'center',
            offerString,
        );
        offerDiv.appendChild(offerText);
        cardDiv.appendChild(offerDiv);

        const effectString = this.effects(
            this.animal1,
            askToControl ?
                'control' :
                'plus4',
        );
        const effectDiv = Util.htmlElement('div');
        const effectText = Util.htmlElement(
            'p',
            'center',
            effectString,
        );
        effectDiv.appendChild(effectText);
        cardDiv.appendChild(effectDiv);

        const declineDiv = Util.htmlElement('div');
        const declineText = Util.htmlElement(
            'p',
            'center',
            "If they don't, return this card to your hand.",
        );
        declineDiv.appendChild(declineText);
        cardDiv.appendChild(declineDiv);

        return td;
    }

    imagePath (animal) {
        animal = animal || this.animal1;

        if (this.theme === 'masseffect') {
            return this.imageME(animal);
        }
        // LATER if i want to add a 3rd theme, i should make this func more robust.

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

        return 'media/masseffect/' + MAP[animal];
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
        this.divColor(square, animal);

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

    fullEmpireName (animal) {
        if (this.theme === 'terraignota') {
            return this.fullHiveName(animal);
        }
        else if (this.theme === 'masseffect') {
            return this.fullFactionNameME(animal);
        }
        else {
            throw new Error({
                theme: this.theme,
                animal,
            });
        }
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

    fullFactionNameME (animal) {
        const MAP = {
            bear: 'Krogan Clans',
            eagle: 'Systems Alliance',
            elephant: 'Geth Network',
            lion: 'Citadel Council',
            horse: 'Quarian Conclave',
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
                    eagle: 'Move the active agent to any empty Hive square & immediately take that square\'s action instead. Then proceed from after where it was.',
                    elephant: 'Add 1 troop to your attack.',
                    lion: 'Instead of using your current Hive square action, use a Hive square action controlled by one of your other agents.',
                    horse: 'Choose 2 locations controlled by the active Hive. Move any number of troops between them. (Don\'t abandon a conquered region.)',
                },
                Double: {
                    bear: 'After your attack, kill ALL troops involved in that attack (on both sides).',
                    eagle: 'Your attack may target any empty enemy location.',
                    elephant: 'Add 3 troops to your attack.',
                    lion: 'Reinforce a Harbinger Knowledge location with 3 more troops of the controlling Hive.',
                    horse: 'Rearrange any Hive\'s troops within its controlled locations. (Do not abandon a location or exceed supply.)',
                },
                Combo: {
                    beareagle: 'Atë: Kill up to 3 troops in any 1 location.', // mercenaries
                    bearelephant: 'Red Crystal: Reinforce an empty location with 3 troops of the controlling Hive.', // recruit
                    bearhorse: 'The Prince Speaks: Take all troops in any location (abandoning it) & move them to any number of adjacent locations controlled by that Hive.', // disperse
                    bearlion: 'Peacewash: After your attack, for each enemy troop killed, add 1 troop of the active Hive to any location the active Hive controls.', // subjugate
                    eagleelephant: 'Missiles Launched: Choose 1 troop of the active Hive. Kill up to 5 enemy troops in any adjacent locations.', // alchemist's fire // gorgons
                    eaglehorse: 'World Civil War: Your attack may target any location on the map.', // armada
                    eaglelion: 'Servicers: Add 1 troop to each location the active Hive controls.', // populate // myrmidons
                    elephanthorse: 'Operation Baskerville: Reinforce an empty location with no Harbinger or Fortified Position by adding 4 troops of the controlling Hive.', // uprising
                    elephantlion: 'World-Ringing River: Add up to 6 troops to the current attack from any locations the active Hive controls.', // reinforce
                    horselion: 'Antisleep: After performing an action with an agent, take the same action again.', // midnight oil
                },
                DarkAlliance: {
                    bear: {
                        control: 'you must remove 1 of your agents from the board',
                        plus4: 'they must remove 1 of their agents from the board',
                    },
                    eagle: {
                        control: 'they may draw 2 cards from any pile(s)',
                        plus4: 'you may draw 2 cards from any pile(s)',
                    },
                    elephant: {
                        control: 'they may reinforce any location with 4 more troops',
                        plus4: 'you may reinforce any location with 4 more troops',
                    },
                    lion: {
                        control: 'you must turn 1 of your loyalty cards face up',
                        plus4: 'they must turn 1 of their loyalty cards face up',
                    },
                    horse: {
                        control: 'they may swap 1 of their deployed agents with 1 of yours',
                        plus4: 'you may swap 1 of your deployed agents with 1 of theirs',
                    },
                },
            },

            masseffect: {
                Single: {
                    bear: 'After your attack, you may make an additional attack with any surviving units.',
                    eagle: 'Move the active agent to any empty VIP space & immediately take that VIP\'s action instead. Then proceed from after where it was.',
                    elephant: 'Add 1 unit to your attack.',
                    lion: 'Instead of the current VIP\'s actions, use an action controlled by one of your other agents.',
                    horse: 'Choose 2 planets controlled by the active faction. Move any number of units between them.',
                },
                Double: {
                    bear: 'After your attack, kill ALL units involved in that attack (on both sides).',
                    eagle: 'Your attack may target any empty enemy planet.',
                    elephant: 'Add 3 units to your attack.',
                    lion: 'Reinforce a Prothean artifact planet by adding 3 units of the controlling faction.',
                    horse: 'Rearrange any faction\'s units within its controlled planets. (Do not abandon a planet or exceed supply.)',
                },
                Combo: {
                    beareagle: 'Blue Suns: Kill up to 3 units on any 1 planet.', // mercenaries
                    bearelephant: 'Stealth Troops: Reinforce an empty planet with 3 units of the controlling faction.', // recruit
                    bearhorse: 'Quarantine: Take all units on any planet (abandoning it) & move them to any number of adjacent planets controlled by that faction.', // disperse
                    bearlion: 'Control: After your attack, for each enemy unit killed, add 1 unit of the active faction to any planet the active faction controls.', // subjugate
                    eagleelephant: 'Destroy: Choose 1 unit of the active faction. Kill up to 5 enemy units on any adjacent planets.', // alchemist's fire // gorgons
                    eaglehorse: 'SSV Normandy: Your attack may target any planet in the galaxy.', // armada
                    eaglelion: 'Synthesis: Add 1 unit to each planet the active faction controls.', // populate
                    elephanthorse: 'Secret Base: Reinforce an empty planet with no Prothean artifact & no orbital station by adding 4 units of the controlling faction.', // uprising // TODO check if this text is too long & pushes the card bottom downwards.
                    elephantlion: 'Loyalty: Add up to 6 units to the current attack from any planets the active faction controls.', // reinforce
                    horselion: 'Operation Overdrive: After performing an action with an agent, take the same action again.', // midnight oil // Like a Hamster on Coffee
                },
            },
        };

        /* Terminology for TI
        banner -> troop
        army -> battle group (unused)
        region -> location
        city -> Harbinger Knowledge
        farm -> city
        tower -> Fortified Position
        empire -> Hive
        council position -> Hive square

        for Mass Effect
        empire -> faction
        region -> planet (despite incorrect for citadel etc)
        city -> Prothean artifact
        farm -> city
        tower -> orbital station
        banner -> unit
        army -> army (unused)
        agent -> agent
        council position -> faction VIP
        */

        const lines = EFFECTS[this.theme];

        if (animal2) {
            if (['control', 'plus4'].includes(animal2)) {
                const effect = lines.DarkAlliance[animal1][animal2];
                return `If they accept, ${effect}.`;
            }

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
        theme = theme || window.AWOWtheme || 'terraignota';
        const table = document.getElementById('main');
        let row;
        let colNum = 99; // Must start >= row width.

        for (let animal1 of Card.animals()) {
            for (let animal2 of Card.animals()) {
                for (let repeat = 1; repeat <= 2; repeat++) {
                    if (animal1 === animal2) { continue; }

                    const card = new Card(theme, animal1, animal2);
                    const td = card.html();

                    // TODO functionize this.
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

        // Also Treasure wildcards
        for (let i = 0; i < 10; i++) {
            const card = new Card(theme, 'wild');
            const td = card.wild();

            if (colNum > 3) {
                row = Util.htmlElement('tr');
                table.appendChild(row);
                colNum = 1;
            }

            row.appendChild(td);
            colNum++;
        }

        // Also Dark Alliance cards
        for (let animal of Card.animals()) {
            const card = new Card(theme, animal);
            const tdControl = card.darkAlliance(true);

            if (colNum > 3) {
                row = Util.htmlElement('tr');
                table.appendChild(row);
                colNum = 1;
            }

            row.appendChild(tdControl);
            colNum++;

            const tdPlus4 = card.darkAlliance(false);

            if (colNum > 3) {
                row = Util.htmlElement('tr');
                table.appendChild(row);
                colNum = 1;
            }

            row.appendChild(tdPlus4);
            colNum++;
        }
    }

    static run () {
        Card.createCards('terraignota');
    }
}

Card.run();
