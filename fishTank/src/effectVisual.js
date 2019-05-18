'use strict';

// A EffectVisual is the front-end visual representation of a action or effect in the game world.
// It can represent a bullet animation, a explosion, or other animation.
// EffectVisuals typically last for several frames after the event they represent, then they vanish and are forgotten.
// EffectVisual are strictly part of the view, not part of the model. They serve to explain.
// When zooming out, EffectVisuals may change size, vanish, or start to appear.
// EffectVisuals may be rendered as a yellow line between a soldier and a target, for example.

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');
const WNode = require('../../wnode/wnode.js');

class EffectVisual {
    constructor (type, coord, targetCoord) {
        this.type = type || EffectVisual.TYPE.Explosion;
        this.coord = coord;
        this.targetCoord = targetCoord;
        this.parent = undefined;
        this.image = undefined;
        this.color = undefined;

        // We animate projectiles differently depending on whether they hit or miss.
        this.hit = true;
        this.timeLeft = 100; // Later init this properly
    }

    static newBallistic (coord, targetCoord, hit, color) {
        const visual = new EffectVisual(EffectVisual.TYPE.Ballistic, coord, targetCoord);
        visual.hit = hit || true;
        visual.color = color || 'FFFF00';

        return visual;
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

EffectVisual.TYPE = Util.makeEnum([
    'Ballistic',
    'Explosion',
    'Forcefield',
    'Surprise'
]);

module.exports = EffectVisual;

// EffectVisual.run();
