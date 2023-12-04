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
        this.overviewPane = document.getElementById('companyOverview');
        if (! this.overviewPane) { return; }

        this.setUI();
    }

    setUI () {
        for (let company of this.companies) {
            this.addButton(company);

            for (let squad of company.squads) {
                this.addButton(squad);

                for (let creature of squad.creatures) {
                    this.addButton(creature);

                    for (let item of creature.items) {
                        this.addButton(item);
                    }
                }
            }
        }
    }

    addButton (component) {
        const INDENT_BASE = 20;

        const INDENT = {
            Company: 0,
            Squad: 1,
            Creature: 2,
            Item: 3
        };

        const button = this.buttonForComponent(component);
        const pixels = INDENT_BASE * INDENT[component.constructor.name];
        button.setAttribute('style', `margin-left: ${pixels}px;`);

        this.overviewPane.append(button);
    }

    buttonForComponent (component) {
        const button = document.createElement('button');
        button.setAttribute('class', 'component');
        // LATER - better to store these values as props of JS obj, or as HTML attrs?
        button.component = component;
        button.componentType = component.constructor.name;
        button.innerHTML = component.name();

        // const self = this;
        button.onclick = () => {
            const infoPane = document.getElementById('infoPane');

            // infoPane.innerHTML = button.component.name() + ' - ' + Util.stringify(button.component.toJson());
            infoPane.innerHTML = this.infoPaneContents(button.component, button);
        }

        return button;
    }

    infoPaneContents (component, button) {
        const componentType = button?.componentType;

        //temp debug
        const pHtml = Util.htmlPassage(
            component.name() + ` (${componentType}) - ` + Util.stringify(component.toJson())
        );

        if (componentType === 'Company') {
            return pHtml + this.infoPaneButton('New Squad', component);
        }

        const html = pHtml + this.infoPaneButton(`Remove ${componentType || 'This'}`, component);

        if (componentType === 'Squad') {
            return html + this.infoPaneButton('New Squad Member', component);
        }
        else if (componentType === 'Creature') {
            return html + this.infoPaneButton('New Item', component);
        }
        else if (componentType === 'Item') {
            return html;
        }

        Util.logError({
            componentType,
            componentJson: component.toJson(),
            error: `Customizer.infoPaneContents(): componentType not recognized.`,
        });

        return html;
    }

    infoPaneButton (text, relevantComponent) {
        const button = document.createElement('button');
        button.setAttribute('class', 'infoPaneButton');
        button.innerHTML = text;
        button.relevantComponent = relevantComponent;

        return button;
    }

    setCompanies (companies) {
        this.companies = companies;
        this.companies.map(c => c.nameSquads());
        this.initUI();
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
        cmizer.setCompanies(Customizer.exampleCompanies());

    }
}

module.exports = Customizer;

Customizer.run();
