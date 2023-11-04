'use strict';

// const Creature = require('./creature.js');
const Squad = require('./squad.js');
// const Action = require('./action.js');
// const Item = require('./Item.js');
// const Templates = require('./templates.js');
// const Event = require('./event.js');
// const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

class Company {
    constructor (team) {
        // this.id = Util.uuid();
        // this.team = team;

        // for (let i = 1; i <= this.template.quantity; i++) {
        //     const cr = new Creature(this.template.creature); // todo translate Creature.Grunt string
        //     this.creatures.push(cr);
        //     cr.squad = this;
        // }
    }

    terse () {
        // const representative = this.quantity() >= 1 ?
        //     this.activeCreatures()[0] :
        //     this.creatures[0];

        // const name = representative.template.name;

        // return `${this.quantity()} ${name}s ${this.coord.toString()}`;
    }

    healthBar () {

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
        // const examples = {
        //     Marine: {
        //         template: Templates.Halo.UNSC.Squad.Marine,
        //         team: Squad.TEAM.Player, // LATER use template faction names for .team, instead of Player/Enemy
        //     },
        //     Grunt: {
        //         template: Templates.Halo.Covenant.Squad.Grunt,
        //         team: Squad.TEAM.Enemy,
        //     },
        // };

        // const info = examples[key] || examples.Marine;

        // const sq = new Squad(
        //     info.template,
        //     info.team,
        //     coord || Coord.random2d(9),
        // );

        // return sq;
    }
}

module.exports = Company;
