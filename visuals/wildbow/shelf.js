'use strict';

// Funcs for creating shelf.html, which depicts a imagined bookshelf that contains paper versions of all web serials by the author Wildbow.

const Util = require('../../util/util.js');

class Shelf {
    constructor () {
        const books = this.arcs();
        this.shelves = [ [] ];

        let shelfIndex = 0;
        let shelfWords = 0;

        const SHELF_INCHES = 18;
        const MAX_WORDS = 150_000 * SHELF_INCHES;

        for (let book of books) {
            shelfWords += book.words;

            // console.log({
            //     context: `in constructor, on book ${book.spine}`,
            //     shelfIndex,
            //     shelfWords,
            //     MAX_WORDS,
            // });

            if (shelfWords <= MAX_WORDS) {
                this.shelves[shelfIndex].push(book);
            }
            else {
                this.shelves.push( [book] );
                shelfIndex++;
                shelfWords = 0;
            }
        }

        console.log( this.toString() );
    }

    toString () {
        return this.shelves.map(
            shelf => shelf.map(
                book => book.spine
            )
            .join('\n')
        )
        .join('\n\n');
    }

    asHTML () {
        return this.shelves.map(
            shelf => {
                const booksHTML = shelf.map(
                    book => {
                        const px = this.words2px(book.words);

                        return `        <div class="book ${book.serial.toLowerCase()}" style="width: ${px}px">${book.spine}</div>`
                    }
                )
                .join('\n');

                return `      <div class="shelf">
${booksHTML}
      </div>`;
            }
        )
        .join('\n');
    }

    words2px (words) {
        return Util.round(words / 2_000);
    }

