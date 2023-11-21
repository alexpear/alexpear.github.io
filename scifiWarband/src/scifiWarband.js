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
        this.canvasCtx = this.canvas.getContext('2d');
        this.events = [
            Event.encounterStart()
        ];

        this.loadImages();

        // LATER add a system to assign readable squad display names to .things like 'Grunt Squad Alpha'
    }

    loadImages () {
        this.images = {
            sand: this.loadImage('sand.jpg'),
            sentinel: this.loadImage('sentinel.jpg'),
        };

        for (let template of Templates.allEntries()) {
            if (! template.image) { continue; }

            const withoutExtension = template.image.split('.')[0];
            if (this.images[withoutExtension]) { continue; }

            this.images[withoutExtension] = this.loadImage(template.image);
        }
    }

    loadImage (filename) {
        const img = new Image();
        img.src = Squad.IMAGE_PREFIX + filename;
        return img;
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
        // LATER could support new teams appearing mid-battle.

        for (Event.t = 1; Event.t <= 100; Event.t++) {
            this.readySquads();
            this.logNewRound();
            Util.logDebug(`t=${Event.t}: ${this.things.filter(t => ! t.isKO()).length} squads left.`);

            for (let activation = 1; activation <= 1e5; activation++) {
                // ScifiWarband.logDebug(`runEncounter() at top of activation loop - activation=${activation}`);

                if (this.encounterDone()) { return; }

                const teamIndex = activation % teams.length;
                const curTeam = teams[teamIndex];
                const curSquad = this.findReadySquad(curTeam);

                if (! curSquad) {
                    if (! this.findReadySquad()) {
                        break; // Case where all squads have been activated.
                    }

                    continue; // Case where curTeam has activated all their squads but a faction with more squads has not yet finished activating their squads.
                }

                this.record(
                    curSquad.update()
                );

                const actions = this.chooseActions(curSquad);

                // ScifiWarband.logDebug(`runEncounter() loop - chosen actions are: ${Util.stringify(actions.map(a => a.toJson()))}`);

                this.performActions(actions);

                // ScifiWarband.logDebug(`runEncounter() after performActions(length ${actions.length}) - activation=${activation}`);

                await Util.sleep(1);
                this.setHTML();
                // LATER - Bug: UI shows a move, does not sleep(1), and also shows a attack
                // LATER: A replay UI where user steps forwards or back (activation by activation) thru the replay, instead of sleep()ing.
            }

            // ScifiWarband.logDebug(`runEncounter() after activation loop`);
        }
    }

    teamSummaries () {
        const teamSummaries = {};

        for (let thing of this.things) {
            const quantity = thing.quantity();
            const squadNumber = quantity >= 1 ?
                1 :
                0;

            const faction = thing.faction();

            if (teamSummaries[faction]) {
                const obj = teamSummaries[faction];

                obj.squads += squadNumber;
                obj.headcount += quantity;
                obj.healthBar += thing.healthBar();
            }
            else {
                teamSummaries[faction] = {
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

        Util.log(`t=${Event.t}: ${Util.stringify(teamSummaries)}`);
    }

    record (events) {
        this.events = this.events.concat(events);
    }

    encounterDone () {
        const squadCounts = {};

        for (let thing of this.things) {
            if (thing.isKO()) { continue; }

            const faction = thing.faction();

            if (squadCounts[faction]) {
                squadCounts[faction] += 1;
            }
            else {
                if (Object.keys(squadCounts).length >= 1) {
                    return false;
                }

                squadCounts[faction] = 1;
            }
        }

        // Util.log(squadCounts);
        // Util.log(`t=${Event.t}: ${squadCounts.player} player squads vs ${squadCounts.enemy} enemy squads`);

        return Object.keys(squadCounts).length <= 1;
    }

    readySquads () {
        for (let thing of this.things) {
            this.sanityCheck(thing);

            thing.ready = true;
        }
    }

    sanityCheck (thing) {
        // LATER could functionize some or all of this into Util.js
        // (or could move it to squad.js)
        let sane = true;

        if (
            ! thing ||
            ! thing.creatures
        ) {
            sane = false;
        }
        else {
            const factions = Util.unique(
                thing.creatures?.map(cr => cr.faction())
            );

            const activeCreature = thing.creatures.find(cr => ! cr.isKO());
            const koCreature = thing.creatures.find(cr => cr.isKO());
            const mixedKOStatus = activeCreature && koCreature;

            if (
                thing.creatures.length === 0 ||
                factions.length !== 1 ||
                mixedKOStatus
            ) {
                sane = false;
            }
        }

        if (! sane) {
            let info;

            if (thing) {
                if (thing.toJson) {
                    info = thing.toJson();
                }
                else {
                    info = {
                        keys: Object.keys(thing),
                        constructorName: info.constructor.name,
                    };
                }
            }
            else {
                info = thing;
            }

            throw new Error(Util.stringify(info));
        }
    }

    findReadySquad (faction) {
        return this.things.find(
            thing => goodSquad(thing, faction)
        );

        function goodSquad (thing, faction) {
            if (! thing.ready || thing.isKO()) {
                return false;
            }

            if (faction) {
                return thing.faction() === faction;
            }
            else {
                return true;
            }
        }
    }

    // returns boolean
    coordOnGrid (coord) {
        return coord.inBox(
            0,
            0,
            ScifiWarband.WINDOW_SQUARES - 1,
            ScifiWarband.WINDOW_SQUARES - 1
        );
    }

    // This function is the mind of the squad. LATER could move these behavioral funcs to a class Mind in a mind.js file.
    // Allowed to return illegal moves.
    chooseActions (curSquad) {
        // ScifiWarband.logDebug(curSquad.toJson());

        const sentiments = curSquad.creatures.map(cr => cr.morale());
        // LATER morale can inform chooseActions()

        // A squad may do ONE action (eg move OR attack) each turn.
        const movePlan = this.desiredMove(curSquad);
        const attackPlan = this.desiredAttack(curSquad);
        // LATER replace these 2 local vars with array of several possible actions. this.desiredActions() => actionInfo[]

        // if (movePlan.coord === curSquad.coord) {
        //     movePlan.desire = 0;
        // }

        const roll = Math.random() * (movePlan.desire + attackPlan.desire);

        // ScifiWarband.logDebug(`${curSquad.terse()} is thinking of moving to ${movePlan.coord.toString()} with desire ${movePlan.desire}, or attacking ${attackPlan.target.terse()} with desire ${attackPlan.desire}`);

        if (! roll) {
            // Detect bugs with 0, undefined, NaN, etc.
            throw new Error(Util.stringify({
                squad: curSquad.terse(),
                roll,
                movePlanDesire: movePlan.desire,
                attackPlanDesire: attackPlan.desire,
            }));
        }

        if (roll <= movePlan.desire) {
            return [Action.move(curSquad, movePlan.coord)];
        }
        else {
            return [Action.attack(curSquad, attackPlan.target)];
        }
        // LATER could add this 'roll over N numbers' logic to util.js
    }

    desiredMove (curSquad) {
        const report = {};

        const speed = curSquad.speed();
        const nearestFoeInfo = this.nearestFoes(curSquad);
        const nearestFoes = nearestFoeInfo.foes;
        const foeDistance = nearestFoeInfo.dist;
        const preferredDistance = curSquad.preferredDistance();
        const positionImperfection = foeDistance - preferredDistance;

        if (Math.abs(positionImperfection) <= 0.5) {
            // Good position already.
            return {
                coord: curSquad.coord,
                desire: 0
            };
        }

        const goodRangeCoord = this.coordAlongLine(
            nearestFoes[0].coord,
            curSquad.coord,
            preferredDistance
        );

        let firstChoiceCoord = goodRangeCoord;
        // ScifiWarband.logDebug(`ScifiWarband.desiredMove(${curSquad.terse()}): positionImperfection=${positionImperfection} goodRangeCoord is ${goodRangeCoord.toString()}, nearest foe is ${nearestFoes[0].coord.toString()}, preferredDistance=${preferredDistance}, speed=${speed}`)

        if(curSquad.coord.distanceTo(goodRangeCoord) > speed) {
            firstChoiceCoord = this.coordAlongLine(
                curSquad.coord,
                goodRangeCoord,
                speed
            );

            // ScifiWarband.logDebug(`ScifiWarband.desiredMove(${curSquad.terse()}): goodRangeCoord was too far (${curSquad.coord.distanceTo(goodRangeCoord)} vs speed ${speed}) so we replaced it with ${firstChoiceCoord.toString()} `);
        }

        const candidates = this.adjacents(firstChoiceCoord);
        candidates.push(firstChoiceCoord);

        let bestCoord = candidates[0];
        let bestRating = -Infinity;

        for (let candidate of candidates) {
            const rating = this.destinationRating(candidate, curSquad);
            if (rating > bestRating) {
                bestRating = rating;
                bestCoord = candidate;
            }

            // ScifiWarband.logDebug(`ScifiWarband.desiredMove(), candidates loop: candidate=${candidate.toString()}, rating=${rating}, curSquad=${curSquad.terse()}`);
        }

        // Desires should be numbers in range [0, 1]
        bestRating = Math.max(bestRating, 0);
        const desire = bestRating / (bestRating + 1);

        if (desire > 1) {
            throw new Error(Util.stringify({
                desire,
                bestRating,
                squad: curSquad.terse(),
            }));
        }

        return {
            coord: bestCoord,
            desire,
        };
    }

    // returns rounded coord
    coordAlongLine (startCoord, endCoord, distFromStart) {
        const deltaX = startCoord.x - endCoord.x;
        const deltaY = startCoord.y - endCoord.y;

        let xDist;
        let yDist;

        if (deltaY === 0) {
            // Case where we avoid dividing by zero.
            xDist = Math.sign(deltaX) * -1 * distFromStart;
            yDist = 0;
        }
        else {
            // LATER could rename to inverseSlope or whatever the correct term is for x/y
            const slope = deltaX / deltaY;

            yDist = Math.sqrt(
                distFromStart**2 / (
                    slope**2 + 1
                )
            );
            yDist *= Math.sign(deltaY) * -1;

            xDist = slope * yDist;
        }

        return new Coord(
            Util.round(startCoord.x + xDist),
            Util.round(startCoord.y + yDist)
        );
    }

    static testCoordAlongLine () {
        const game = new ScifiWarband();

        let testsRun = 0;

        hope(
            game.coordAlongLine(
                new Coord(2, 2),
                new Coord(2, 10),
                3
            ),
            2, 5,
            'deltaX=0 case',
        );

        hope(
            game.coordAlongLine(
                new Coord(0, 0),
                new Coord(10, 0),
                3
            ),
            3, 0,
            'deltaY=0 case',
        );

        hope(
            game.coordAlongLine(
                new Coord(0, 0),
                new Coord(6, 8),
                5
            ),
            3, 4,
            'Like a triangle of sides 3,4,5, going down & right',
        );

        hope(
            game.coordAlongLine(
                new Coord(0, 0),
                new Coord(8, 6),
                5
            ),
            4, 3,
            'Like a triangle of sides 3,4,5, going down & right, flipped',
        );

        hope(
            game.coordAlongLine(
                new Coord(6, 0),
                new Coord(0, 8),
                5
            ),
            3, 4,
            'Like a triangle of sides 3,4,5, going down & left',
        );

        hope(
            game.coordAlongLine(
                new Coord(6, 8),
                new Coord(3, 4),
                5
            ),
            3, 4,
            'Like a triangle of sides 3,4,5, going up & left',
        );

        const baseline = 10;
        const start = new Coord(baseline, baseline);

        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                const end = new Coord(baseline + 2 * xOffset, baseline + 2 * yOffset);

                hope(
                    game.coordAlongLine(
                        start,
                        end,
                        1.1
                    ),
                    baseline + xOffset,
                    baseline + yOffset,
                    `Generated test: ${start} to ${end}`,
                );
            }
        }

        function hope (result, x, y, testNote) {
            testsRun++;

            if (! result || result.x !== x || result.y !== y) {
                throw new Error(`testCoordAlongLine(): Test ${testsRun}: (${testNote || ''}) Got ${result.toString()} but we expected [${x}, ${y}]`);
            }
        }
    }

    adjacents (coord) {
        const coords = [];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) { continue; }

                const neighbor = new Coord(coord.x + x, coord.y + y);

                if (this.coordOnGrid(neighbor)) {
                    coords.push(neighbor);
                }
            }
        }

        return coords;
    }

    // distToFoe is a param you can optionally include if you happen to already know it.
    destinationRating (coord, squad, distToFoe) {
        const BASE = 10;

        if (! this.coordOnGrid(coord)) {
            return -Infinity;
        }

        if (squad.coord.distanceTo(coord) > squad.speed()) {
            return -Infinity;
        }

        if (! Util.exists(distToFoe)) {
            const foeInfo = this.nearestFoesFromCoord(coord, squad.faction());
            distToFoe = foeInfo.dist;
        }

        const occupants = this.contentsOfCoord(coord);
        for (let occupant of occupants) {
            // ScifiWarband.logDebug(`destinationRating(), comparing occupant ${occupant.terse()} to squad ${squad.terse()}`)
            if (occupant === squad) {
                return -9999;
            }

            if (! occupant.isKO()) {
                return -Infinity;
            }
        }

        const imperfection = Math.abs(distToFoe - squad.preferredDistance());

        return BASE - imperfection;
    }

    static testDestinationRating () {
        const game = new ScifiWarband();
        game.things = [Squad.example('Grunt', new Coord(0, 0))];
        const protag = Squad.example('Marine', new Coord(2, 2));

        let bestRatedCoord;
        let bestRating = -Infinity;

        for (let x = 1; x <= 3; x++) {
            for (let y = 1; y <= 3; y++) {
                const coord = new Coord(x, y);
                const rating = game.destinationRating(coord, protag);

                if (rating > bestRating) {
                    bestRating = rating;
                    bestRatedCoord = coord;
                }
            }
        }

        if (bestRatedCoord.x !== 1 || bestRatedCoord.y !== 1) {
            throw new Error(`${bestRatedCoord} had rating=${bestRating}`);
        }
    }

    desiredAttack (curSquad) {
        const foeInfo = this.nearestFoes(curSquad);
        const imperfection = Math.abs(foeInfo.dist - curSquad.preferredDistance());
        const positionRating = Math.max(
            20 - imperfection,
            0
        );

        const desire = positionRating / (positionRating + 1);

        if (! desire) {
            throw new Error(Util.stringify({
                curSquad: curSquad.toJson(),
                dist: foeInfo.dist,
                imperfection,
                positionRating,
                desire,
                target: foeInfo.foes[0].toJson(),
            }));
        }

        return {
            target: foeInfo.foes[0],
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
        const squad = action.subject;
        if (squad.isKO()) {
            throw new Error(Util.stringify(action)); // illegal
        }

        const distance = squad.coord.distanceTo(action.target);
        squad.ready = false;

        if (action.type === Action.TYPE.Move) {
            if (! Util.exists(action.target.x) || ! Util.exists(action.target.y)) {
                throw new Error(Util.stringify(action));
            }

            if (distance > squad.speed()) {
                ScifiWarband.logDebug(`ERROR - Illegal action submitted, can't move that far: ${action.toString()}`);
                // LATER interpret as a more reasonable move.
                return;
            }

            if (! this.coordOnGrid(action.target)) {
                ScifiWarband.logDebug(`ERROR - Illegal action submitted, can't move off the grid: ${action.toString()}`);
                // LATER interpret as a more reasonable move.
                return;
            }

            // if (distance === 0) {
                // ScifiWarband.logDebug(`ERROR - This is not so bad, but a squad decided to move 0 distance: ${action.toString()}`);
            // }
            const occupants = this.contentsOfCoord(action.target);
            for (let thing of occupants) {
                if (! thing.isKO()) {
                    ScifiWarband.logDebug(`ERROR - Illegal action - trying to move onto occupied square: ${action.toString()}`);
                    return;
                }
            }

            // LATER log this message at EVENT level, not DEBUG
            ScifiWarband.logDebug(`EVENT - ${squad.terse()} moves to ${action.target.toString()}, distance=${distance}, speed=${squad.speed()}`);

            squad.coord = action.target;
            return;
        }

        // LATER functionize into this.performAttack()
        if (action.type === Action.TYPE.Attack) {
            if (action.target.isKO()) {
                throw new Error(Util.stringify(action));
            }

            if (! squad.canSee(action.target)) {
                ScifiWarband.logDebug(`ERROR - Illegal action submitted, can't see target squad: ${action.toString()}`);
                // LATER interpret as a more reasonable action.
                return;
            }

            const initialTargetCount =  action.target.quantity();
            const targetTerse = action.target.terse();

            const events = squad.attack(action.target);
            this.record(events);
            const color = Squad.attackColor(events);
            this.drawAttack(squad, action.target, color);

            const hitCount = events
                .filter(e => e.type === Event.TYPE.Hit)
                .length;

            const koCount = initialTargetCount - action.target.quantity();
            const eliminationMessage = action.target.quantity() === 0 ?
                ' (SQUAD WIPE)' :
                '';

            Util.log(`t=${Event.t}: ${squad.terse()} attack ${targetTerse}: ${hitCount} hits, ${koCount} KOs${eliminationMessage}`);
            // LATER i want the logs here or at round start to express exactly how a straggler is injured.

            this.tidyKOs(action.target, koCount);
            return;
        }

        // LATER more action types
    }

    tidyKOs (damagedSquad, koCount) {
        if (koCount === 0) { return; }

        // ScifiWarband.logDebug(`tidyKOs(${damagedSquad.terse()}, ${koCount}) top. - toJsonStr()=${damagedSquad.toJsonStr()}`);

        const koCreatures = damagedSquad.creatures.filter(cr => cr.isKO());
        if (koCreatures.length === 0) { return; }

        const thingsHere = this.contentsOfCoord(damagedSquad.coord);

        let koSquad = thingsHere.find(
            th => th !== damagedSquad &&
                th.faction() === damagedSquad.faction() &&
                th.isKO()
        );

        if (! koSquad) {
            koSquad = Squad.koSquad(damagedSquad.coord);
            this.things.push(koSquad);
        }

        // ScifiWarband.logDebug(`tidyKOs(${damagedSquad.terse()}, ${koCount}) before concat(). koSquad.creatures.length=${koSquad.creatures.length}, koCreatures.length=${koCreatures.length}`);

        koSquad.creatures = koSquad.creatures.concat(koCreatures);

        // ScifiWarband.logDebug(`tidyKOs(${damagedSquad.terse()}, ${koCount}) after concat(). koSquad.creatures.length=${koSquad.creatures.length}, koCreatures.length=${koCreatures.length}`);

        damagedSquad.creatures = damagedSquad.creatures.filter(cr => ! cr.isKO());

        if (damagedSquad.creatures.length === 0) {
            this.things = this.things.filter(th => th.creatures.length >= 1);
        }

        const koCreaturesArrayStr = koCreatures.map(cr => cr.toJsonStr()).join(', ');
        // ScifiWarband.logDebug(`tidyKOs(${damagedSquad.terse()}, ${koCount}) bottom. - damagedSquad.toJsonStr()=${damagedSquad.toJsonStr()} \n koSquad.toJsonStr()=${koSquad.toJsonStr()}, local var koCreatures=[${koCreaturesArrayStr}]`);

        if (koSquad.creatures.length === 0) {
            throw new Error(Util.stringify({
                damagedSquad: damagedSquad.toJson(),
                koSquad: koSquad.toJson(),
            }));
        }

        return koSquad; // It's okay if this return value is not used.
    }

    static testTidyKOs () {
        const game = new ScifiWarband();

        const damagedSquad = Squad.example('Marine');
        const startingCount = damagedSquad.creatures.length;
        game.things = [damagedSquad];

        damagedSquad.creatures[0].status.ko = true;
        game.tidyKOs(damagedSquad);

        const contents = game.contentsOfCoord(damagedSquad.coord);
        const koSquad = contents.find(sq => sq.isKO());

        // LATER add Util.js funcs to functionize unit tests like this one.

        const summary = {
            numberOfSquads: contents.length,
            startingCount,
            endingCount: damagedSquad.creatures.length,
            endingQuantity: damagedSquad.quantity(),
            koSquadCount: koSquad?.creatures.length,
            koSquadQuantity: koSquad?.quantity(),
            koSquadFaction: koSquad?.faction(),
        };

        const controlGroup = Squad.example('Marine');

        const expected = {
            numberOfSquads: 2,
            startingCount: controlGroup.creatures.length,
            endingCount: controlGroup.creatures.length - 1,
            endingQuantity: controlGroup.creatures.length - 1,
            koSquadCount: 1,
            koSquadQuantity: 0,
            koSquadFaction: controlGroup.faction(),
        };

        for (let key in expected) {
            if (expected[key] !== summary[key]) {
                throw new Error(
                    `Saw (${key}: ${summary[key]}), but expected ${expected[key]}. \n  Summary: ${Util.stringify(summary)}`
                );
            }
        }
    }

    setHTML () {
        this.drawGrid();
    }

    drawGrid () {
        this.resetGrid();

        // LATER maybe start from 1 not 0. Edit Squad.example() too if so.
        for (let y = 0; y < ScifiWarband.WINDOW_SQUARES; y++) {
            for (let x = 0; x < ScifiWarband.WINDOW_SQUARES; x++) {
                const things = this.contentsOfCoord(new Coord(x, y));

                if (things.length === 0) {
                    this.drawLoadedImage(this.images.sand, x, y);
                    continue;
                }

                const activeThings = things.filter(th => ! th.isKO());

                if (activeThings.length === 0) {
                    this.drawSquad(things[0]); // Draw any of the KO squads.
                    continue;
                }
                else if (activeThings.length >= 2) {
                    ScifiWarband.logDebug(`ERROR - Coord ${x}, ${y} contains ${things.length} things, BTW.`);
                }

                this.drawSquad(activeThings[0]);
            }
        }
    }

    resetGrid () {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Returns Squad[]
    contentsOfCoord (input) {
        return this.things.filter(
            t => t.coord.x === input.x &&
                t.coord.y === input.y
        );
    }

    // Returns array of nearest foe - or foes tied for same distance.
    nearestFoes (squad) {
        return this.nearestFoesFromCoord(squad.coord, squad.faction());
    }

    nearestFoesFromCoord (coord, team) {
        // LATER check whether game crashes when this returns [];
        let nearests = [];
        let shortestDist = 99999; // unit: squares

        for (let thing of this.things) {
            // ScifiWarband.logDebug(`nearestFoes(${squad.terse()}): contemplating ${thing.terse()}, top. Teams: ${squad.team} vs ${thing.team}, canSee(thing)? ${squad.canSee(thing)}, thing.visibility = ${thing.visibility}`);

            if (thing.faction() === team) { continue; }
            if (thing.isKO()) { continue; }

            if (! Squad.coordCanSee(coord, thing)) { continue; }

            const dist = coord.distanceTo(thing.coord);

            // ScifiWarband.logDebug(`nearestFoes(${squad.terse()}): contemplating ${thing.terse()}, dist is ${dist}`);

            if (dist < shortestDist) {
                nearests = [thing];
                shortestDist = dist;
            }
            else if (dist === shortestDist) {
                nearests.push(thing);
            }

            // NOTE - speeding up this func further (eg via Manhattan distance 1st pass) seems unnecessary: 0.00006 seconds per nearestFoes() call.
        }

        return {
            foes: nearests,
            dist: shortestDist,
        };
    }

    testNearestFoes () {
        this.things = [];

        // Create 200 squads at random coords & teams
        for (let i = 0; i < 200; i++) {
            this.things.push(
                new Squad(
                    Templates.Halo.UNSC.Squad.Marine,
                    undefined, //Util.randomOf([Squad.TEAM.Player, Squad.TEAM.Enemy]),
                    Coord.random2d(10)
                )
            );
        }
        // log start time & save in local variable
        const startDate = new Date();
        ScifiWarband.logDebug(`testNearestFoes() starting test at ${startDate.getUTCMilliseconds()}`);
        
        // call nearestFoes for each squad
        for (let sq of this.things) {
            const unused = this.nearestFoes(sq);
        }
        
        // log total time spent & time per call
        const endDate = new Date();
        const ms = endDate - startDate;
        ScifiWarband.logDebug(`testNearestFoes() ending test at ${endDate.getUTCMilliseconds()}\n  Total time was ${ms / 1000} seconds, or ${ms / 1000 / this.things.length} seconds per nearestFoes() call.`);
    }

    drawSquad (squad) {
        const x = squad.coord.x;
        const y = squad.coord.y;
        let image;
        let lowerLeftString;

        if (squad.isKO()) {
            image = this.images.sand;
            // LATER could display KO squads as a empty square, if that seems visually tidier.
            lowerLeftString = 'KO';
        }
        else {
            image = this.images[squad.imageName()];
            lowerLeftString = String(
                Math.min(squad.quantity(), 9999)
            );
        }

        this.drawLoadedImage(image, x, y);

        const QUANTBOX_HEIGHT = 22;
        this.canvasCtx.fillStyle = 'lightgrey';

        const left = this.cornerOfSquare(x);
        const top = this.cornerOfSquare(y + 1) - QUANTBOX_HEIGHT;
        const width = this.canvasCtx.measureText(lowerLeftString).width + 4;
        const height = QUANTBOX_HEIGHT;

        this.canvasCtx.fillRect(left, top, width, height);

        // LATER could move unchanging style assignment statements to a setup func, if they are slowing things down appreciably.
        this.canvasCtx.font = '18px serif';
        this.canvasCtx.textAlign = 'left';
        this.canvasCtx.fillStyle = 'green';

        this.canvasCtx.fillText(
            lowerLeftString,
            this.cornerOfSquare(x) + 1,
            this.cornerOfSquare(y + 1) - 7,
        );
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

    drawAttack (squad, target, color) {
        this.drawAttackXY(
            squad.coord.x,
            squad.coord.y,
            target.coord.x,
            target.coord.y,
            color
        );
    }

    // Inputs should be in grid coords, not pixel coords.
    drawAttackXY (startX, startY, endX, endY, color = 'yellow') {
        const SHORTLINE = 12;
        const TILT = Math.PI / 6;
        const dx = endX - startX;
        const dy = endY - startY;
        const radians = Math.atan2(dy, dx);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.beginPath();

        this.canvasCtx.moveTo(
            this.centerOfSquare(startX),
            this.centerOfSquare(startY),
        );

        const endPixelX = this.centerOfSquare(endX);
        const endPixelY = this.centerOfSquare(endY);

        this.canvasCtx.lineTo(
            endPixelX,
            endPixelY
        );
        this.canvasCtx.lineTo(
            endPixelX - SHORTLINE * Math.cos(radians - TILT),
            endPixelY - SHORTLINE * Math.sin(radians - TILT)
        );
        this.canvasCtx.moveTo(
            endPixelX,
            endPixelY
        );
        this.canvasCtx.lineTo(
            endPixelX - SHORTLINE * Math.cos(radians + TILT),
            endPixelY - SHORTLINE * Math.sin(radians + TILT)
        );

        this.canvasCtx.stroke();
    }

    explainOutcome () {
        ScifiWarband.logDebug(`explainOutcome() top.`);
        this.logNewRound();
        this.debugLogState();
        // LATER Present outcome to user in more detail.
    }

    debugLogState () {
        ScifiWarband.logDebug(`ScifiWarband.debugLogState()`);

        for (let y = 0; y < ScifiWarband.WINDOW_SQUARES; y++) {
            for (let x = 0; x < ScifiWarband.WINDOW_SQUARES; x++) {
                const things = this.contentsOfCoord(new Coord(x, y));

                if (things.length === 0) { continue; }

                for (let thing of things) {
                    ScifiWarband.logDebug(`${thing.terse()} with .creatures=${thing.koSummary()}`);
                }
            }
        }
    }

    exampleSetup () {
        this.things = this.exampleSquads();
    }

    exampleSquads () {
        const factionA = Templates.randomFaction();

        let factionB;
        do { factionB = Templates.randomFaction(); }
        while (factionA === factionB);

        // const factionB = Templates.randomFaction();

        const allSquads = [];

        for (let i = 0; i < ScifiWarband.WINDOW_SQUARES; i++) {
            allSquads.push(Squad.randomOfFaction(
                factionA,
                new Coord(i, 0)
            ));
            allSquads.push(Squad.randomOfFaction(
                factionB,
                new Coord(i, ScifiWarband.WINDOW_SQUARES - 1)
            ));
        }

        return allSquads;
    }

    exampleSetupSimple () {
        this.things = [
            Squad.example('Marine', new Coord(2, 1)),
            Squad.example('Grunt', new Coord(7, 1)),
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

    static logDebug (input) {
        const inputStr = Util.isString(input) ?
            input :
            Util.stringify(input);

        Util.logDebug(`ScifiWarband t=${Event.t} - ${inputStr}`);
    }

    static testLogDebug () {
        const sq = Squad.example('Marine');
        const json = sq.toJson();

        console.log(`ScifiWarband.testLogDebug() - Test S:`);
        ScifiWarband.logDebug('This is just a string.');
        // Good.

        console.log(`ScifiWarband.testLogDebug() - Test J:`);
        ScifiWarband.logDebug(json);
        // Good.

        console.log(`ScifiWarband.testLogDebug() - Test SJ:`);
        ScifiWarband.logDebug(String(json));
        // object Object

        console.log(`ScifiWarband.testLogDebug() - Test SCJ:`);
        ScifiWarband.logDebug(`string containing ${json}`);
        // object Object

        console.log(`ScifiWarband.testLogDebug() - Test USJ:`);
        ScifiWarband.logDebug(Util.stringify(json));
        // Good.

        console.log(`ScifiWarband.testLogDebug() - Test SCUSJ:`);
        ScifiWarband.logDebug(`string containing ${Util.stringify(json)}`);
        // Good.
    }

    static test () {
        ScifiWarband.testCoordAlongLine();
        ScifiWarband.testDestinationRating();
        ScifiWarband.testTidyKOs();
        // ScifiWarband.testLogDebug();

        Util.logDebug(`ScifiWarband.test() - All tests finished.`);
    }

    static async run () {
        const canvas = document.getElementById('canvas');
        if (! canvas) { return; }

        ScifiWarband.test();

        const game = new ScifiWarband();
        game.exampleSetup();
        game.initSquads();
        game.setHTML();

        await game.runEncounter();
        ScifiWarband.logDebug(`run() after runEncounter()`);
        game.explainOutcome();

        // game.testNearestFoes();
    }
}

ScifiWarband.WINDOW_SQUARES = 9; // number of squares
ScifiWarband.DEFAULT_SQUARE_SIZE = 4; // meters
ScifiWarband.SQUARE_PIXELS = 60;

module.exports = ScifiWarband;

ScifiWarband.run();
