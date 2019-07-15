'use strict';

// TODO make this name lowercase.
var Util = require('./util.js');

class Coord {
    // Later can have a array of dimensions, instead of r and c props.
    constructor (r,c) {
        this.r = Util.default(r, -1);
        this.c = Util.default(c, -1);
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

    magnitude () {
        return this.distanceTo(new Coord(0,0));
    }

    isAdjacentTo (other) {
        var distance = this.distanceTo(other);

        // ODDITY: i made the bounds approximate for some reason.
        return 0.9 < distance && distance < 1.5;
    }

    toString () {
        return '[' + this.r + ',' + this.c + ']';
    }

    static random (rCount, cCount) {
        if (!rCount || !cCount) {
            console.log('ERROR: Coord.random() called without arguments');
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
        return Util.randomOf(Coord.relatives);
    }

    randomAdjacent () {
        do {
            var candidateNeighbor = Coord.randomDirection().plus(this);
        } while (! candidateNeighbor.isInBounds());

        return candidateNeighbor;
    }
};

// Death Planet Fish Tank wants a cm resolution.
Coord.DECIMAL_PLACES = 2;

module.exports = Coord;