'use strict';

const Creature = require('./creature.js');
// const Squad = require('./squad.js');
// const Action = require('./action.js');
// const Item = require('./Item.js');
const Templates = require('./templates.js');

const Event = require('./event.js');

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

class Squad {
    constructor (squadTemplate, _unused, coord) {
        this.id = Util.uuid();
        this.template = squadTemplate;
        this.creatures = [];
        // this.team = team || this.template.faction;
        this.coord = coord || new Coord();
        this.ready = true;

        // Note that this is how you create a homogenous squad from a template. LATER, might often have heterogenous squads coming from customization choices or from a save file.
        for (let i = 1; i <= this.template.quantity; i++) {
            const cr = new Creature(this.template.creature);
            this.creatures.push(cr);
            cr.squad = this;
        }

        this.resetVisibility();
        this.loadImage();
    }

    loadImage () {
        this.imgElement = new Image();
        this.imgElement.src = Squad.IMAGE_PREFIX + this.template.image;

        // imgElement.onload = () => this.drawLoadedImage(imgElement, x, y);
    }

    existingName () {
        return this.nameFromUser || this.nameGenerated;
    }

    name () {
        return this.existingName() || ('Squad ' + Util.shortId(this.id));
    }

    faction () {
        return this.creatures?.[0]?.faction();
    }

    isKO () {
        return this.creatures.every(
            cr => cr.isKO()
        );
    }

    // LATER if useful, we could add a func like .available(), which checks both .ready and .isKO()

    activeCreatures () {
        return this.creatures.filter(cr => ! cr.isKO())
    }

    quantity () {
        return this.activeCreatures().length;
    }    

    size () {
        return Util.sum(
            this.activeCreatures().map(cr => cr.template.size)
        );
    }

    speed () {
        const min = Util.min(
            this.activeCreatures().map(cr => cr.speed())
        );

        if (! Util.exists(min)) {
            throw new Error(Util.stringify(this.toJson()));
        }

        return min;
    }

    // unit: squares
    // LATER - decide whether to use squares as unit for codex stats (meaning i cant change meters per square) or express in meters.
    distanceTo (otherSquad) {
        return this.coord.distanceTo(otherSquad.coord);
    }

    canSee (otherSquad) {
        return Squad.coordCanSee(this.coord, otherSquad);
    }

    static coordCanSee (coord, squad) {
        return squad.visibility >= coord.distanceTo(squad.coord);
    }

    preferredDistance () {
        const prefs = this.activeCreatures().map(
            cr => cr.weapon().preferredRange
        );

        return Util.mean(prefs);
    }

    update () {
        if (this.isKO()) {
            return;
        }
 
        const events = this.creatures.map(cr => cr.update())
            .filter(e => !! e);

        this.resetVisibility();
        this.ready = true;

        return events;
    }

    resetVisibility () {
        const DEFAULT = 99;

        this.visibility = Util.max(
            this.activeCreatures().map(cr => cr.template.visibility || DEFAULT)
        )
        || DEFAULT;
    }

    attack (targetSquad) {
        let manyEvents = [];
        const creatures = this.activeCreatures();
        for (let cr of creatures) {
            const events = cr.attack(targetSquad);
            manyEvents = manyEvents.concat(events);
        }

        // Util.logDebug(`Squad.attack(), manyEvents.map(e => e.constructor.name).join(', ')=${manyEvents.map(e => e.constructor.name).join(', ')}`);

        this.visibility += creatures.length;
        // LATER make sure visibility & ready changes are well integrated with event system. Motive: visibility might need displaying.

        return manyEvents;
    }

    whoGotHit () {
        let roll = Math.random() * this.size();

        for (let cr of this.activeCreatures()) {
            roll -= cr.template.size;

            if (roll <= 0) {
                return cr;
            }
        }

        Util.logDebug(`Squad.whoGotHit() default case happened for Squad ${this.id}.`);
        return this.creatures[this.creatures.length - 1];
    }

