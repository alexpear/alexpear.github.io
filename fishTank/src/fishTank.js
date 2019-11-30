'use strict';

const Coord = require('../../util/coord.js');
const Timeline = require('../../bottleWorld/timeline.js');
const Util = require('../../util/util.js');
const DeathPlanetWorldState = require('../../bottleWorld/deathPlanetWorldState.js');

// Unit: Pixels
// These describe the width and height in pixels of the display area
const WIDTH = 1200;
const HEIGHT = 700;

// Pixel (0,0) is the top left corner of the display area
// This is the Coord represented by pixel (0,0)
const originCoord = new Coord(0,0);
const metersPerPixel = 1 / 50;

const Constants = {
    width: WIDTH,
    height: HEIGHT,
    factions: {
        unsc: 'UNSC',
        covenant: 'Covenant'
    },
    objective: {
        x: WIDTH / 2,
        y: HEIGHT / 2
    },
    shootChance: 0.01,
    clearGraphicsEvery: 200  // ms
};

// Rough draft example version came from http://labs.phaser.io/edit.html?src=src/physics/arcade/mass%20collision%20test.js
const config = {
    type: Phaser.WEBGL,
    width: Constants.width,
    height: Constants.height,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            useTree: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Analogous to Blip, in that it is a front-end representation of a Thing
const Individual = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    // Constructor, called by create()
    initialize: function Individual (scene, x, y, spriteName, thing) {
        // console.log(`Individual.initialize(), at position ${x}, ${y}.`);

        Phaser.GameObjects.Image.call(this, scene, x, y, spriteName);

        this.thing = thing;

        this.speed = this.thing.template.speed || 1;

        this.xSpeed = 0;
        this.ySpeed = 0;

        // Later Phaser GameObjects should be the view that portrays the underlying WorldState model.
        this.faction = this.thing.template.alignment || Util.randomFromObj(Constants.factions);

        // BTW the first to be created sees empty children arrays.
        this.target = this.randomEnemy() || Constants.objective;

        this.setBlendMode(0);
    },

    // Updates the position each cycle
    update: function (time, delta) {
        maybeClearGraphics(time);

        if (! this.thing.active) {
            this.setActive(false);
            this.setVisible(false);

            return;
        }

        this.orient();

        const pixelPosition = coordToPixel(this.thing.coord);

        this.x = pixelPosition.x;
        this.y = pixelPosition.y;
    },

    // shoot: function (target) {
    //     target = target || this.target || Constants.objective;

    //     const trajectory = new Phaser.Geom.Line(this.x, this.y, target.x, target.y);
    //     fishTank.graphics.strokeLineShape(trajectory);

    //     if (target.visible) {
    //         target.setActive(false);
    //         target.setVisible(false);
    //     }
    // },

    // Sets xSpeed and ySpeed correctly
    orient: function () {
        if (! (this.target && this.target.active)) {
            this.target = this.randomEnemy() || Constants.objective;
        }

        const dest = this.target;

        // If at destination, stop and relax.
        if (Math.abs(dest.x - this.x) <= 2 && Math.abs(dest.y - this.y) <= 2) {
            this.xSpeed = 0;
            this.ySpeed = 0;
            return;
        }

        this.direction = Math.atan( (dest.x - this.x) / (dest.y - this.y) );

        if (dest.y >= this.y) {
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }

        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, dest.x, dest.y) + (Math.PI / 2);
    },

    randomEnemy: function () {
        return randomFromFaction(
            enemyOfFaction(this.faction)
        );
    }
});

const game = new Phaser.Game(config);
let fishTank;

// TODO make these nomadic functions into member functions of a class FishTankView.
function preload () {
    this.load.path = 'sprites/';
    this.load.image('soldier', 'fishTankSoldier.png');
}

