'use strict';

const Bionicle = require('./bionicle.js');
const DominionCard = require('./dominionCard.js');
const Humanistas = require('./humanistas.js');
const Loadout = require('./loadout.js');
const MassEffect = require('./massEffect.js');
const Mispronounce = require('./mispronounce.js');
const Nicknames = require('./nicknames.js');
const ScienceFantasy = require('./dracolich.js');
const Titles = require('./wildbowTitles.js');
const WizardingName = require('./wizardingName.js');
const Util = require('../../util/util.js');

class Presenter {
    constructor () {
        this.dropdownElement = document.getElementById('genDropdown');
        this.descElement     = document.getElementById('description');

        this.setDropdownFromURL()
        this.setHTML();
    }

    generators () {
        return {
            bionicle: Bionicle,
            dominionCard: DominionCard,
            dracolich: ScienceFantasy,
            humanistas: Humanistas,
            loadout: Loadout,
            massEffect: MassEffect,
            mispronounce: Mispronounce,
            nicknames: Nicknames,
            wildbowTitles: Titles,
            wizardingName: WizardingName,
        };
    }

    static init () {
        window.presenter = new Presenter();
    }

    setDropdownFromURL () {
        const params = new URLSearchParams(window.location.search);
        // TODO test no-param case, use ?. if needed
        const startValue = params.get('gen');

        Util.logDebug({
            dropdownElement: this.dropdownElement,
            options: this.dropdownElement.options,
            params,
            startValue,
        });

        const optionsArray = Array.from(this.dropdownElement.options);
        
        const thatOption = optionsArray.find(
            op => op.value === startValue
        );

        // BTW - These parens are for clarity, not necessity.
        if ((! startValue) || (! thatOption)) { return; }

        thatOption.setAttribute('selected', 'selected');
    }

    setHTML () {
        // console.log(`top of setHTML()`);

        const gen = this.generators()[this.dropdownElement.value];

        // console.log(`dropdown.value is ${this.dropdownElement.value} & gen is ${gen.constructor.name} & !!gen.randomItem is ${!! gen.randomItem}`);

        this.descElement.innerHTML = gen.outputHTML();
    }

    static run () {
        Presenter.init();
    }
}

module.exports = Presenter;

Presenter.run();