    // For display
    static attackColor (events) {
        const colors = {};

        // Util.logDebug(`Squad.attackColor(), top of func. events.map(e => e.constructor.name).join(', ')=${events.map(e => e.constructor.name).join(', ')}`);

        for (let event of events) {
            // Util.logDebug(`Squad.attackColor(), top of for loop. event.type=${event.type}, event.constructor.name=${event.constructor.name}, event=${event}`);
            // Util.logDebug(`Squad.attackColor(), top of for loop. event.type=${event.type}, event.toJson()=${Util.stringify(event.toJson())}`);
            if (event.type !== Event.TYPE.Attack) { continue; }

            const color = event.details.weaponTemplate?.color;
            // Util.logDebug(`Squad.attackColor(), before if statement. color=${color}`);
            if (color) {
                if (colors[color]) {
                    colors[color] += 1;
                }
                else {
                    colors[color] = 1;
                }
            }
        }

        let commonest = 'yellow';
        let appearances = 0;

        for (let color in colors) {
            if (colors[color] > appearances) {
                appearances = colors[color];
                commonest = color;
            }
        }

        // Util.logDebug(`Squad.attackColor(), event types =${events.map(e => e.type).join(', ')}, events[0].details.weaponTemplate=${Util.stringify(events[0].details.weaponTemplate)}, events[0].details.weaponTemplate?.color=${events[0].details.weaponTemplate?.color} commonest=${commonest}, appearances=${appearances} - ` + Util.stringify(colors))

        return commonest;
    }

    imageURL () {
        return Squad.IMAGE_PREFIX + this.template.image;
    }

    imageName () {
        const fullName = this.template.image;

        if (! fullName) { return 'cryptum'; } // LATER instead of placeholder image, draw squad name as text in square.

        return fullName.split('.')[0]; // Remove extension
    }

    // 2 Grunts (5, 0)
    terse () {
        // Util.logDebug(`Squad.terse(): coord=${this.coord.toString()}, this.koSummary()=${this.koSummary()}`);

        const representative = this.isKO() ?
            this.creatures[0] :
            this.activeCreatures()[0];

        const name = representative?.template.name || `<empty Squad>`;

        return `${this.quantity()} ${name}s ${this.coord.toString()}`;
    }

    // For debugging
    koSummary () {
        return this.creatures.map(
            cr => cr.isKO() ? 'KO' : 'Active'
        )
        .join(',');
    }

    healthBar () {
        if (this.isKO()) {
            return 0;
        }

        return Util.mean(
            this.activeCreatures().map(
                cr => cr.healthBar()
            )
        );
    }

    commonestCreature () {
        return Util.commonest(
            this.creatures.map(cr => cr.template.name)
        );
    }

    toJson () {
        const json = Util.certainKeysOf(
            this, 
            ['id', 'template', 'coord', 'ready']
        );
        json.faction = this.faction();

        json.creatures = this.creatures.map(cr => cr.toJson());

        return json;
    }

    toJsonStr () {
        return Util.stringify(this.toJson());
    }

    static phoneticAlphabet () {
        return ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
    }

    static koSquad (coord) {
        return new Squad(
            Templates.General.General.Squad.KO,
            undefined,
            coord,
        );
    }

    static example (key, coord) {
        const examples = {
            Marine: {
                template: Templates.Halo.UNSC.Squad.Marine,
                // team: Squad.TEAM.Player, // LATER use template faction names for .team, instead of Player/Enemy
            },
            Grunt: {
                template: Templates.Halo.Covenant.Squad.Grunt,
                // team: Squad.TEAM.Enemy,
            },
        };

        const info = examples[key] || examples.Marine;

        const sq = new Squad(
            info.template,
            undefined,
            coord || Coord.random2d(9),
        );

        return sq;
    }

    static randomOfFaction (factionKey, coord) {
        return new Squad(
            Templates.randomSquad(factionKey),
            undefined,
            coord || Coord.random2d(9),
        );
    }
}

Squad.TEAM = {
    Player: 'player',
    Enemy: 'enemy',
};

Squad.IMAGE_PREFIX = 'https://alexpear.github.io/gridView/images/';

module.exports = Squad;
