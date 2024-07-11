'use strict';

// Returns the equipment of a scifi warrior
// Context: Hypothetical game influenced by Halo & Mass Effect

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class Loadout extends TextGen {
    constructor () {
        super();

        this.selectCards();
    }

    selectCards () {
        this.cards = [];

        const MAX_ATTEMPTS = 99;

        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const newCard = Card.random();

            if (this.alreadyHas(newCard)) {
                continue;
            }

            if (newCard.hasTag('weapon') && this.tagCount('weapon') >= Loadout.MAX_WEAPONS) {
                break;
            }

            if (this.weight() + newCard.weight > Loadout.MAX_WEIGHT) {
                break;
            }

            if (this.maybeStop()) {
                break;
            }

            this.cards.push(newCard);
        }

        this.cards.sort(Card.comparator);
    }

    alreadyHas (newCard) {
        return this.cards.some(
            existingCard => existingCard.name === newCard.name
        );
    }

    cost () {
        return Util.sum(
            this.cards.map(
                c => c.cost || 0
            )
        );
    }

    // Another way of looking at cost of this loadout.
    squadSize () {
        return Math.floor(36 / this.cost());
    }

    weight () {
        return Util.sum(
            this.cards.map(
                c => c.weight || 0
            )
        );
    }

    // Another way of looking at the weight of this loadout.
    agility () {
        return Loadout.MAX_WEIGHT + 1 - this.weight();
    }

    tagCount (tag) {
        return this.cards.filter(
            c => c.hasTag(tag)
        ).length;
    }

    maybeStop () {
        const chance = this.cards.length / (this.cards.length + Loadout.COMPLEXITY);

        return Math.random() < chance;
    }

    // Called by TextGen.outputHTML()
    output () {
        return this.toString();
    }

    toString () {
        const cardsString = this.cards.map(
            c => Util.fromCamelCase(c.name)
        ).join(', ');

        const squadVisualization = '• '.repeat(this.squadSize());

        return `${cardsString}\n\n${squadVisualization}\n\nSquad of ${this.squadSize()}, Agility ${this.agility()}\n$${this.cost()} each, Weight ${this.weight()}`;
    }

    static run () {
        Card.testSort();

        Util.logDebug(`All tests passed :)`);

        const gen = new Loadout();

        console.log();
        console.log( gen.output() );
    }
}

// Motive: 1 less than the weight of 2 chainguns.
Loadout.MAX_WEIGHT = 5;
Loadout.MAX_WEAPONS = 3;

// High = more cards per loadout.
Loadout.COMPLEXITY = 9;

// Each 'card' is a item or trait.
class Card {
    constructor (template) {
        if (! template) {
            template = Util.randomOf(
                Card.allCards()
            );
        }

        Object.assign(this, template);
    }

    toString () {
        return `${Util.fromCamelCase(this.name)} ($${this.cost}, Weight ${this.weight})`;
    }

    hasTag (tag) {
        return this.tags.split(' ')
            .includes(tag);
    }

    static allCards () {
        return [
            { name: 'knife', cost: 1, weight: 1, tags: 'weapon cqc' },
            { name: 'fragGrenade', cost: 1, weight: 1, tags: 'gear' },
            { name: 'armShield', cost: 1, weight: 1, tags: 'gear' },
            { name: 'heavyArmor', cost: 1, weight: 2, tags: 'gear' },
            { name: 'jetpack', cost: 2, weight: 1, tags: 'gear' },
            { name: 'activeCamo', cost: 2, weight: 1, tags: 'gear' },
            { name: 'AI', cost: 3, weight: 0, tags: 'gear' },
            { name: 'grappleshot', cost: 2, weight: 1, tags: 'gear' },
            { name: 'sidekick', cost: 1, weight: 1, tags: 'weapon ranged' },
            { name: 'magnum', cost: 2, weight: 1, tags: 'weapon ranged', notes: 'Reach' },
            { name: 'heavyPistol', cost: 3, weight: 1, tags: 'weapon ranged', notes: 'Halo 1' },
            { name: 'silencedPistol', cost: 1, weight: 1, tags: 'weapon ranged' },
            { name: 'SMG', cost: 1, weight: 1, tags: 'weapon ranged' },
            { name: 'silencedSMG', cost: 1, weight: 1, tags: 'weapon ranged' },
            { name: 'assaultRifle', cost: 1, weight: 2, tags: 'weapon ranged' },
            { name: 'commando', cost: 2, weight: 2, tags: 'weapon ranged' },
            { name: 'flamethrower', cost: 2, weight: 3, tags: 'weapon ranged' },
            { name: 'battleRifle', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'DMR', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'grenadeLauncher', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'hydra', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'railgun', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'shotgun', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'SAW', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'stickyGrenadeLauncher', cost: 3, weight: 2, tags: 'weapon ranged' },
            { name: 'spartanLaser', cost: 4, weight: 2, tags: 'weapon ranged' },
            { name: 'sniperRifle', cost: 4, weight: 2, tags: 'weapon ranged' },
            { name: 'heavySAW', cost: 4, weight: 2, tags: 'weapon ranged' },
            { name: 'chaingun', cost: 4, weight: 3, tags: 'weapon ranged' },
            { name: 'rocketLauncher', cost: 4, weight: 3, tags: 'weapon ranged' },
            { name: 'gaussTurret', cost: 5, weight: 3, tags: 'weapon ranged' },
        ];
    }

    static random () {
        return new Card(
            Util.randomOf(
                Card.allCards()
            )
        );
    }

    static comparator (a, b) {
        if (a.weight !== b.weight) {
            return b.weight - a.weight;
        }

        if (a.cost !== b.cost) {
            return b.cost - a.cost;
        }

        return a.name.localeCompare(b.name);
    }

    static testSort () {
        const testCards = [
            new Card({ name: 'axe', cost: 2, weight: 2 }),
            new Card({ name: 'buckler', cost: 2, weight: 2 }),
            new Card({ name: 'axe', cost: 1, weight: 2 }),
            new Card({ name: 'buckler', cost: 1, weight: 2 }),
            new Card({ name: 'axe', cost: 2, weight: 1 }),
            new Card({ name: 'buckler', cost: 2, weight: 1 }),
            new Card({ name: 'axe', cost: 1, weight: 1 }),
            new Card({ name: 'buckler', cost: 1, weight: 1 }),
        ];

        const copy = testCards.map(c => c);

        copy.sort(Card.comparator);

        for (let i = 0; i < testCards.length; i++) {
            if (testCards[i].name !== copy[i].name) {
                throw new Error(
                    copy.map(
                        c => c.toString()
                    ).join('\n')
                );
            }
        }
    }
}

module.exports = Loadout;

Loadout.run();
