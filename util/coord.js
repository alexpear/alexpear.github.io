'use strict';

// TODO make this name lowercase.
var Util = require('./util.js');

class Coord {
    // Later can have a array of dimensions, instead of r and c props.
    constructor (x, y) {
        this.x = Util.default(x, 0);
        this.y = Util.default(y, 0);
    }

    // get x () {
    //     // TODO is mapping r to x totally wrong, even in the short term?
    //     return this.r;
    // }

    // get y () {
    //     return this.c;
    // }
    
    equals (other) {
        return this.x === other.x && this.y === other.y;
    }

    is (other) { return this.equals(other); }

    plus (other) {
        return new Coord(
            this.x + other.x,
            this.y + other.y
        );
    }

    plus1d (distance) {
        return new Coord(
            this.x + distance,
            this.y
        );
    }

    // For circular environments of a given circumference. The values can loop around again to 0.
    plus1dCircle (distance, circumference) {
        return new Coord(
            (this.x + distance) % circumference,
            this.y
        );
    }

    minus (other) {
        return new Coord(
            this.x - other.x,
            this.y - other.y
        );
    }

    distanceTo (other) {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) +
            Math.pow(this.y - other.y, 2)
        );
    }

    manhattanDistanceTo (other) {
        const horizontal = Math.abs(this.x - other.x);
        const vertical = Math.abs(this.y - other.y);

        return horizontal + vertical;
    }

    // LATER confirm how much faster this is than distanceTo, using whatever sort of speed test.
    approximateDistanceTo (other) {
        // 1 - (1 / sqrt(2))
        const MAX_ADJUSTMENT = 0.29289321881345254;

        const horizontal = Math.abs(this.x - other.x);
        const vertical = Math.abs(this.y - other.y);

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
        return '[' + this.x + ',' + this.y + ']';
    }

    to1dString () {
        return this.x.toString();
    }

    randomAdjacent () {
        do {
            var candidateNeighbor = Coord.randomDirection().plus(this);
        } while (! candidateNeighbor.isInBounds());

        return candidateNeighbor;
    }

    static random (xCount, yCount) {
        if (! Util.exists(xCount)) {
            console.log('ERROR: Coord.random() called without r argument');
            return new Coord(-1,-1);
            // LATER throw exception, make supervisor reboot, et cetera.
        }

        const c = yCount ?
            Util.randomUpTo(yCount - 1) :
            0;

        return new Coord(
            Util.randomUpTo(xCount-1),
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
