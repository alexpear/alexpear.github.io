'use strict';

// Autobattler game in browser. WIP.

// npm run buildScifiWarband

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');



// LATER might split into multiple classes: WarbandGame.js, Encounter.js, EncounterView.js, as needed.
class ScifiWarband {
    constructor () {
        this.things = [];
        this.canvas = document.getElementById('canvas');
        this.canvasCtx = canvas.getContext('2d');
        this.events = [
            // Event.encounterStart()
        ];
    }

    async runEncounter () {
        const firstTeam = Squad.TEAM.Enemy; // LATER could depend upon who is attacker/defender.
        const secondTeam = Squad.TEAM.Player;
        let curTeam = firstTeam;

        for (let t = 1; t <= 100; t++) {
            for (let activation = 1; activation <= 1e5; activation++) {
                if (this.encounterDone()) { return; }

                const curSquad = this.findReadySquad(curTeam);

                if (! curSquad) { continue; } // This is normal for the team with less squads at the end of the round.

                this.record(
                    curSquad.update()
                );

                const actions = this.chooseActions(curSquad);

                this.performActions(actions);

                this.setHTML();
                await Util.sleep(1);
                // LATER Let user step forwards or back (event by event) thru the replay, instead of sleep()ing.
            }
        }
    }

    record (events) {
        this.events = this.events.concat(events);
    }

    encounterDone () {
        // TODO If only one Team has non-KO Squads, return true.
    }

    findReadySquad (team) {
        return this.things.find(
            thing => thing.ready && thing.team === team
        );
    }

    /* Actions
    Move
    Take Cover
    Attack with <weapon>
    Grab Item (free)
    Secure Objective
    First Aid
    Special Action
    */

    // This function is the mind of the squad.
    // Allowed to return illegal moves.
    chooseActions (curSquad) {
        const sentiments = this.creatures.map(cr => cr.morale());
        // LATER morale can inform chooseActions()

    }

    // If action sequence is illegal, interpret/default to a legal move.
    performActions (actions) {
        // Roll random chances
        // Update game state
        // this.record(events)
    }

    setHTML () {
        this.drawGrid();
    }

