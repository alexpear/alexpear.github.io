// Represent a number as a cool symmetrical grid image.
// Many to 1 mapping, because visually noisy features are polished out.

const Util = require('../util/util.js');

class Navatar {
    constructor (id, width) {
        this.id = Util.default(
            id,
            Math.random() * 1e27
        );

        this.width = width || Navatar.DEFAULT_WIDTH;
        // this.colors = []; // LATER support base-3, base-4.
        this.halfGrid = this.rawHalfGrid();
        this.polish();
    }

    // Returns the left half, including the middle column.
    rawHalfGrid () {
        const halfGrid = [...Array(this.width)];
        const columns = Math.ceil(this.width / 2);

        // Maximum number that could be encoded by this grid.
        const gridMax = Math.pow(2, this.width * columns);
        const seed = Math.ceil(this.id) % gridMax;
        let pixelNumber = 0;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < halfGrid.length; y++) {
                if (x === 0 && ! halfGrid[y]) {
                    halfGrid[y] = [];
                }

                // Note that y describes which row, x describes which column.
                halfGrid[y][x] = this.color(pixelNumber);
                pixelNumber++;
            }
        }

        return halfGrid;
    }

    // Returns a binary digit of this.id.
    color (pixelNumber) {
        return Math.floor(
            this.id / Math.pow(2, pixelNumber)
        ) % 2;
    }

    polish () {
        // Define ugly based on number of ortho & diag neighbors
        // See Roam 2025 Feb 13
    }

    toString (indent) {
        indent = Util.default(indent, 2);
        const indentStr = ' '.repeat(indent);

        const SYMBOLS = ['  ', '██', '??'];
        let out = '';

        for (let y = 0; y < this.halfGrid.length; y++) {
            out += indentStr;

            for (let x = 0; x < this.halfGrid.length; x++) {
                out += SYMBOLS[
                    this.colorAt(x, y)
                ];
            }

            out += '\n';
        }

        return out;
    }

    colorAt (x, y) {
        const columns = Math.ceil(this.width / 2);

        if (x >= columns) {
            x = this.width - 1 - x;

            // width 5
            // x = 2 is legit
            // x = 3 -> 1
            // x = 4 -> 0

            // width 8
            // x = 3 is legit
            // x = 4 -> 3
            // x = 5 -> 2
        }

        return this.halfGrid[y][x];
    }

    static test () {
    }

    static run () {
        const navatar = new Navatar();

        console.log(`\n${navatar.toString()}\n`);
    }
}

Navatar.DEFAULT_WIDTH = 9;

// Run
Navatar.run();
