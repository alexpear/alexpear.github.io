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
        this.companies = [];
        this.initUI();
    }

    initUI () {
        window.customizer = this;

        this.setUI();
    }

    setUI () {
        for (let company of this.companies) {


            for (let squad of company.squads) {


                for (let creature of squad.creatures) {


                    for (let item of creature.items) {
                        
                    }
                }
            }
        }
    }

    static exampleCompanies () {
        return [Company.example()];
    }

    static test () {
        Util.logDebug(`Customizer.test() - All tests finished.`);
    }

    static async run () {
        // Customizer.test();

        const cmizer = new Customizer();
        cmizer.companies = Customizer.exampleCompanies();

    }
}

module.exports = Customizer;

Customizer.run();
