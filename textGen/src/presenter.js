'use strict';

const Bionicle = require('./bionicle.js');
const ScienceFantasy = require('./dracolich.js');
const WizardingName = require('./wizardingName.js');
const Util = require('../../util/util.js');

class Presenter {
    generators () {
        return {
            bionicle: Bionicle,
            dracolich: ScienceFantasy,
            wizardingName: WizardingName,
        };
    }

    static init () {
        window.presenter = new Presenter();
        window.presenter.setHTML();
    }

    setHTML () {
        // console.log(`top of setHTML()`);

        const dropdownElement = document.getElementById('genDropdown');
        const gen = this.generators()[dropdownElement.value];

        // console.log(`dropdown.value is ${dropdownElement.value} & gen is ${gen.constructor.name} & !!gen.randomItem is ${!! gen.randomItem}`);

        const descElement = document.getElementById('description');
        descElement.innerHTML = gen.outputHTML();
    }

    static run () {
        Presenter.init();
    }
}

module.exports = Presenter;

Presenter.run();