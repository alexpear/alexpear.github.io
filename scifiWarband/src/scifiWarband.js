'use strict';

// Autobattler game in browser. WIP.

// npm run buildScifiWarband

const Action = require('./action.js');
const Creature = require('./creature.js');
const Event = require('./event.js');
// const Item = require('./item.js');
const Squad = require('./squad.js');
const Templates = require('./templates.js');
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

    // This function is the mind of the squad.
    // Allowed to return illegal moves.
    chooseActions (curSquad) {
        const sentiments = this.creatures.map(cr => cr.morale());
        // LATER morale can inform chooseActions()

        // A squad may do ONE action (eg move OR attack) each turn.
        const movePlan = this.desiredMove();
        const attackPlan = this.desiredAttack();
        // LATER replace these 2 local vars with array of several possible actions. this.desiredActions() => actionInfo[]

        const roll = Math.random() * (movePlan.desire + attackPlan.desire);

        if (roll <= movePlan.desire) {
            return [Action.move(curSquad, movePlan.coord)];
        }
        else {
            return [Action.attack(curSquad, attackPlan.target)];
        }
    }

    // If action sequence is illegal, interpret/default to a legal move.
    performActions (actions) {
        let nonFrees = 0;

        for (let action of actions) {
            if (! action.isFree()) {
                nonFrees += 1;
                // Only allow 1 nonfree action
                if (nonFrees >= 2) {
                    continue; 
                }
            }

            this.performAction(action);
        }
    }

    performAction (action) {
        // LATER check for illegal actions.

        const squad = action.subject;
        const distance = squad.coord.distanceTo(action.target);
        squad.ready = false;

        if (action.type === Action.TYPE.Move) {
            if (distance > squad.speed()) {
                Util.logError(`Illegal action submitted, can't move that far: ${action.toString()}`);
                // LATER interpret as a more reasonable move.
                return;
            }

            squad.coord = action.target;
            return;
        }

        if (action.type === Action.TYPE.Attack) {
            if (! squad.canSee(action.target)) {
                Util.logError(`Illegal action submitted, can't see target squad: ${action.toString()}`);
                // LATER interpret as a more reasonable action.
                return;
            }

            const events = squad.attack(action.target);
            this.record(events);
            this.drawAttack(squad, action.target);

            return;
        }

        // LATER more action types
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
            if (! squad.canSee(thing)) { continue; }

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
                    Templates.Halo.UNSC.Squad.Marine,
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

    canSee (otherSquad) {
        return otherSquad.stealth < this.distanceTo(otherSquad);
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

    drawAttack (squad, target) {
        this.drawAttackXY(
            squad.coord.x,
            squad.coord.y,
            target.coord.x,
            target.coord.y
        );
    }

    // Inputs should be in grid coords, not pixel coords.
    drawAttackXY (startX, startY, endX, endY) {
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
            Squad.example('Marine'),
            Squad.example('Marine'),
            Squad.example('Grunt'),
            Squad.example('Grunt'),
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

        game.runEncounter();
        game.explainOutcome();

        game.testNearestFoes();
    }
}

ScifiWarband.WINDOW_SQUARES = 10; // number of squares
ScifiWarband.DEFAULT_SQUARE_SIZE = 4; // meters
ScifiWarband.SQUARE_PIXELS = 60;

// LATER new file
class Item {
    
}

module.exports = ScifiWarband;

ScifiWarband.run();