function deploySquads (faction) {
    for (let i = 0; i < 100; i++) {
        const template = {
            faction: Util.randomFromObj(Constants.factions)
        };

        const start = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);
        let squad;

        if (template.faction === Constants.factions.unsc) {
            template.speed = 0.1;

            // Call the Individual constructor
            squad = fishTank.worldState.squads.unsc.create(1000, start.y, 'soldier', template);
        }
        else {
            template.speed = 0.15;
            squad = fishTank.worldState.squads.covenant.create(100, start.y, 'soldier', template);
        }
    }
}

function depictThings () {
    console.log(`Top of depictThings()`);

    const individuals = fishTank.worldState.activeThings()
        .map(thing => {
                const pixelPosition = coordToPixel(thing.coord);
                const individual = fishTank.worldState.squads.unsc.create(pixelPosition.x, pixelPosition.y, 'soldier', thing);

                // console.log(`depictThings(), just called create()`);

                return individual;
            }
        );
}

function create () {
    console.log('Top of FishTank create()');

    const worldState = DeathPlanetWorldState.test();

    console.log('FishTank create() after DeathPlanetWorldState instantiated');

    fishTank = window.fishTank = {
        game: game,
        graphics: this.add.graphics({
            lineStyle: {
                width: 4,
                color: 0xaaaa00
            }
        }),
        graphicsLastCleared: 0,
        text: undefined,
        timeline: worldState.timeline,
        worldState: worldState
    };

    this.physics.world.setBounds(0, 0, Constants.width, Constants.height);

    fishTank.graphics.fillStyle(0x004400);

    fishTank.worldState.squads = {
        unsc: this.physics.add.group({
            classType: Individual,
            runChildUpdate: true
        }),
        covenant: this.physics.add.group({
            classType: Individual,
            runChildUpdate: true
        })
    };

    // Yikes, looks like im lucky it bound 'this' for me.
    // this.time.addEvent({ delay: 500, callback: deploySquads, callbackScope: this});
    this.time.addEvent({ delay: 500, callback: depictThings.bind(this, fishTank.worldState), callbackScope: this});

    // Later probably have the soldiers collide with each other.

    fishTank.text = this.add.text(10, 10, 'Total: 0', { font: '16px Courier', fill: '#ffffff' });

    console.log(`Bottom of FishTank create()`);
}

function update (time, delta) {
    // Later
    // fishTank.worldState.computeNextInstant();

    fishTank.text.setText(`Death Planet, Population ${(fishTank.worldState.squads.unsc.countActive() + fishTank.worldState.squads.covenant.countActive()) || 'You'}`);
}

function coordToPixel (coord) {
    // Coords are in meters.
    // LATER subtract originCoord from coord
    return {
        x: coord.x / metersPerPixel,
        y: coord.y / metersPerPixel
    };
}

function maybeReinforce (time) {
    // This may be easier to do later, after integrating Timeline as the model for what happens
}

function maybeClearGraphics (time) {
    if (time - fishTank.graphicsLastCleared >= Constants.clearGraphicsEvery) {
        fishTank.graphics.clear();
        fishTank.graphicsLastCleared = time;
    }
}


function enemyOfFaction (goodGuys) {
    return goodGuys === Constants.factions.unsc ?
        Constants.factions.covenant :
        Constants.factions.unsc;
}

// Later implement notThisOne exclusion functionality.
function randomFromFaction (faction, notThisOne) {
    const group = fishTank.worldState.squads[faction];

    if (! group) {
        return undefined;
    }

    const squads = group.getChildren();
    let offset = Util.randomBelow(squads.length);

    // BTW, this has a slight bias towards active squads that are preceded by multiple inactive squads.
    // This could be made less biased by calling Math.random() in a while loop.
    // This would be slightly less performant.
    for (let k = 0; k < squads.length; k++) {
        const i = (k + offset) % squads.length;
        const candidate = squads[i];
        if (candidate.active && candidate !== notThisOne) {
            return candidate;
        }
    }

    // Case where whole faction is not active:
    return undefined;
}
