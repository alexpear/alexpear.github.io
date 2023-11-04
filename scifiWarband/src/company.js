'use strict';

// const Creature = require('./creature.js');
const Squad = require('./squad.js');
// const Action = require('./action.js');
// const Item = require('./Item.js');
const Templates = require('./templates.js');
// const Event = require('./event.js');
// const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

class Company {
    constructor (faction) {
        this.id = Util.uuid();
        this.name = this.id;
        this.faction = faction;
        this.squads = [];
    }

    terse () {
        // return `${this.quantity()} ${name}s ${this.coord.toString()}`;
    }

    activeSquads () {
        return this.squads.filter(sq => ! sq.isKO());
    }

    activeSquadCount () {
        return this.activeSquads().length;
    }

    healthBar () {
        return this.activeSquadCount() / this.squads.length;
    }

    nameSquads () {
        
    }

    toJson () {
        // const json = Util.certainKeysOf(
        //     this,
        //     ['id', 'template', 'team', 'coord', 'ready']
        // );

        // json.creatures = this.creatures.map(cr => cr.toJson());

        // return json;
    }

    static example () {
        const comp = new Company(Templates.Halo.UNSC.name);

        comp.squads = Company.exampleSquads();
        return comp;
    }

    static exampleSquads () {
        const squads = [];

        for (let i = 0; i < 3; i++) {
            squads.push(Squad.example('Marine'));
        }

        return squads;
    }
}

module.exports = Company;
