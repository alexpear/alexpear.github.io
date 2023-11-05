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
        this.faction = faction;
        this.squads = [];
    }

    terse () {
        // return `${this.quantity()} ${name}s ${this.coord.toString()}`;
    }

    name () {
        return this.nameFromUser || this.nameGenerated || ('Company ' + Util.shortId(this.id));
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
        for (let squad of this.squads) {
            this.nameSquad(squad);
        }
    }

    nameSquad (squad) {
        if (squad.nameFromUser) { return; }

        const names = this.squads.map(sq => sq.existingName());

        if (squad.nameGenerated) {
            const squadsWithThatName = names.filter(name => name === squad.nameGenerated);

            if (squadsWithThatName.length === 1) { return; }
        }

        const commonestCreatureName = Util.commonest(
            squad.creatures.map(cr => cr.template.name)
        );

        const similarNames = names.filter(
            name => name?.startsWith(commonestCreatureName + ' Squad ')
        );

        const suffixesUsed = similarNames.map(
            name => name.split(' Squad ')[1]
        );

        for (let letter of Squad.phoneticAlphabet()) {
            if (! suffixesUsed.includes(letter)) {
                squad.nameGenerated = commonestCreatureName + ' Squad ' + letter;
                return;
            }
        }

        squad.nameGenerated = commonestCreatureName + ' Squad ' + Util.newId(3).toUpperCase();
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
        comp.nameSquads();
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
