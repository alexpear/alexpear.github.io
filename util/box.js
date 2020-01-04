'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

// A rectangular space described by the coordinates of 2 opposite corners.
// Later, it can be 2D or 3D depending on the dimensionality of the corner Coords.
module.exports = class Box {
    constructor (coordA, coordB) {
        this.cornerA = coordA;
        this.cornerB = coordB;
    }

    randomCoord () {
        return new Coord(
            Util.randomRange(this.cornerA.r, this.cornerB.r, Coord.DECIMAL_PLACES),
            Util.randomRange(this.cornerA.c, this.cornerB.c, Coord.DECIMAL_PLACES)
        );
    }

    // Input: number[], in meters
    // corner A will be the origin 0,0
    static ofDimensions(dimensions) {
        dimensions = dimensions || [Coord.SCREEN_WIDTH, Coord.SCREEN_HEIGHT];

        // Later can add support for flexible number of dimensions
        return new Box(
            new Coord(0,0),
            new Coord(dimensions[0], dimensions[1])
        );
    }
};

