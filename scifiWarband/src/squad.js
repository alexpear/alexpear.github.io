'use strict';

const Creature = require('./creature.js');
// const Squad = require('./squad.js');
// const Action = require('./action.js');
// const Item = require('./Item.js');
const Templates = require('./templates.js');

// const Event = require('./event.js');

const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

class Squad {
    constructor (squadTemplate, team, coord) {
        this.id = Util.uuid();
        this.template = squadTemplate;
        this.creatures = [];
        this.team = team;
        this.coord = coord || new Coord();
        this.ready = true;

        // Note that this is how you create a homogenous squad from a template. LATER, might often have heterogenous squads coming from customization choices or from a save file.
        for (let i = 1; i <= this.template.quantity; i++) {
            const cr = new Creature(this.template.creature); // todo translate Creature.Grunt string 
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
    // TODO - decide whether to use squares as unit for codex stats (meaning i cant change meters per square) or express in meters.
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
        const representative = this.quantity() >= 1 ?
            this.activeCreatures()[0] :
            this.creatures[0];

        const name = representative.template.name;

        return `${this.quantity()} ${name}s ${this.coord.toString()}`;
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

    toJson () {
        const json = Util.certainKeysOf(
            this, 
            ['id', 'template', 'team', 'coord', 'ready']
        );

        json.creatures = this.creatures.map(cr => cr.toJson());

        return json;
    }

    static example (key) {
        const examples = {
            Marine: {
                template: Templates.Halo.UNSC.Squad.Marine,
                team: Squad.TEAM.Player,
            },
            Grunt: {
                template: Templates.Halo.Covenant.Squad.Grunt,
                team: Squad.TEAM.Enemy,
            },
        };

        const info = examples[key] || examples.Marine;

        const sq = new Squad(
            info.template,
            info.team,
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

module.exports = Squad;