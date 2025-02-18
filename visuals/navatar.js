// Represent a number as a cool symmetrical grid image.
// Many to 1 mapping, because visually noisy features are polished out.

const Util = require('../util/util.js');

class Navatar {
    // id is a hexadecimal string
    // width is a number
    constructor (id, width) {
        this.width = width || Navatar.DEFAULT_WIDTH;

        // LATER could adapt the width to suit the length of id.

        // console.log(JSON.stringify({
        //     id,
        //     exists: Util.exists(id),
        //     longerThanZero: id.length >= 0,
        // }));

        if (! Util.exists(id) || ! (id.length >= 0)) {
            // String representation of id number
            // 2.77... is log(16)
            const hexLength = Math.ceil(
                Math.log(this.gridMax()) / 2.772588722239781
            );

            id = Array(hexLength)
                .fill()
                .map(
                    entry => Util.randomOf('01234567890abcdef')
                )
                .join('');

            // console.log(JSON.stringify({
                // id,
                // exists: Util.exists(id),
                // longerThanZero: id.length >= 0,
            // }));
        }

        this.id = id;

        // this.colors = []; // LATER support base-3, base-4.

        // Init fields for nextBit()
        this.idIndex = this.id.length - 1;
        this.currentDigit = Number('0x' + this.id[this.idIndex]);
        this.bitsProcessed = 0;

        this.generateAccessGrid();

        // debug
        // this.printGrid(this.accessGrid);

        this.halfGrid = this.rawHalfGrid();

        // LATER debug log at this time.

        this.polish();
    }

    generateAccessGrid () {
        const accessGridWidth = 3;
        const accessGridHeight = 5;

        this.accessGrid = Array(accessGridHeight)
            .fill()
            .map(
                row => Array(accessGridWidth)
                    .fill()
                    .map(pixel => 0)
            );

        for (let x = 0; x < accessGridWidth; x++) {
            for (let y = 0; y < accessGridHeight; y++) {
                this.accessGrid[y][x] = this.nextBit();
            }
        }

        // TODO if this.width is low, fill accessGrid with 1s (ie turn off this feature).
        // LATER case where there are very many zeros in here - altho doesnt seem to happen much in testing.
    }

    nextBit () {
        const output = this.currentDigit % 2;

        if (this.bitsProcessed >= 3) {
            this.idIndex -= 1;

            if (this.idIndex < 0) {
                this.idIndex = this.id.length - 1;
            }

            this.currentDigit = Number('0x' + this.id[this.idIndex]);

            this.bitsProcessed = 0;
        }
        else {
            this.bitsProcessed++;
            this.currentDigit >>= 1;
        }

        return output;
    }

    // Returns the left half, including the middle column.
    rawHalfGrid () {
        const halfGrid = [...Array(this.width)];

        for (let x = 0; x < this.columns(); x++) {
            for (let y = 0; y < halfGrid.length; y++) {

                if (x === 0 && ! halfGrid[y]) {
                    halfGrid[y] = [];
                }

                // Note that y describes which row, x describes which column.
                halfGrid[y][x] = this.canAccess(x, y) ?
                    this.nextBit() :
                    0;
            }
        }

        return halfGrid;
    }

    // Maximum number that could be encoded by this grid.
    gridMax () {
        return Math.pow(2, this.width * this.columns());
    }

    // Number of columns in the halfGrid internal representation.
    columns () {
        return Math.ceil(this.width / 2);
    }

    canAccess (x, y) {
        x = this.normalize(x);

        const accessSquareWidth = Math.ceil(this.width / this.accessGrid.length);

        const accessX = Math.floor(x / accessSquareWidth);
        const accessY = Math.floor(y / accessSquareWidth);

        return this.accessGrid[accessY][accessX] > 0;

        // TODO this is interpreting all accessgrids as vertically homogenous.
    }

    normalize (x) {
        if (x >= this.columns()) {
            return this.width - 1 - x;
        }

        return x;
    }

    // Returns a binary digit of this.id.
    color (pixelNumber) {
        return Math.floor(
            this.seed / Math.pow(2, pixelNumber)
        ) % 2;

        // TODO bug, mantissa issue? This division expression ends in several zeroes sometimes. Oddly, more severe at width 11 & 15 than at width 13. Fine at 9.
    }

