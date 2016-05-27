'use strict';

module.exports = class Coord {
    constructor (r,c) {
        this.r = r || -1;
        this.c = c || -1;
    }

    equals (other) {
        return this.r === other.r && this.c === other.c;
    }

    is (other) { return this.equals(other); }

    plus (other) {
        return new Coord(
            this.r + other.r,
            this.c + other.c
        );
    }

    minus (other) {
        return new Coord(
            this.r - other.r,
            this.c - other.c
        );
    }

    distanceTo (other) {
        return Math.sqrt(
            Math.pow(this.r - other.r, 2) +
            Math.pow(this.c - other.c, 2)
        );
    }

    isInBounds (rowCount, colCount) {
        return 0 <= this.r && this.r < rowCount
            && 0 <= this.c && this.c < colCount;
    }

    toString () {
        return '[' + this.r + ',' + this.c + ']';
    }

    static get relatives () {
        return [
            new Coord(-1,-1), new Coord(-1,0), new Coord(-1,1),
            new Coord( 0,-1),                  new Coord( 0,1),
            new Coord( 1,-1), new Coord( 1,0), new Coord( 1,1)
        ];
    }

    static randomAdjacent () {
        return this.relatives[ Math.floor(Math.random() * this.relatives.length) ]
            .plus(this);
    }
};

// Coord.ne = new Coord(-1, 1);
