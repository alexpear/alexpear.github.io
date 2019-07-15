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
};

