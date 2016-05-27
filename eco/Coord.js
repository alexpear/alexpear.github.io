'use strict';

var Util = require('./Util.js');

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

    static random (rCount, cCount) {
        if (!rCount || !cCount) {
            console.log('error: Coord.random() called with no arguments');
            return new Coord(-1,-1);
            // TODO throw exception, make supervisor reboot, et cetera.
        }

        return new Coord(
            Util.randomUpTo(rCount-1),
            Util.randomUpTo(cCount-1)
        );
    }

    static get relatives () {
        return [
            new Coord(-1,-1), new Coord(-1,0), new Coord(-1,1),
            new Coord( 0,-1),                  new Coord( 0,1),
            new Coord( 1,-1), new Coord( 1,0), new Coord( 1,1)
        ];
    }

    static randomDirection () {
        return Util.randomOf(coord.relatives);
    }

    randomAdjacent () {
        do {
            var candidateNeighbor = Coord.randomDirection().plus(this);
        } while (! candidateNeighbor.isInBounds());

        return candidateNeighbor;
    }
};

// Coord.ne = new Coord(-1, 1);
