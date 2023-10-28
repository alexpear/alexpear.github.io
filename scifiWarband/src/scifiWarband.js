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
        Util.logEvent(this.toJson());
    }

    toJson () {
        const safeObj = {
            timestamp: this.timestamp.getUTCMilliseconds(),
            type: this.type,
            details: this.details
        };

        safeObj.details.target = this.details.target?.id;

        return safeObj;
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

    static update (t, creature) {
        return new Event(
            t, 
            Event.TYPE.Update,
            {
                shieldsTo: creature.shields,
                cooldownEnds: creature.cooldownEnds,
            }
        );
    }
}

Event.TYPE = {
    EncounterStart: 'Encounter Start',
    Attack: 'Attack',
    Update: 'Update',
};

Event.ATTACK_OUTCOME = {
    Miss: 'Miss',
    Cover: 'Stopped by Cover',
    Hit: 'Hit',
    // These last few are cool, but we might express these situations via the events created by takeHit() instead.
    Endured: 'Endured',
    Damage: 'Damage', // Including shield damage.
    KO: 'KO',
};

// TODO Maybe track t globally during battle calculation in Event.t
// Then dont have to pass it around so much.
// Altho tricky to store it in 2 places...

class Action {
    constructor (type, subject, target) {
        this.type = type;
        this.subject = subject;
        this.target = target;
    }

    static move (subject, coord) {
        return new Action(Action.TYPE.Move, subject, coord);
    }

    static attack (subject, target) {
        return new Action(Action.TYPE.Attack, subject, coord);
    }
}

// LATER vaguely contemplating instead using Event to represent planned actions. Downside: Semantically it's a plan, not a event.
Action.TYPE = {
    Move: 'Move',
    TakeCover: 'Take Cover',
    Attack: 'Attack',
    Objective: 'Secure Objective',
    FirstAid: 'First Aid',
    GrabItem: 'Grab Item',
    Special: 'Special',
};

class Item {
    
}

// TODO move to Codex.js
Item.TEMPLATES = {
    UNSC: {
        Weapon: {
            SMG: {
                type: Creature.ATTACK_TYPE.Kinetic,
                damage: 1,
                rof: 4,
                accuracy: 1, // TODO 
                preferredRange: 1,
            }
        }
    }
};

// TODO new file
class Creature {
    constructor (creatureTemplate) {
        this.id = Util.uuid();
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
        if (this.cooldownEnds <= t) {
            if (this.shields < this.template.shields) {
                this.shields = this.shields + this.template.shieldRegen;

                if (this.shields >= this.template.shields) {
                    this.shields = this.template.shields;
                    this.cooldownEnds = Infinity;
                }

                return Event.update(t, this);
            }
        }
    }

    speed () {
        return this.template.speed + (this.status.speed || 0);
    }

    intrinsicAccuracy () {
        return this.template.accuracy + (this.status.accuracy || 0);
    }

    accuracy (weaponTemplate) {
        return this.intrinsicAccuracy() + (weaponTemplate.accuracy || 0);
    }

    durability () {
        return this.template.durability + (this.status.durability || 0);
    }

    weapon (targetSquad) {
        return this.template.items[0]; // LATER choose a weapon, or have a better preset system.
    }

    // returns number in range [-10, 10]
    // For squads to poll their members' perspectives.
    morale () {
        return 5; // Later add complexity
    }

    // LATER Could move this to main encounter class if that makes cover calc easier.
    // returns Event[]
    attack (otherSquad, coverPercent = 0) {
        const distance = this.squad.distanceTo(otherSquad);
        const weaponTemplate = this.weapon(); 

        // eg: Melee weapons have a strict max range.
        if (distance > weaponTemplate.maxRange) {            
            Util.logEvent(`Creature ${this.id} won't participate in attack because it's beyond this weapon's maxRange: ${weaponTemplate.maxRange}`);
            return;
        }

        const advantage = otherSquad.size() * this.accuracy(weaponTemplate);
        const events = [];

        for (let shot = 1; shot <= Math.ceiling(weaponTemplate.rof || 1); shot++) {
            const event = Event.attack(this, weaponTemplate, otherSquad);
            events.push(event);

            if (Math.random() > advantage / (advantage + distance + 1)) {
                event.details.attackOutcome = Event.ATTACK_OUTCOME.Miss;
                continue;
            }

            if (Math.random() <= coverPercent) {
                event.details.attackOutcome = Event.ATTACK_OUTCOME.Cover;
                continue;
            }

            const victim = otherSquad.whoGotHit();
            event.details.targetCreature = victim;
            event.details.attackOutcome = Event.ATTACK_OUTCOME.Hit;

            events.push(victim.takeHit(weaponTemplate));
        }

        return events;
    }

