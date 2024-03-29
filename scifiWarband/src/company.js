'use strict';

// A Company is the main top-level grouping of Squads in the Warband game.

const Component = require('./component.js');
const Squad = require('./squad.js');
const Templates = require('./templates.js');
const Util = require('../../util/util.js');

class Company extends Component {
    constructor (faction) {
        super();
        this.faction = faction;
    }

    terse () {
        // return `${this.quantity()} ${name}s ${this.coord.toString()}`;
    }

    name () {
        return this.nameFromUser || this.nameGenerated || ('Company ' + Util.shortId(this.id));
    }

    activeSquads () {
        return this.children.filter(sq => ! sq.isKO());
    }

    activeSquadCount () {
        return this.activeSquads().length;
    }

    healthBar () {
        return this.activeSquadCount() / this.children.length;
    }

    nameSquads () {
        for (let squad of this.children) {
            this.nameSquad(squad);
        }
    }

    nameSquad (squad) {
        if (squad.nameFromUser) { return; }

        const names = this.children.map(sq => sq.existingName());

        if (squad.nameGenerated) {
            const squadsWithThatName = names.filter(name => name === squad.nameGenerated);

            if (squadsWithThatName.length === 1) { return; }
        }

        const commonestCreatureName = Util.commonest(
            squad.children.map(cr => cr.template.name)
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
        const json = super.toJson();
        json.faction = this.faction;
        return json;
    }

    static example () {
        const comp = new Company(Templates.Halo.UNSC.name);

        comp.addExampleSquads();
        comp.nameSquads();

        return comp;
    }

    addExampleSquads () {
        for (let i = 0; i < 3; i++) {
            this.addChild(Squad.example('Marine'));
        }
    }
}

module.exports = Company;
