'use strict';

// Army customization UI class

const Creature = require('./creature.js');
const Company = require('./company.js');
const Item = require('./item.js');
const Squad = require('./squad.js');
const Templates = require('./templates.js');
const Util = require('../../util/util.js');

class Customizer {
    constructor () {
        this.companies = Customizer.exampleCompanies();
        this.initUI();
    }

    initUI () {
        window.customizer = this;


    }

    static exampleCompanies () {
        return [Company.example()];
    }

    static test () {
        Util.logDebug(`Customizer.test() - All tests finished.`);
    }

    static async run () {
        // Customizer.test();

    }
}

module.exports = Customizer;

Customizer.run();
