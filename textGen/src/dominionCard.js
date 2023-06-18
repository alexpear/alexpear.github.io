'use strict';

// Random card similar to the Dominion card game.

class DominionCard {
    constructor () {
        this.name = 'New Card';
        this.lines = {};
        this.types = {
            action: true
        };
        this.text = '';

        this.fill();
        this.print();
    }

    fill () {
        const lineCount = DominionCard.randomUpTo(4);
        // console.log(`lineCount is ${lineCount}`)

        for (let i = 0; i < lineCount && this.getPrice() < 6; i++) {
            // console.log(`in fill(), i is ${i}`)

            this.addLine();
        }

        // console.log('\n') // visually separate the debug section
    }

    addLine () {
        let newType;

        if (Object.keys(this.lines).length >= 4) {
            // Card is full.
            return false;
        }

        do {
            newType = DominionCard.randomLineType();
            // console.log(`trying a new line type: ${newType}`)
        }
        while (this.lines[newType]);

        const maxParam = DominionCard.LINE_TYPES[newType].maxParam;
        this.lines[newType] = DominionCard.randomUpTo(maxParam);

        if (newType === 'treasure' || newType === 'victory' || newType === 'duration') {
            this.types[newType] = true;
        }
        else if (newType === 'discardTo' || newType === 'enemiesCurse') {
            this.types.attack = true;
        }

        console.log(`Added line ${newType}: ${this.lines[newType]}`)

        return true;
    }

    static randomLineType () {
        return DominionCard.randomOf(Object.keys(DominionCard.LINE_TYPES));
    }

    getPrice () {
        const prices = Object.keys(
            this.lines
        ).map(
            key => {
                const costRate = DominionCard.LINE_TYPES[key].cost;

                const lineParam = this.lines[key];

                if (typeof costRate === 'number') {
                    return costRate * lineParam;
                }

                return costRate(lineParam);
            }
        );

        const sum = prices.reduce(
            (total, subPrice) => total + subPrice,
            0
        );

        const rounded = Math.round(sum)
        this.price = Math.max(rounded, 0);

        return this.price;
    }

    print () {
        this.text = this.toString();

        // console.log(`\n==============================`)
        console.log(this.text);
    }

    toString () {
        let output = `\n------- ${this.name} -------\n\n`;

        if (this.lines.duration) {
            output += `Now and at the start of your next turn:\n`;
        }
        if (this.lines.card) {
            output += `+${this.lines.card} Cards\n`;
        }
        if (this.lines.action) {
            output += `+${this.lines.action} Actions\n`;
        }
        if (this.lines.buy) {
            output += `+${this.lines.buy} Buy\n`;
        }
        if (this.lines.money) {
            output += `+${this.lines.money} Money\n`;
        }
        if (this.lines.coffer) {
            output += `+${this.lines.coffer} Coffers\n`;
        }
        if (this.lines.villager) {
            output += `+${this.lines.villager} Villagers\n`;
        }
        if (this.lines.vpToken) {
            output += `+${this.lines.vpToken} VP Token\n`;
        }
        if (this.lines.playAnother) {
            output += `You may play an Action card from your hand ${this.lines.playAnother} times.\n`;
        }
        if (this.lines.discardTo) {
            output += `Each other player discards down to ${this.lines.discardTo} cards in hand.\n`;
        }
        if (this.lines.enemiesCurse) {
            output += `Each other player gains ${this.lines.enemiesCurse} Curse cards.\n`;
        }
        if (this.lines.trashGain) {
            output += `Trash a card from your hand. Gain a card costing up to ${this.lines.trashGain} more than it.\n`;
        }
        if (this.lines.mayTrash) {
            output += `You may trash up to ${this.lines.mayTrash} cards from your hand.\n`;
        }
        if (this.lines.drawTo) {
            output += `Draw until you have at least ${this.lines.drawTo} cards in hand.\n`;
        }
        if (this.lines.reduceCosts) {
            output += `While this is in play, cards cost ${this.lines.reduceCosts} less, but not less than 0.\n`;
        }
        if (this.lines.treasure) {
            // LATER replace all '2 money' with '$2'
            output += `Worth ${this.lines.treasure} money.\n`;
        }
        if (this.lines.victory) {
            output += `Worth ${this.lines.victory} VP.\n`;
        }
        if (this.lines.gainFromSupply) {
            output += `Gain a card costing up to ${this.lines.gainFromSupply}.\n`;
        }
        if (this.lines.gainSilver) {
            output += `Gain a Silver.\n`;
        }
        if (this.lines.horse) {
            output += `Gain a Horse.\n`;
        }
        if (this.lines.trashThis) {
            output += `Trash this card.\n`;
        }

        const types = Object.keys(
            this.types
        )
        .map(
            t => t.toUpperCase()
        )
        .join(' - ');

        output += `\n-- $${this.getPrice()} ${types} --`;

        return output;
        // return JSON.stringify(this, undefined, '    ');
    }

    // Minimum is always 1.
    static randomUpTo (maxInclusive) {
        return Math.floor(Math.random() * maxInclusive) + 1;
    }

    static randomOf (array) {
        return array[
            Math.floor(Math.random() * array.length)
        ];
    }

    static run () {
        const card = new DominionCard();
    }
}

// Values represent the maximum parameter for this line. The minimum is 1.
DominionCard.LINE_TYPES = {
    card: { // Market
        maxParam: 4,
        cost: 1
    },
    action: { // Market
        maxParam: 3,
        cost: 1,
        words: ['village', 'town'] // TODO
    },
    money: { // Market
        maxParam: 5,
        cost: 1
    },
    buy: { // Market
        maxParam: 2,
        cost: 0.5,
        words: ['market']
    },
    coffer: { // Baker
        maxParam: 2,
        cost: 1.2
    },
    villager: { // Patron
        maxParam: 2,
        cost: 1.2
    },
    vpToken: { // Temple
        maxParam: 1,
        cost: 2
    },
    discardTo: { // Militia (high numbers are less effective)
        maxParam: 5,
        cost: p => (0.5 * (6 - p))
    },
    enemiesCurse: { // Witch
        maxParam: 1,
        cost: 3
    },
    gainFromSupply: { // Workshop
        maxParam: 6,
        cost: 0.5
    },
    gainSilver: { // Scrap
        maxParam: 1,
        cost: 2
    },
    horse: { // Stampede (gain a Horse)
        maxParam: 1,
        cost: 1
    },
    mayTrash: { // Chapel
        maxParam: 4,
        cost: 0.5
    },
    trashGain: { // Remodel
        maxParam: 3,
        cost: 2.2
    },
    trashThis: { // Feast
        maxParam: 1,
        cost: -2
    },
    playAnother: { // Throne Room (1 means 'You may play an Action card from your hand 1 time', similar to +1 Action)
        maxParam: 3,
        cost: 2.2
    },
    duration: { // Wharf (ie, perform same effect at start of next turn)
        maxParam: 1,
        cost: 2.5
    },
    drawTo: { // Library
        maxParam: 7,
        cost: 0.5
    },
    reduceCosts: { // Bridge
        maxParam: 2,
        cost: 2
    },
    // Boon
    // Hex
    treasure: { // Copper
        maxParam: 5,
        cost: 2
    },
    victory: { // Estate
        maxParam: 10,
        cost: 1.5
    }
};

module.exports = DominionCard;

DominionCard.run();
