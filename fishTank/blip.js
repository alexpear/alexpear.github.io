'use strict';

// A Blip is the front-end visual representation of 1 or more objects or warriors in the FishTank world.
// It can represent a large squad or regiment when the view is zoomed out a lot.
// Blips are strictly part of the view, not part of the model. They serve to explain.
// When zooming out, many Blips may be instantly forgotten and new ones created. The new ones refer to larger groups of warriors.
// Each Blip is associated with a array of WNode trees, which the Blip represents.
// Blips are centered on the approximate position of the represented warriors. Blips should be rendered at a size corresponding with how large and numerous the warriors are.

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const WNode = require('../wnode/wnode.js');

class Blip {
    constructor (wnodes) {
        this.nodes = wnodes || [];
        this.image = undefined;
        this.coord = undefined;
    }

    loadImage () {

    }

    getImage () {
        // Hmm ... i suppose we will need to know the FishTank's meters per pixel ratio (zoom).
        // Maybe the resizing should be done in class FishTank.
        const size = this.size();
        // Placeholder
        return this.image;
    }

    size () {
        // Replace this placeholder later
        return 100 * this.nodes.length + 100;
    }
}

module.exports = Blip;

// Blip.run();
