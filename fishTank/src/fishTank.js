const Util = require('../../util/util.js');
const Timeline = require('../../battle20/timeline.js');

const WIDTH = 1200;
const HEIGHT = 700;

const Constants = {
    width: WIDTH,
    height: HEIGHT,
    factions: {
        unsc: 'unsc',
        covenant: 'covenant'
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

const Individual = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    // Constructor
    initialize: function Individual (scene, x, y, spriteName, faction) {
        Phaser.GameObjects.Image.call(this, scene, x, y, spriteName);

        this.xSpeed = 0;
        this.ySpeed = 0;

        this.faction = faction || Util.randomFromObj(Constants.factions);

        // BTW the first to be created sees empty children arrays.
        this.target = this.randomEnemy() || Constants.objective;

        this.setBlendMode(0);
    },

    // Updates the position each cycle
    update: function (time, delta) {
        maybeClearGraphics(time);

        this.orient();
        this.maybeShoot();

        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
    },

    maybeShoot: function () {
        if (this.target && this.target.active && Math.random() <= Constants.shootChance) {
            this.shoot();
        }
    },

    shoot: function (target) {
        target = target || this.target || Constants.objective;

        const trajectory = new Phaser.Geom.Line(this.x, this.y, target.x, target.y);
        graphics.strokeLineShape(trajectory);

        if (target.visible) {
            target.setActive(false);
            target.setVisible(false);
        }
    },

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

let graphics;
let graphicsLastCleared = 0;
let controls;
let player;
let timeline;
let unscSquads;
let covenantSquads;
let text;

const game = new Phaser.Game(config);

function preload () {
    this.load.path = 'sprites/';
    this.load.image('soldier', 'fishTankSoldier.png');
    this.load.image('crate', 'assets/sprites/crate.png');
}

function deploySquads (faction) {
    for (let i = 0; i < 100; i++) {
        const faction = Util.randomFromObj(Constants.factions);
        const start = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);
        let squad;

        if (faction === Constants.factions.unsc) {
            squad = unscSquads.create(1000, start.y, 'soldier', faction);
            squad.speed = 0.1;
        }
        else {
            squad = covenantSquads.create(100, start.y, 'soldier', faction);
            squad.speed = 0.15;
        }
    }

    text.setText(`Death Planet, Population ${(unscSquads.length + covenantSquads.length) || 'You'}`);
}

function create () {
    // timeline = new Timeline();

    graphics = this.add.graphics({
        lineStyle: {
            width: 4,
            color: 0xaaaa00
        }
    });

    graphics.fillStyle(0x004400);

    this.physics.world.setBounds(0, 0, Constants.width, Constants.height);

    unscSquads = this.physics.add.group({
        classType: Individual,
        runChildUpdate: true
    });

    covenantSquads = this.physics.add.group({
        classType: Individual,
        runChildUpdate: true
    });

    // Yikes, looks like im lucky it bound 'this' for me.
    this.time.addEvent({ delay: 500, callback: deploySquads, callbackScope: this});

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(100, 100, 'crate');

    player.setCollideWorldBounds(true);

    // Later probably have the soldiers collide with each other too.
    this.physics.add.collider(player, covenantSquads);

    text = this.add.text(10, 10, 'Total: 0', { font: '16px Courier', fill: '#ffffff' });
}

function update (time, delta) {
    // See example: http://labs.phaser.io/edit.html?src=src/games/topdownShooter/topdown_combatMechanics.js

    // timeline.computeNextInstant();

    // TODO
    // maybeReinforce(time);

    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-500);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-500);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(500);
    }
}

function maybeReinforce (time) {
    // This may be easier to do after integrating Timeline
}

function maybeClearGraphics (time) {
    if (time - graphicsLastCleared >= Constants.clearGraphicsEvery) {
        graphics.clear();
        graphicsLastCleared = time;
    }
}


function enemyOfFaction (goodGuys) {
    return goodGuys === Constants.factions.unsc ?
        Constants.factions.covenant :
        Constants.factions.unsc;
}

// Later implement notThisOne exclusion functionality.
function randomFromFaction (faction, notThisOne) {
    const group = faction === Constants.factions.unsc ? unscSquads : covenantSquads;

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