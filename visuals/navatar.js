// Represent a number as a cool symmetrical grid image.
// Many to 1 mapping, because visually noisy features are polished out.

class Navatar {
    constructor (id, width) {
        this.id = Util.exists(id) ?
            id :
            Math.random() * 1e27;

        this.width = width || Navatar.DEFAULT_WIDTH;
        // this.color = // LATER
        this.halfGrid = this.rawHalfGrid();
        this.polish();
    }

    // Returns the left half, including the middle column.
    rawHalfGrid () {
        const halfGrid = [...Array(this.width)];
        const middleColumn = this.middleColumn();
        const columns = Math.ceil(this.width / 2);

        // Maximum number that could be encoded by this grid.
        const gridMax = Math.pow(2, this.width * columns);
        const seed = Math.ceil(this.id) % gridMax;

        for (let y = 0; y < halfGrid.length; y++) {
            for (let x = 0; x <= middleColumn; x++) {

            }
        }
    }

    middleColumn () {
        return Math.floor(this.width / 2);
    }

    polish () {

    }

    toString () {
    }

    static test () {
    }

    static run () {
    }
}

Navatar.DEFAULT_WIDTH = 9;

// Run
Navatar.run();
