'use strict';

const DetailedPerson = require('./detailedPerson.js');

const WizardingName = require('../generation/wizardingName.js');

const Util = require('../util/util.js');

class WizardingPerson extends DetailedPerson {
    constructor (startedSchool, gender, house) {
        super();

        this.startedSchool = startedSchool || this.startedSchool;
        this.gender = gender || this.gender;
        this.house = house || this.house;
    }

    static random (startedSchool, gender, house) {
        const p = new WizardingPerson(startedSchool, gender, house);
        p.fillBlanks();
        return p;
    }

    fillBlanks () {
        this.name = this.name || wizardingName.random();

        this.startedSchool = this.startedSchool ||
            (1980 + Util.randomUpTo(20));

        this.gender = this.gender || Util.randomOf('female', 'male');
        this.house = this.house || Util.randomOf('ravenclaw', 'slytherin', 'gryffindor', 'hufflepuff');
    }
};

module.exports = WizardingPerson;
