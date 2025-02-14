// Represent a number as a cool symmetrical grid image.
// Many to 1 mapping, because visually noisy features are polished out.

const Util = require('../util/util.js');

class Navatar {
    constructor (id, width) {
        this.id = Util.default(
            id,
            Math.random() * 1e16
        );

        this.width = width || Navatar.DEFAULT_WIDTH;
        // this.colors = []; // LATER support base-3, base-4.
        this.halfGrid = this.rawHalfGrid();
        this.polish();
    }

    // Returns the left half, including the middle column.
    rawHalfGrid () {
        const halfGrid = [...Array(this.width)];

        // Maximum number that could be encoded by this grid.
        const gridMax = Math.pow(2, this.width * this.columns());
        const seed = Math.ceil(this.id) % gridMax;
        let pixelNumber = 0;

        for (let x = 0; x < this.columns(); x++) {
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

    columns () {
        return Math.ceil(this.width / 2);
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
        const UGLY_ORTHOS = [true, false, false, false, false];
        const UGLY_DIAGS = [false, false, true, true, true];

        for (let x = 0; x < this.columns(); x++) {
            for (let y = 0; y < this.halfGrid.length; y++) {

                if (! this.colorAt(x, y)) {
                    continue; // If pixel is blank, do not polish it.
                }

                const neighborGrid = this.neighborGrid(x, y);

                const orthoNeighbors = neighborGrid[0, 1] +
                    neighborGrid[1, 0] +
                    neighborGrid[1, 2] +
                    neighborGrid[2, 1];

                const diagNeighbors = neighborGrid[0, 0] +
                    neighborGrid[0, 2] +
                    neighborGrid[2, 0] +
                    neighborGrid[2, 2];

                if (UGLY_ORTHOS[orthoNeighbors] && UGLY_DIAGS[diagNeighbors]) {
                    // Visually ugly situation, turn this pixel off.
                    this.halfGrid[y][x] = 0;
                }
            }
        }
    }

    neighborGrid (x, y) {
        const nGrid = [
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ];

        for (let nx = -1; nx <= 1; nx++) {
            for (let ny = -1; ny <= 1; ny++) {
                let neighbors = 0;

                // TODO deal with reflections
                if (
                    x + nx < 0 ||
                    x + nx >= this.width ||
                    y + ny < 0 ||
                    y + ny >= this.width
                ) {
                    neighbors = 0;
                }
                else {
                    neighbors = this.colorAt(x + nx, y + ny) ?
                        1 : // This grid is colorblind.
                        0;
                }

                nGrid[ny + 1][nx + 1] = neighbors;
            }
        }
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
        if (x >= this.columns()) {
            x = this.width - 1 - x;
        }

        // TODO handle surpassing edges of grid.

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
