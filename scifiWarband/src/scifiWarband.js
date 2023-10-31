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

        // LATER add a system to assign readable squad names to .things like 'Grunt Squad Alpha'
    }

    initSquads () {
        for (let thing of this.things) {
            thing.id = thing.template.name + ' ' + thing.id;

            console.log(thing.toJson());
        }
    }

    async runEncounter () {
        // LATER starting team could depend on who is attacker/defender, or who has most squads left at start of each round. Currently arbitrary.
        const teams = Object.keys(this.teamSummaries());
        // LATER 3-team support by indexing teams[activation % teams.length]

        for (this.t = 1; this.t <= 100; this.t++) {
            this.readySquads();
            this.logNewRound();
            // Util.log(`t=${this.t}: ${this.things.filter(t => ! t.isKO()).length} squads left.`)

            for (let activation = 1; activation <= 1e5; activation++) {
                if (this.encounterDone()) { return; }

                const teamIndex = activation % teams.length;
                const curTeam = teams[teamIndex];
                const curSquad = this.findReadySquad(curTeam);

                if (! curSquad) { continue; } // This is normal for the team with less squads at the end of the round.

                this.record(
                    curSquad.update()
                );

                const actions = this.chooseActions(curSquad);

                // Util.logDebug(`runEncounter() loop - chosen actions are: ${Util.stringify(actions.map(a => a.toJson()))}`);

                this.performActions(actions);

                await Util.sleep(1);
                this.setHTML();
                // LATER UI where user steps forwards or back (event by event) thru the replay, instead of sleep()ing.

                
            }
        }
    }

    teamSummaries () {
        const teamSummaries = {};

        for (let thing of this.things) {
            const quantity = thing.quantity();
            const squadNumber = quantity >= 1 ?
                1 :
                0;

            if (teamSummaries[thing.team]) {
                const obj = teamSummaries[thing.team];

                obj.squads += squadNumber;
                obj.headcount += quantity;
                obj.healthBar += thing.healthBar();
            }
            else {
                teamSummaries[thing.team] = {
                    squads: squadNumber,
                    headcount: quantity,
                    healthBar: thing.healthBar(),
                };
            }
        }

        return teamSummaries;
    }

    logNewRound () {
        const teamSummaries = this.teamSummaries();

        Util.log(`t=${this.t}: ${Util.stringify(teamSummaries)}`);
    }

    record (events) {
        this.events = this.events.concat(events);
    }

    encounterDone () {
        const squadCounts = {};

        for (let thing of this.things) {
            if (thing.isKO()) { continue; }

            if (squadCounts[thing.team]) {
                squadCounts[thing.team] += 1;
            }
            else {
                if (Object.keys(squadCounts).length >= 1) {
                    return false;
                }

                squadCounts[thing.team] = 1;
            }
        }

        // Util.log(squadCounts);
        // Util.log(`t=${this.t}: ${squadCounts.player} player squads vs ${squadCounts.enemy} enemy squads`);

        return Object.keys(squadCounts).length <= 1;
    }

    readySquads () {
        for (let thing of this.things) {
            thing.ready = true;
        }
    }

    findReadySquad (team) {
        return this.things.find(
            thing => thing.ready && thing.team === team
        );
    }

    // This function is the mind of the squad.
    // Allowed to return illegal moves.
    chooseActions (curSquad) {
        // Util.logDebug(curSquad.toJson());

        const sentiments = curSquad.creatures.map(cr => cr.morale());
        // LATER morale can inform chooseActions()

        // A squad may do ONE action (eg move OR attack) each turn.
        const movePlan = this.desiredMove(curSquad);
        const attackPlan = this.desiredAttack(curSquad);
        // LATER replace these 2 local vars with array of several possible actions. this.desiredActions() => actionInfo[]

        const roll = Math.random() * (movePlan.desire + attackPlan.desire);

        // Util.logDebug(`${curSquad.terse()} is thinking of attacking ${attackPlan.target.terse()}`);

        if (roll <= movePlan.desire) {
            return [Action.move(curSquad, movePlan.coord)];
        }
        else {
            return [Action.attack(curSquad, attackPlan.target)];
        }
    }

    desiredMove (curSquad) {
        const report = {};

        const nearestFoes = this.nearestFoes(curSquad);
        const foeDistance = curSquad.distanceTo(nearestFoes[0]);
        const preferredDistance = curSquad.preferredDistance();
        const positionImperfection = foeDistance - preferredDistance;

        if (Math.abs(positionImperfection) <= 0.5) {
            // Good position already.
            return {
                desire: 0
            };
        }

        return {
            coord: curSquad.coord, // LATER select nontrash coord
            desire: 0, // LATER estimate how useful it is to change position at this moment.
        };
    }

    desiredAttack (curSquad) {
        const target = this.nearestFoes(curSquad)[0];
        const desire = 0.9; // LATER estimate how useful this attack is.

        return {
            target,
            desire,
        };
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
        if (squad.isKO()) {
            throw new Error(squad.id); // illegal
        }

        const distance = squad.coord.distanceTo(action.target);
        squad.ready = false;

        if (action.type === Action.TYPE.Move) {
            if (distance > squad.speed()) {
                Util.logError(`Illegal action submitted, can't move that far: ${action.toString()}`);
                // LATER interpret as a more reasonable move.
                return;
            }

            // if (distance === 0) {
                // Util.logError(`This is not so bad, but a squad decided to move 0 distance: ${action.toString()}`);
            // }

            squad.coord = action.target;
            return;
        }

        if (action.type === Action.TYPE.Attack) {
            if (action.target.isKO()) {
                throw new Error(action.target.id);
            }

            if (! squad.canSee(action.target)) {
                Util.logError(`Illegal action submitted, can't see target squad: ${action.toString()}`);
                // LATER interpret as a more reasonable action.
                return;
            }

            const initialTargetCount =  action.target.quantity();
            const targetTerse = action.target.terse();

            const events = squad.attack(action.target);
            this.record(events);
            this.drawAttack(squad, action.target);

            // TODO log more readable summaries of what happens. 3 Marines (3,2) attack 2 Grunts (5, 0). 4 hits, no KOs.
            const hitCount = events
                .filter(e => e.type === Event.TYPE.Hit)
               .length;

            const koCount = initialTargetCount - action.target.quantity();
            const eliminationMessage = action.target.quantity() === 0 ?
                ' (SQUAD WIPE)' :
                '';

            Util.log(`${squad.terse()} attack ${targetTerse}: ${hitCount} hits, ${koCount} KOs${eliminationMessage}`);

            return;
        }

        // LATER more action types
    }

    setHTML () {
        this.drawGrid();
    }

    drawGrid () {
        this.resetGrid();

        for (let y = 0; y < ScifiWarband.WINDOW_SQUARES; y++) {
            for (let x = 0; x < ScifiWarband.WINDOW_SQUARES; x++) {
                const things = this.contentsOfCoord(x, y);

                if (things.length === 0) {
                    this.drawSquare(Squad.IMAGE_PREFIX + 'sand.jpg', x, y);
                }
                else {
                    const thing = things[0];

                    if (! thing.isKO()) {
                        this.drawSquare(thing.imageURL(), x, y);
                    }
                    else {
                        // LATER find real KO image(s)
                        this.drawSquare(Squad.IMAGE_PREFIX + 'sentinel.jpg', x, y);
                    }

                    if (things.length >= 2) {
                        Util.logDebug(`Coord ${x}, ${y} contains ${things.length} things, BTW.`);
                    }
                }
            }
        }
    }

    resetGrid () {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
            Util.logDebug(`ScifiWarband.nearestFoes(${squad.terse()}): contemplating ${thing.terse()}, top. Teams: ${squad.team} vs ${thing.team}, canSee(thing)? ${squad.canSee(thing)}, thing.stealth = ${thing.stealth}`);

            if (thing.team === squad.team) { continue; }
            if (thing.isKO()) { continue; }
            if (! squad.canSee(thing)) { continue; }

            const dist = squad.distanceTo(thing);

            Util.logDebug(`ScifiWarband.nearestFoes(${squad.terse()}): contemplating ${thing.terse()}, dist is ${dist}`);

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

    drawSquare (imageURL, x, y) {
        const imgElement = new Image();
        imgElement.src = imageURL;

        imgElement.onload = () => this.drawLoadedImage(imgElement, x, y);
    }

    drawLoadedImage (imgElement, x, y) {
        let xOffset = 0;
        let yOffset = 0;
        let width;
        let height;
        if (imgElement.naturalWidth >= imgElement.naturalHeight) {
            width = ScifiWarband.SQUARE_PIXELS;
            height = imgElement.naturalHeight / imgElement.naturalWidth * ScifiWarband.SQUARE_PIXELS;
            yOffset = (width - height) / 2;
        }
        else {
            width = imgElement.naturalWidth / imgElement.naturalHeight * ScifiWarband.SQUARE_PIXELS;
            height = ScifiWarband.SQUARE_PIXELS;
            xOffset = (height - width) / 2;
        }

        // tow 1710

        this.canvasCtx.drawImage(
            imgElement, 
            this.cornerOfSquare(x) + xOffset,
            this.cornerOfSquare(y) + yOffset,
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
            // TODO bug seen where .coord is undefined
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

    static async testDrawAttack () {
        await Util.sleep(1);
        game.drawAttack(
            {
                coord: {
                    x: Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
                    y: Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
                }
            },
            {
                coord: {
                    x: Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
                    y: Math.floor(Math.random() * ScifiWarband.WINDOW_SQUARES),
                }
            }
        );
    }

    static async run () {
        const game = new ScifiWarband();
        game.exampleSetup();
        game.initSquads();
        game.setHTML();

        game.runEncounter();
        game.explainOutcome();

        // game.testNearestFoes();
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