    arcs () {
        return [
            { spine: 'I: Gestation', words: 15135, serial: 'Worm' },
            { spine: 'II: Insinuation', words: 25411, serial: 'Worm' },
            { spine: 'III: Agitation', words: 37850, serial: 'Worm' },
            { spine: 'IV: Shell', words: 37474, serial: 'Worm' },
            { spine: 'V: Hive', words: 37369, serial: 'Worm' },
            { spine: 'VI: Tangle', words: 44139, serial: 'Worm' },
            { spine: 'VII: Buzz', words: 47145, serial: 'Worm' },
            { spine: 'VIII: Extermination', words: 51703, serial: 'Worm' },
            { spine: 'IX: Sentinel', words: 34600, serial: 'Worm' },
            { spine: 'X: Parasite', words: 38655, serial: 'Worm' },
            { spine: 'XI: Infestation', words: 83401, serial: 'Worm' },
            { spine: 'XII: Plague', words: 57924, serial: 'Worm' },
            { spine: 'XIII: Snare', words: 60541, serial: 'Worm' },
            { spine: 'XIV: Prey', words: 73498, serial: 'Worm' },
            { spine: 'XV: Colony', words: 78154, serial: 'Worm' },
            { spine: 'XVI: Monarch', words: 91947, serial: 'Worm' },
            { spine: 'XVII: Migration', words: 52506, serial: 'Worm' },
            { spine: 'XVIII: Queen', words: 77070, serial: 'Worm' },
            { spine: 'XIX: Scourge', words: 66684, serial: 'Worm' },
            { spine: 'XX: Chrysalis', words: 43508, serial: 'Worm' },
            { spine: 'XXI: Imago', words: 56560, serial: 'Worm' },
            { spine: 'XXII: Cell', words: 58640, serial: 'Worm' },
            { spine: 'XXIII: Drone', words: 45308, serial: 'Worm' },
            { spine: 'XXIV: Crushed', words: 56206, serial: 'Worm' },
            { spine: 'XXV: Scarab', words: 55233, serial: 'Worm' },
            { spine: 'XXVI: Sting', words: 85143, serial: 'Worm' },
            { spine: 'XXVII: Extinction', words: 44723, serial: 'Worm' },
            { spine: 'XXVIII: Cockroaches', words: 49838, serial: 'Worm' },
            { spine: 'XXIX: Venom', words: 72542, serial: 'Worm' },
            { spine: 'XXX: Speck', words: 54841, serial: 'Worm' },
            { spine: 'XXXI: Teneral', words: 38869, serial: 'Worm' },

            { spine: '0: Glow-worm', words: 26127, serial: 'Ward' },
            { spine: 'I: Daybreak', words: 51622, serial: 'Ward' },
            { spine: 'II: Flare', words: 58786, serial: 'Ward' },
            { spine: 'III: Glare', words: 47502, serial: 'Ward' },
            { spine: 'IV: Shade', words: 83477, serial: 'Ward' },
            { spine: 'V: Shadow', words: 107792, serial: 'Ward' },
            { spine: 'VI: Pitch', words: 55725, serial: 'Ward' },
            { spine: 'VII: Torch', words: 134962, serial: 'Ward' },
            { spine: 'VIII: Beacon', words: 82335, serial: 'Ward' },
            { spine: 'IX: Gleaming', words: 138297, serial: 'Ward' },
            { spine: 'X:  Polarize', words: 102475, serial: 'Ward' },
            { spine: 'XI:  Blinding', words: 108954, serial: 'Ward' },
            { spine: 'XII:  Heavens', words: 124147, serial: 'Ward' },
            { spine: 'XIII:  Black', words: 101174, serial: 'Ward' },
            { spine: 'XIV:  Breaking', words: 90271, serial: 'Ward' },
            { spine: 'XV:  Dying', words: 90965, serial: 'Ward' },
            { spine: 'XVI:  From Within', words: 93845, serial: 'Ward' },
            { spine: 'XVII:  Sundown', words: 109990, serial: 'Ward' },
            { spine: 'XVIII:  Radiation', words: 85096, serial: 'Ward' },
            { spine: 'XIX:  Infrared', words: 124592, serial: 'Ward' },
            { spine: 'XX:  Last', words: 116420, serial: 'Ward' },

            { spine: 'I: Bonds', words: 56272, serial: 'Pact' },
            { spine: 'II: Damages', words: 62815, serial: 'Pact' },
            { spine: 'III: Breach', words: 42663, serial: 'Pact' },
            { spine: 'IV: Collateral', words: 92743, serial: 'Pact' },
            { spine: 'V: Conviction', words: 48391, serial: 'Pact' },
            { spine: 'VI: Subordination', words: 76006, serial: 'Pact' },
            { spine: 'VII: Void', words: 69946, serial: 'Pact' },
            { spine: 'VIII: Signature', words: 48190, serial: 'Pact' },
            { spine: 'IX: Null', words: 51129, serial: 'Pact' },
            { spine: 'X: Mala Fide', words: 49145, serial: 'Pact' },
            { spine: 'XI: Malfeasance', words: 70228, serial: 'Pact' },
            { spine: 'XII: Duress', words: 55746, serial: 'Pact' },
            { spine: 'XIII: Execution', words: 54179, serial: 'Pact' },
            { spine: 'XIV: Sine Die', words: 55360, serial: 'Pact' },
            { spine: 'XV: Possession', words: 43815, serial: 'Pact' },
            { spine: 'XVI: Judgment', words: 66261, serial: 'Pact' },

            { spine: 'I: Lost for Words', words: 91847, serial: 'Pale' },
            { spine: 'II: Stolen Away', words: 121244, serial: 'Pale' },
            { spine: 'III: Out on a Limb', words: 102295, serial: 'Pale' },
            { spine: 'IV: Leaving a Mark', words: 120625, serial: 'Pale' },
            { spine: 'V: Back Away', words: 93160, serial: 'Pale' },
            { spine: 'VI: Cutting Glass', words: 117665, serial: 'Pale' },
            { spine: 'VII: Gone Ahead', words: 115721, serial: 'Pale' },
            { spine: 'VIII: Vanishing Points', words: 99578, serial: 'Pale' },
            { spine: 'IX: Shaking Hands', words: 125438, serial: 'Pale' },
            { spine: 'X: One After Another', words: 117402, serial: 'Pale' },
            { spine: 'XI: Dash to Pieces', words: 155129, serial: 'Pale' },
            { spine: 'XII: False Moves', words: 148097, serial: 'Pale' },
            { spine: 'XIII: Summer Break', words: 242034, serial: 'Pale' },
            { spine: 'XIV: Fall Out', words: 93625, serial: 'Pale' },
            { spine: 'XV: Playing a Part', words: 163039, serial: 'Pale' },
            { spine: 'XVI: Left in the Dust', words: 161166, serial: 'Pale' },
            { spine: 'XVII: Gone and Done It', words: 140000, serial: 'Pale' },
            { spine: 'XVIII: Wild Abandon', words: 105000, serial: 'Pale' },
            { spine: 'XIX: Crossed with Silver', words: 126000, serial: 'Pale' },
            { spine: 'XX: Let Slip', words: 112000, serial: 'Pale' },
            { spine: 'XXI: In Absentia', words: 98000, serial: 'Pale' },
            { spine: 'XXII: Hard Pass', words: 63000, serial: 'Pale' },
            { spine: 'XXIII: Go for the Throat', words: 112000, serial: 'Pale' },
            { spine: 'XXIV: Finish Off', words: 133000, serial: 'Pale' },
            { spine: 'XXV: Loose Ends', words: 42000, serial: 'Pale' },

            { spine: 'I: Taking Root', words: 69088, serial: 'Twig' },
            { spine: 'II: Cat out of the Bag', words: 52208, serial: 'Twig' },
            { spine: 'III: Lips Sealed', words: 52236, serial: 'Twig' },
            { spine: 'IV: Stitch in Time', words: 57828, serial: 'Twig' },
            { spine: 'V: Esprit de Corpse', words: 75733, serial: 'Twig' },
            { spine: 'VI: Lamb to the Slaughter', words: 68902, serial: 'Twig' },
            { spine: 'VII: Tooth and Nail', words: 84287, serial: 'Twig' },
            { spine: 'VIII: Bleeding Edge', words: 80355, serial: 'Twig' },
            { spine: 'IX: Counting Sheep', words: 89420, serial: 'Twig' },
            { spine: 'X: In Sheep’s Clothing', words: 109618, serial: 'Twig' },
            { spine: 'XI: Cut to the Quick', words: 82495, serial: 'Twig' },
            { spine: 'XII: Dyed in the Wool', words: 58572, serial: 'Twig' },
            { spine: 'XIII: Black Sheep', words: 70119, serial: 'Twig' },
            { spine: 'XIV: Thicker than Water', words: 99305, serial: 'Twig' },
            { spine: 'XV: Bitter Pill', words: 85825, serial: 'Twig' },
            { spine: 'XVI: Head over Heels', words: 73706, serial: 'Twig' },
            { spine: 'XVII: Gut Feeling', words: 87185, serial: 'Twig' },
            { spine: 'XVIII: Dog Eat Dog', words: 97904, serial: 'Twig' },
            { spine: 'XIX: Root and Branch', words: 86462, serial: 'Twig' },
            { spine: 'XX: Crown of Thorns', words: 102119, serial: 'Twig' },
            { spine: 'XXI: Forest for the Trees', words: 22469, serial: 'Twig' },

            { spine: 'I: The Point', words: 49000, serial: 'Claw' },
            { spine: 'II: Retraction', words: 42000, serial: 'Claw' },
            { spine: 'III: Scrape', words: 42000, serial: 'Claw' },
            { spine: 'IV: Tip', words: 42000, serial: 'Claw' },
            { spine: 'V: The Quick', words: 42000, serial: 'Claw' },
            { spine: 'VI: ?', words: 42000, serial: 'Claw' },
        ];
    }

    static run () {
        const shelf = new Shelf();

        console.log(shelf.asHTML());
    }
}

Shelf.run();