    polish () {
        // Define ugly based on number of ortho & diag neighbors.
        // Pixels with 2+ exclusively-diagonal neighbors are ugly. They are less visually clean.
        // See Roam 2025 Feb 13
        const UGLY_ORTHOS = [true, false, false, false, false];
        const UGLY_DIAGS = [false, false, true, true, true];

        for (let x = 0; x < this.columns(); x++) {
            for (let y = 0; y < this.halfGrid.length; y++) {

                if (! this.colorAt(x, y)) {
                    continue; // If pixel is blank, do not polish it.
                }

                const neighborGrid = this.neighborGrid(x, y);

                const orthoNeighbors = neighborGrid[0][1] +
                    neighborGrid[1][0] +
                    neighborGrid[1][2] +
                    neighborGrid[2][1];

                const diagNeighbors = neighborGrid[0][0] +
                    neighborGrid[0][2] +
                    neighborGrid[2][0] +
                    neighborGrid[2][2];

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
                // if (
                //     x + nx < 0 ||
                //     x + nx >= this.width ||
                //     y + ny < 0 ||
                //     y + ny >= this.width
                // ) {
                //     neighbors = 0;
                // }
                // else {


                // This grid is colorblind.
                nGrid[ny + 1][nx + 1] = this.colorAt(x + nx, y + ny) ?
                    1 :
                    0;
            }
        }

        return nGrid;
    }

    toString (indent) {
        indent = Util.default(indent, 2);
        const indentStr = ' '.repeat(indent);

        let out = '';

        for (let y = 0; y < this.halfGrid.length; y++) {
            out += indentStr;

            for (let x = 0; x < this.halfGrid.length; x++) {
                const pixelString = Navatar.SYMBOLS[
                    this.colorAt(x, y)
                ];

                out += pixelString || '??';
            }

            out += '\n';
        }

        return out;
    }

    printGrid (grid) {
        let out = '\n';

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                out += Navatar.SYMBOLS[
                    grid[y][x]
                ] || '??';

                console.log(`grid[${y}][${x}] is ${grid[y][x]}`);
            }

            out += `${y} \n`;
        }

        console.log(out);
    }

    colorAt (x, y) {
        // Handle surpassing edges of grid.
        if (
            x < 0 ||
            x >= this.width ||
            y < 0 ||
            y >= this.width
        ) {
            return 0;
        }

        return this.halfGrid[y][this.normalize(x)];
    }

    demoMany () {
        const metaGrid = Array(Math.floor(
                process.stdout.rows / (this.width + 1)
            ))
            .fill()
            .map(
                row => Array(Math.floor(
                        process.stdout.columns / (this.width * 2 + 1)
                    ))
                    .fill()
                    .map(cell => new Navatar(undefined, this.width))
            );

        this.printMetaGrid(metaGrid);
    }

    printMetaGrid (metaGrid) {
        let horizLine = '+';

        for (let metax = 0; metax < metaGrid[0].length; metax++) {
            horizLine += '-'.repeat(metaGrid[0][0].width * 2) + '+';
        }

        console.log(horizLine);

        for (let metay = 0; metay < metaGrid.length; metay++) {

            for (let lineInRow = 0; lineInRow < metaGrid[0][0].width; lineInRow++) {
                let strip = '|';

                for (let metax = 0; metax < metaGrid[0].length; metax++) {
                    for (let x = 0; x < metaGrid[0][0].width; x++) {
                        strip += Navatar.SYMBOLS[metaGrid[metay][metax].colorAt(x, lineInRow)];
                    }

                    strip += '|';
                }

                console.log(strip);
            }

            console.log(horizLine);
        }
    }

    static unixTime2Hex () {
        return Math.floor(Date.now() / 1000)
            .toString(16);
    }

    // LATER Also print the phonemic form of the id from covonym.js

    static test () {
    }

    static run () {
        const unixTime = Navatar.unixTime2Hex();
        // console.log(unixTime);

        const navatar = new Navatar(unixTime, 15);

        console.log(`\n${navatar.toString()}\n`);

        // navatar.demoMany();
    }
}

Navatar.DEFAULT_WIDTH = 9;
// Favorite widths: 5 7 15 17 19 25
// NOTE widths over 43 are breaking the gridMax() calc because they exceed Number.MAX_VALUE
// Navatar.BLANKGRID_RES = 3;
Navatar.SYMBOLS = ['  ', '██'];

// Run
Navatar.run();
