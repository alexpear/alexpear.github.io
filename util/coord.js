'use strict';

// TODO make this name lowercase.
var Util = require('./util.js');

class Coord {
    // Later can have a array of dimensions, instead of r and c props.
    constructor (r,c) {
        this.r = Util.default(r, -1);
        this.c = Util.default(c, -1);
    }

    get x () {
        // TODO is mapping r to x totally wrong, even in the short term?
        return this.r;
    }

    get y () {
        return this.c;
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

    manhattanDistanceTo (other) {
        const horizontal = Math.abs(this.r - other.r);
        const vertical = Math.abs(this.c - other.c);

        return horizontal + vertical;
    }

    // LATER confirm how much faster this is than distanceTo, using whatever sort of speed test.
    approximateDistanceTo (other) {
        // 1 - (1 / sqrt(2))
        const MAX_ADJUSTMENT = 0.29289321881345254;

        const horizontal = Math.abs(this.r - other.r);
        const vertical = Math.abs(this.c - other.c);

        // 0 means 45°, 1 means 0° or 90°
        const orthagonalness = Math.abs(horizontal - vertical) / Math.max(horizontal, vertical);

        // adjustment is supposed to vary between around 1/sqrt(2) and 1
        const adjustment = 1 - (MAX_ADJUSTMENT * orthagonalness);

        return (horizontal + vertical) * adjustment;
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

    randomAdjacent () {
        do {
            var candidateNeighbor = Coord.randomDirection().plus(this);
        } while (! candidateNeighbor.isInBounds());

        return candidateNeighbor;
    }

    static random (rCount, cCount) {
        if (! (Util.exists(rCount) || Util.exists(cCount))) {
            console.log('ERROR: Coord.random() called without arguments');
            return new Coord(-1,-1);
            // LATER throw exception, make supervisor reboot, et cetera.
        }

        const c = cCount ?
            Util.randomUpTo(cCount - 1) :
            0;

        return new Coord(
            Util.randomUpTo(rCount-1),
            c
        );
    }

    static get relatives () {
        return [
            new Coord(-1,-1), new Coord(-1,0), new Coord(-1,1),
            new Coord( 0,-1),                  new Coord( 0,1),
            new Coord( 1,-1), new Coord( 1,0), new Coord( 1,1)
        ];
    }

    // Designed for discrete 2d grids.
    static randomDirection () {
        return Util.randomOf(Coord.relatives);
    }

    // Returns random position in a distribution that is convenient to display on one screen.
    static randomOnScreen () {
        return new Coord(
            // 2 decimal places (centimeter precision)
            Util.randomRange(0.5, Coord.SCREEN_WIDTH, 2),
            Util.randomRange(0.5, Coord.SCREEN_HEIGHT, 2)
        );
    }

    static randomInSquare (minVal, maxValExclusive) {
        return new Coord(
            // 2 decimal places (centimeter precision)
            Util.randomRange(minVal, maxValExclusive, 2),
            Util.randomRange(minVal, maxValExclusive, 2)
        );
    }
};

// Unit: meters
Coord.SCREEN_WIDTH = 23;
Coord.SCREEN_HEIGHT = 13;

// Death Planet Fish Tank wants a cm resolution.
Coord.DECIMAL_PLACES = 2;

module.exports = Coord;
