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

        this.infoPane = document.getElementById('infoPane');

        this.setUI();
    }

    setUI () {
        for (let company of this.companies) {
            this.addButton(company);

            for (let squad of company.children) {
                this.addButton(squad);

                for (let creature of squad.children) {
                    this.addButton(creature);

                    for (let item of creature.children) {
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
        button.componentType = component.constructor.name; // LATER add member func component.type()
        button.innerHTML = component.name();

        button.onclick = () => this.setInfoPane(button);

        return button;
    }

    setInfoPane (button) {
        const component = button.component;
        const componentType = button?.componentType;

        Util.clearHtmlChildren(this.infoPane);

        const titleP = document.createElement('p');
        titleP.innerHTML = `${component.name()} (${componentType})`;
        titleP.setAttribute('class', 'infoPaneTitle');
        this.infoPane.appendChild(titleP);

        Util.logDebug({
            componentType,
            componentJson: component.toJson(),
            context: `Customizer.infoPaneContents(): before if(Company). `,
            // pInnerHtml: infoPHtml.innerHTML,
        });

        if (componentType === 'Company') {
            const newSquadButton = this.infoPaneButton('New Squad', component);

            // LATER onclick

            this.infoPane.appendChild(newSquadButton);
        }
        else {
            const removeButton = this.infoPaneButton(`Remove ${componentType || 'This'}`, component);

            // removeButton.onclick = () => this.removeComponent(component, parent);

            this.infoPane.appendChild(removeButton);
        }

        if (componentType === 'Squad') {
            const newMemberButton = this.infoPaneButton('New Squad Member', component);

            // LATER onclick

            this.infoPane.appendChild(newMemberButton);
        }
        else if (componentType === 'Creature') {
            const newItemButton = this.infoPaneButton('New Item', component);

            // LATER onclick

            this.infoPane.appendChild(newItemButton);
        }
        else if (componentType === 'Item') {
            const unused = 0;
        }
        else if (componentType !== 'Company') {
            Util.logError({
                componentType,
                componentJson: component.toJson(),
                error: `Customizer.infoPaneContents(): componentType not recognized.`,
            });
        }

        //temp debug
        const infoPHtml = document.createElement('p');
        infoPHtml.innerHTML = Util.stringify(component.toJson());
        infoPane.appendChild(infoPHtml);
    }

    infoPaneButton (text, relevantComponent) {
        const button = document.createElement('button');
        button.setAttribute('class', 'infoPaneButton');
        button.innerHTML = text;
        button.relevantComponent = relevantComponent;

        return button;
    }

    setNewComponentMenu (button) {
        this.selectedComponent = button.component;

        Util.clearHtmlChildren(this.infoPane);

        this.infoPane.appendChild(
            Util.pElement(
                `Add ${'<type>'} to ${this.selectedComponent.type()} ${this.selectedComponent.name()}:`,
                'infoPaneTitle',
            )
        );

        const cancelButton = Util.button(
            'Cancel',
            'infoPaneButton',
            undefined, // onclick LATER
        );
        this.infoPane.appendChild(cancelButton);

        const newComponentTemplates = [
            // temp wip
            Templates.Halo.UNSC.Item.SMG,
            Templates.Halo.UNSC.Item.SMG,
            Templates.Halo.UNSC.Item.SMG,
        ];

        newComponentTemplates.map(template => {
            const newComponentButton = Util.button(
                template.name,
                'infoPaneButton',
            );

            newComponentButton.template = template;
            newComponentButton.relevantComponent = this.selectedComponent;

            button.onclick = () => this.addComponent(
                newComponentButton.template,
                newComponentButton.relevantComponent
            );

            this.infoPane.appendChild(newComponentButton);
        });
    }

    addComponent (template, relevantComponent) {
        let newComponent;

        if (relevantComponent.type() === 'Company') {
            newComponent = new Squad(template);
        }
        else if (relevantComponent.type() === 'Squad') {
            newComponent = new Creature(template);
        }
        else if (relevantComponent.type() === 'Creature') {
            newComponent = new Item(template);
        }

        relevantComponent.addChild(newComponent);
        this.selectedComponent = newComponent;

        // Refresh left pane
    }

    removeComponent (component, parent) {

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
