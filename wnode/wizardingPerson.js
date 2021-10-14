'use strict';

const DetailedPerson = require('./detailedPerson.js');

const TraitGrid = require('../bottleWorld/traitGrid.js');

const WizardingName = require('../generation/wizardingName.js');

const Util = require('../util/util.js');

class WizardingPerson extends DetailedPerson {
    constructor (startingYear, gender, house, name) {
        super();

        this.startingYear = startingYear;
        this.gender = gender;
        this.house = house;
        this.name = name;
        this.traitGrid = TraitGrid.random();
    }

    static random (startingYear, gender, house) {
        const p = new WizardingPerson(startingYear, gender, house);
        p.fillBlanks();
        return p;
    }

    fillBlanks () {
        this.name = this.name || WizardingName.random();

        this.startingYear = this.startingYear ||
            (1980 + Util.randomUpTo(20));

        this.gender = this.gender || Util.randomOf(['female', 'male']);
        this.house = this.house || Util.randomOf(['ravenclaw', 'slytherin', 'gryffindor', 'hufflepuff']);
    }

    lastFirst () {
        return WizardingName.lastFirst(this.name);
    }

    static test () {
        const p = WizardingPerson.random();
        Util.logDebug(p);
    }
};

module.exports = WizardingPerson;

// WizardingPerson.test();