    // After considering cover.
    // returns Event
    takeHit (weaponTemplate, t) {
        let damage = weaponTemplate.damage;

        if (this.shields) {
            // TODO decide whether to get t by passing, by a static variable, or set it later.
            this.cooldownEnds = t + this.template.shieldDelay;

            if (weaponTemplate.attackType === Creature.ATTACK_TYPE.Plasma) {
                this.shields -= damage * 2;

                if (this.shields < 0) {
                    damage = Math.abs(this.shields) / 2;
                    this.shields = 0;
                    this.takeUnshieldedDamage(damage, weaponTemplate);    
                }
            }
            else {
                this.shields -= damage;

                if (this.shields < 0) {
                    damage = Math.abs(this.shields);
                    this.shields = 0;
                    this.takeUnshieldedDamage(damage, weaponTemplate);    
                }
            }
        }
        else {
            this.takeUnshieldedDamage(damage, weaponTemplate);    
        }

        // Looks at this.shields, this.cooldownEnds maybe, this.status
        const event = Event.hit(this, weaponTemplate, t);
        return event;
    }

    takeUnshieldedDamage (damage, weaponTemplate) {
        const resistance = this.template.resistance[weaponTemplate.attackType];
        if (resistance) {
            damage *= resistance;
        }

        const harm = damage / ((damage + this.durability) * Math.random());

        if (harm < 1) { return; }

        const harmedTrait = Util.randomOf(['speed', 'accuracy', 'durability']);

        if (this.status[harmedTrait]) {
            this.status[harmedTrait] -= Math.floor(harm);
        }
        else {
            this.status[harmedTrait] = Math.floor(harm) * -1;
        }

        if (this.template[harmedTrait] + this.status[harmedTrait] < 0) {
            // Too much damage in 1 category causes KO.
            this.status.ko = true;
        }
    }

    static example () {
        const cr = new Creature(
            Creature.TEMPLATES.Marine
        );

        return cr;
    }
}

// TODO move this and Squad.TEMPLATES to a WarbandTemplates.js file
// TODO resturcutre - WarbandTemplates.UNSC.Creature.Marine
Creature.TEMPLATES = {
    Marine: {
        size: 2,
        speed: 1, 
        durability: 10,
        accuracy: 1, // Later finalize how this calc works.
        resistance: {},
        items: [Item.TEMPLATES.UNSC.Weapon.SMG]
    },
    // Motive for accuracy stat - Spartans better with firearms than Grunts, also makes takeUnshieldedDamage() status effects simpler.
    // LATER How does damage work for: Scorpion, Scarab, UNSC Frigate? Based on status debuffs?
};

Creature.ATTACK_TYPE = {
    Kinetic: 'Kinetic',
    Plasma: 'Plasma',
    Impact: 'Impact',
    Explosive: 'Explosive',
    Hardlight: 'Hardlight',
    Electric: 'Electric',
};

// TODO new file.
class Squad {
    constructor (squadTemplate, team, coord) {
        this.id = Util.uuid();
        this.template = squadTemplate;
        this.team = team;
        this.coord = coord || new Coord();
        this.ready = true;
        this.resetStealth();
        this.creatures = [];

        // Note that this is how you create a homogenous squad from a template. LATER, might often have heterogenous squads coming from customization choices or from a save file.
        for (let i = 1; i <= this.template.quantity; i++) {
            const cr = new Creature(this.template.creature);
            this.creatures.push(cr);
            cr.squad = this;
        }
    }

    isKO () {
        return this.creatures.every(
            cr => cr.isKO()
        );
    }

    activeCreatures () {
        return this.creatures.filter(cr => ! cr.isKO())
    }

    size () {
        return Util.sum(
            this.activeCreatures().map(cr => cr.template.size)
        );
    }

    speed () {
        return Math.min(
            this.activeCreatures().map(cr => cr.speed())
        );
    }

    // unit: squares
    // TODO - decide whether to use squares as unit for codex stats (meaning i cant change meters per square) or express in meters.
    distanceTo (otherSquad) {
        return this.coord.distanceTo(otherSquad.coord);
    }

    update () {
        this.creatures.map(cr => cr.update());
        this.resetStealth();
        this.ready = true;
    }

    resetStealth () {
        this.stealth = Math.min(
            this.activeCreatures.map(cr => cr.template.stealth || 0)
            // TODO check whether .creatures should be replaced with activeCreatures classwide
        );  
    }

    attack (targetSquad) {
        let manyEvents = [];
        const creatures = this.activeCreatures();
        for (let cr of creatures) {
            const events = cr.attack(targetSquad);
            manyEvents = manyEvents.concat(events);
        }

        this.stealth -= creatures.length;
        // LATER make sure stealth & ready changes are well integrated with event system. Motive: Stealth might need displaying.

        return manyEvents;
    }

    whoGotHit () {
        const roll = Math.random() * this.size();

        for (let cr of this.creatures) {
            roll -= cr.template.size;

            if (roll <= 0) {
                return cr;
            }
        }

        Util.logDebug(`Squad.whoGotHit() default case happened for Squad ${this.id}.`);
        return this.creatures[this.creatures.length - 1];
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
