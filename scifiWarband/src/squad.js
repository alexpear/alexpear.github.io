'use strict';

// const Creature = require('./creature.js');
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

        const info = example[key] || example.Marine;

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