    drawGrid () {
        // TODO reset canvas

        for (let y = 0; y < ScifiWarband.WINDOW_SQUARES; y++) {
            for (let x = 0; x < ScifiWarband.WINDOW_SQUARES; x++) {
                const things = this.contentsOfCoord(x, y);

                if (things.length === 0) {
                    this.drawSquare(Squad.IMAGE_PREFIX + 'sand.jpg', x, y);
                }
                else {
                    const thing = things[0];
                    this.drawSquare(thing.imageURL(), x, y);

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

    // Returns array of nearest foe - or foes tied for same distance.
    nearestFoes (squad) {
        let nearests = [];
        let shortestDist = 99999; // unit: squares

        for (let thing of this.things) {
            if (thing.team === squad.team) { continue; }
            
            const dist = squad.distanceTo(thing);
            if (dist < shortestDist) {
                nearests = [thing];
            }
            else if (dist === shortestDist) {
                nearests.push(thing);
            }

            // NOTE - speeding up this func further (eg via Manhattan distance 1st pass) seems unnecessary: 0.00006 seconds per nearestFoes() call.
        }

        return nearests;
    }

    testNearestFoes () {
        this.things = [];

        // Create 200 squads at random coords & teams
        for (let i = 0; i < 200; i++) {
            this.things.push(
                new Squad(
                    Squad.TEMPLATES.Marines,
                    Util.randomOf([Squad.TEAM.Player, Squad.TEAM.Enemy]),
                    Coord.random2d(10)
                )
            );
        }
        // log start time & save in local variable
        const startDate = new Date();
        Util.logDebug(`testNearestFoes() starting test at ${startDate.getUTCMilliseconds()}`);
        
        // call nearestFoes for each squad
        for (let sq of this.things) {
            const unused = this.nearestFoes(sq);
        }
        
        // log total time spent & time per call
        const endDate = new Date();
        const ms = endDate - startDate;
        Util.logDebug(`testNearestFoes() ending test at ${endDate.getUTCMilliseconds()}\n  Total time was ${ms / 1000} seconds, or ${ms / 1000 / this.things.length} seconds per nearestFoes() call.`);
    }

    drawSquare (imageURL, x, y) {
        const imgElement = new Image();
        imgElement.src = imageURL;

        imgElement.onload = () => this.drawLoadedImage(imgElement, x, y);
    }

    drawLoadedImage (imgElement, x, y) {
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

        this.canvasCtx.drawImage(
            imgElement, 
            this.cornerOfSquare(x),
            this.cornerOfSquare(y),
            width,
            height
        );
    }

    // Returns canvas pixel value of the top left corner of the square in the x axis. Also works for y axis.
    cornerOfSquare (x) {
        return x * ScifiWarband.SQUARE_PIXELS * 1.1 + (ScifiWarband.SQUARE_PIXELS * 0.1);
    }

    centerOfSquare (x) {
        return this.cornerOfSquare(x) + ScifiWarband.SQUARE_PIXELS * 0.5;
    }

    // Inputs should be in grid coords, not pixel coords.
    drawAttack (startX, startY, endX, endY) {
        // TODO - draw muzzle flash ray-lines at start
        // TODO line traits & colors
        this.canvasCtx.moveTo(
            this.centerOfSquare(startX),
            this.centerOfSquare(startY),
        );
        this.canvasCtx.lineTo(
            this.centerOfSquare(endX),
            this.centerOfSquare(endY),
        );

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = "yellow";
        this.canvasCtx.stroke();
    }

    explainOutcome () {
        // TODO Present outcome to user.
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

    static async run () {
        const game = new ScifiWarband();
        game.exampleSetup();
        game.setHTML();

        await Util.sleep(1);
        game.drawAttack(
            Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
            Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
            Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
            Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
        );

        // game.runEncounter();
        game.explainOutcome();

        game.testNearestFoes();
    }
}

ScifiWarband.WINDOW_SQUARES = 10; // number of squares
ScifiWarband.DEFAULT_SQUARE_SIZE = 4; // meters
ScifiWarband.SQUARE_PIXELS = 60;

// TODO new file
class Event {
    constructor (type, t, details) {
        this.timestamp = new Date();
        this.type = type;
        this.details = details || {};

        this.log();
    }

    log () {
        Util.logEvent(`${this.type}: ${Util.stringify(this.details)}`);
    }

    toJson () {

    }

    static encounterStart () {
        return new Event(0, Event.TYPE.EncounterStart);
    }

    static attack (t, attackingCreature, target, weaponTemplate, attackOutcome, shieldsTo, statusChanges) {
        return new Event(
            t,
            Event.TYPE.Attack,
            {
                target,
                weaponTemplate,
                attackOutcome,
                shieldsTo,
                statusChanges,
            }
        )
    }
}

Event.TYPE = {
    EncounterStart: 'Encounter Start',
    Attack: 'Attack',
};

// TODO new file
class Creature {
    constructor (creatureTemplate) {
        this.template = creatureTemplate;
        this.shields = this.template.shields || 0;
        this.cooldownEnds = Infinity;

        // Used to track buffs, debuffs, injuries, whether ko, etc.
        this.status = {};
    }

    isKO () {
        return !! this.status.ko;
    }

    // creates Event
    update (t) {
        // cooldowns, shield regen, etc
        if (this.cooldownEnds <= t) {
            if (this.shields < this.template.shields) {
                this.shields += 
            }

            this.cooldownEnds = Infinity;

        }
        // Note: Morale checks should probably be initiated at the squad level rather than here
    }

    // returns number in range [-10, 10]
    // For squads to poll their members' perspectives.
    morale () {
        return 5; // Later add complexity
    }

    // Could move this to main encounter class if that makes cover calc easier.
    // creates Event
    attack (otherSquad) {
        // Choose weapon
        // Roll randomness
        // save Event
    }

    // After considering cover.
    // creates Event
    takeHit (projectile) {
        // Decrease shields & damage
        // Compare remaining damage to durability
        // Random effect
        // Edit this.status
        // create Event
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
        durability: 10,
    },
    // LATER How does damage work for: Scorpion, Scarab, UNSC Frigate?
};

// TODO new file.
class Squad {
    constructor (squadTemplate, team, coord) {
        this.template = squadTemplate;
        this.team = team;
        this.coord = coord || new Coord();
        this.ready = true;
        this.creatures = [];

        // Note that this is how you create a homogenous squad from a template. LATER, might often have heterogenous squads coming from customization choices or from a save file.
        for (let i = 1; i <= this.template.quantity; i++) {
            this.creatures.push(
                new Creature(this.template.creature)
            );
        }
    }

    isKO () {
        return this.creatures.every(
            cr => cr.isKO()
        );
    }

    // unit: squares
    distanceTo (otherSquad) {
        return this.coord.distanceTo(otherSquad.coord);
    }

    update () {
        this.creatures.map(cr => cr.update());
    }

    imageURL () {
        return Squad.IMAGE_PREFIX + this.template.image;
    }

    static example (team) {
        const sq = new Squad(
            Squad.TEMPLATES.Marines,
            team || Squad.TEAM.Player,
            Coord.random2d(10),
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
