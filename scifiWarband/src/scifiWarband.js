'use strict';

//

// browserify scifiWarband/src/*.js -o scifiWarbandBundle.js

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');



class ScifiWarband {
    constructor () {
        this.things = [];
    }

    setHtml () {
        const canvas = document.getElementById('canvas');
        this.drawGrid();
    }

    drawGrid () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < ScifiWarband.WINDOW_SQUARES; y++) {
            for (let x = 0; x < ScifiWarband.WINDOW_SQUARES; x++) {
                const things = this.contentsOfCoord(x, y);

                if (things.length === 0) {
                    this.drawSquare(Squad.IMAGE_PREFIX + 'sand.jpg', x, y);
                    // this.drawSquare(thing.imageURL(), x, y);
                }
                else {
                    const thing = things[0];
                    const imgElement = new Image();
                    imgElement.src = thing.imageURL();

                    let width;
                    let height;
                    if (imgElement.naturalWidth >= imgElement.naturalHeight) {
                        width = ScifiWarband.SQUARE_PIXELS;
                        height = imgElement.naturalHeight / imgElement.naturalWidth * ScifiWarband.SQUARE_PIXELS;
                    }
                    else {
                        width = imgElement.naturalWidth / imgElement.naturalHeight * ScifiWarband.SQUARE_PIXELS;
                        height = ScifiWarband.SQUARE_PIXELS;
                    }

                    ctx.drawimage(
                        imgElement, 
                        x * ScifiWarband.SQUARE_PIXELS, 
                        y * ScifiWarband.SQUARE_PIXELS,
                        width,
                        height
                    );

                    // TODO draw squad
                    // this.drawSquare(things, x, y);

                    // ctx.drawimage(img1, 0, 0);

                    if (things.length >= 2) {
                        Util.logDebug(`Coord ${x}, ${y} contains ${things.length} things, BTW.`);
                    }
                }
            }
        }

    }

    // Returns Squad[]
    contentsOfCoord (x, y) {
        return this.things.filter(
            t => t.coord.dimensions[0] === x &&
                t.coord.dimensions[1] === y
        );
    }

    exampleSetup () {
        this.things = this.exampleSquads();
    }

    exampleSquads () {
        return [
            Squad.example(),
            Squad.example(),
            Squad.example(Squad.TEAM.Enemy),
            Squad.example(Squad.TEAM.Enemy),
        ];
    }

    static run () {
        const game = new ScifiWarband();
        game.exampleSetup();

        game.setGridHtml();
    }
}

ScifiWarband.WINDOW_SQUARES = 10; // number of squares
ScifiWarband.DEFAULT_SQUARE_SIZE = 4; // meters
ScifiWarband.SQUARE_PIXELS = 60;

// TODO new file
class Creature {
    constructor (creatureTemplate) {
        this.template = creatureTemplate;
        this.sp = this.template.sp;
    }

    static example () {
        const cr = new Creature(
            Creature.TEMPLATES.Marine
        );

        return cr;
    }
}

// TODO move this and Squad.TEMPLATES to a Codex.js file
Creature.TEMPLATES = {
    Marine: {
        size: 2, 
        speed: 1, 
        sp: 10,
    },
};

// TODO new file.
class Squad {
    constructor (squadTemplate, allegiance, coord) {
        this.template = squadTemplate;
        this.quantity = this.template.quantity;
        this.allegiance = allegiance;
        this.coord = coord || new Coord();
    }

    imageURL () {
        return Squad.IMAGE_PREFIX + this.template.image;
    }

    static example (allegiance) {
        const sq = new Squad(
            Squad.TEMPLATES.Marines,
            allegiance || Squad.TEAM.Player,
            Coord.random(10),
        );

        return sq;
    }
}

Squad.TEAM = {
    Player: 'player',
    Enemy: 'enemy',
};

Squad.IMAGE_PREFIX = 'https://alexpear.github.io/gridView/images/';

Squad.TEMPLATES = {
    Marines: {
        name: 'Marine Fireteam',
        creature: Creature.TEMPLATES.Marine,
        quantity: 3,
        image: 'marine.png',
    },
};

module.exports = ScifiWarband;

ScifiWarband.run();
