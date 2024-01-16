'use strict';

// Randomly generate students from the Sunlight scifi series.

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

class Student extends TextGen {
    constructor () {
        super();

        this.gender = Util.randomBagDraw({
            female: 3,
            male: 3,
            other: 1,
        });

        this.items = this.randomLoadout();
    }

    randomLoadout () {
        const count = Util.randomUpTo(10);



        return items;
    }

//     fill () {
//         const lineCount = DominionCard.randomUpTo(4);
//         // console.log(`lineCount is ${lineCount}`)

//         for (let i = 0; i < lineCount && this.getPrice() < 6; i++) {
//             // console.log(`in fill(), i is ${i}`)

//             this.addLine();
//         }

//         // console.log('\n') // visually separate the debug section
//     }

//     static randomLineType () {
//         return DominionCard.randomOf(Object.keys(DominionCard.LINE_TYPES));
//     }

//     getPrice () {
//         const prices = Object.keys(
//             this.lines
//         ).map(
//             key => {
//                 const costRate = DominionCard.LINE_TYPES[key].cost;

//                 const lineParam = this.lines[key];

//                 if (typeof costRate === 'number') {
//                     return costRate * lineParam;
//                 }

//                 return costRate(lineParam);
//             }
//         );

//         const sum = prices.reduce(
//             (total, subPrice) => total + subPrice,
//             0
//         );

//         const rounded = Math.round(sum)
//         this.price = Math.max(rounded, 0);

//         return this.price;
//     }

//     print () {
//         this.text = this.toString();

//         // console.log(`\n==============================`)
//         console.log(this.text);
//     }

//     toString () {
//         let output = ''; //`\n------- ${this.name} -------\n\n`;

//         if (this.lines.duration) {
//             output += `Now and at the start of your next turn:\n`;
//         }
//         if (this.lines.card) {
//             output += `+${this.lines.card} Cards\n`;
//         }
//         if (this.lines.action) {
//             output += `+${this.lines.action} Actions\n`;
//         }
//         if (this.lines.buy) {
//             output += `+${this.lines.buy} Buy\n`;
//         }
//         if (this.lines.money) {
//             output += `+$${this.lines.money}\n`;
//         }
//         if (this.lines.coffer) {
//             output += `+${this.lines.coffer} Coffers\n`;
//         }
//         if (this.lines.villager) {
//             output += `+${this.lines.villager} Villagers\n`;
//         }
//         if (this.lines.vpToken) {
//             output += `+${this.lines.vpToken} VP Token\n`;
//         }
//         if (this.lines.playAnother) {
//             output += `You may play an Action card from your hand ${this.lines.playAnother} times.\n`;
//         }
//         if (this.lines.discardTo) {
//             output += `Each other player discards down to ${this.lines.discardTo} cards in hand.\n`;
//         }
//         if (this.lines.enemiesCurse) {
//             output += `Each other player gains ${this.lines.enemiesCurse} Curse cards.\n`;
//         }
//         if (this.lines.trashGain) {
//             output += `Trash a card from your hand. Gain a card costing up to ${this.lines.trashGain} more than it.\n`;
//         }
//         if (this.lines.mayTrash) {
//             output += `You may trash up to ${this.lines.mayTrash} cards from your hand.\n`;
//         }
//         if (this.lines.drawTo) {
//             output += `Draw until you have at least ${this.lines.drawTo} cards in hand.\n`;
//         }
//         if (this.lines.reduceCosts) {
//             output += `While this is in play, cards cost ${this.lines.reduceCosts} less, but not less than 0.\n`;
//         }
//         if (this.lines.treasure) {
//             output += `Worth $${this.lines.treasure}.\n`;
//         }
//         if (this.lines.victory) {
//             output += `Worth ${this.lines.victory} VP.\n`;
//         }
//         if (this.lines.gainFromSupply) {
//             output += `Gain a card costing up to ${this.lines.gainFromSupply}.\n`;
//         }
//         if (this.lines.gainSilver) {
//             output += `Gain a Silver.\n`;
//         }
//         if (this.lines.horse) {
//             output += `Gain a Horse.\n`;
//         }
//         if (this.lines.trashThis) {
//             output += `Trash this card.\n`;
//         }

//         const types = Object.keys(
//             this.types
//         )
//         .map(
//             t => t.toUpperCase()
//         )
//         .join(' - ');

//         output += `\n-- $${this.getPrice()} ${types} --`;

//         return output;
//         // return JSON.stringify(this, undefined, '    ');
//     }

    output () {
        return new Student().toString();
    }

    static run () {
        const card = new Student();
        // print TODO
    }
};

Student.ITEM = {
    StandardIssue: {
        Shirt: {},
        Trousers: {},
        Boots: {},
        Gloves: {},
    },
    Found: {
        // Worn

        // Supplies

        Weapon: {
            Knife: {
                commonness: 100,
                handsUsed: 1,
            },
            Pistol: {
                commonness: 100,
                handsUsed: 1,
            },
        },

        // Equipment

        // Vehicles
    },
};

module.exports = Student;

Student.run();
