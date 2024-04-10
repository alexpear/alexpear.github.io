'use strict';

// Army customization UI class

const Creature = require('./creature.js');
const Company = require('./company.js');
const Item = require('./item.js');
const Squad = require('./squad.js');
const Util = require('../../util/util.js');

class Customizer {
    constructor () {
        this.companies = [];
        this.unusedComponents = [];
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

    refreshOverview () {
        Util.clearHtmlChildren(this.overviewPane);
        this.setUI();
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
        button.componentType = component.type();
        button.innerHTML = component.name();

        button.onclick = () => this.setInfoPane(button);

        return button;
    }

    // subject can be a button or a Component or undefined.
    // LATER - would like to visually highlight the button in left overview pane corresponding to selectedComponent.
    setInfoPane (subject) {
        const component = subject?.component || subject || this.selectedComponent;
        const componentType = component.type();
        this.selectedComponent = component;

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
            this.addInfoPaneButton(
                'New Squad',
                component,
                () => this.setChooseNewComponentMenu(component),
            );
        }
        else {
            this.addInfoPaneButton(
                `Remove ${componentType || 'This'}`,
                component,
                () => this.removeComponent(component),
            );
        }

        if (componentType === 'Squad') {
            this.addInfoPaneButton(
                'New Squad Member',
                component,
                () => this.setChooseNewComponentMenu(component),
            );
        }
        else if (componentType === 'Creature') {
            this.addInfoPaneButton(
                'New Item',
                component,
                () => this.setChooseNewComponentMenu(component),
            );
        }
        else if (! ['Item', 'Company'].includes(componentType)) {
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

    addInfoPaneButton (text, relevantComponent, func) {
        const button = document.createElement('button');
        button.setAttribute('class', 'infoPaneButton');
        button.innerHTML = text;
        button.relevantComponent = relevantComponent;
        button.onclick = func;

        this.infoPane.appendChild(button);

        return button;
    }

    setChooseNewComponentMenu (parent) {
        this.selectedComponent = parent;

        Util.clearHtmlChildren(this.infoPane);

        this.infoPane.appendChild(
            Util.pElement(
                `Add a new ${parent.childType()} to ${parent.type()} ${parent.name()}:`,
                'infoPaneTitle',
            )
        );

        const cancelButton = Util.button(
            'Cancel',
            'infoPaneButton',
            () => {
                this.setInfoPane(parent);
            },
        );
        this.infoPane.appendChild(cancelButton);

        let newComponentOptions;

        if (parent.type() === 'Company') {
            newComponentOptions = [new Squad()];
        }
        else {
            newComponentOptions = this.unusedComponents.filter(
                compo => compo.type() === parent.childType()
            );
        }

        newComponentOptions.map(unusedCompo => {
            const newComponentButton = Util.button(
                unusedCompo.name(),
                'infoPaneButton',
            );

            // These props might not be needed.
            newComponentButton.component = unusedCompo;
            newComponentButton.parent = parent;

            newComponentButton.onclick = () => this.addComponent(unusedCompo, parent);

            this.infoPane.appendChild(newComponentButton);
        });

        if (newComponentOptions.length === 0) {
            `We don't have any more ${parent.childType()}s left, sorry.`
        }
    }

    addComponent (unusedCompo, parent) {
        parent.addChild(unusedCompo);

        this.unusedComponents = this.unusedComponents.filter(c => c !== unusedCompo);

        this.setInfoPane(unusedCompo);
        this.refreshOverview();
    }

    removeComponent (component) {
        this.selectedComponent = component.parent;
        component.removeSelf();

        this.unusedComponents.push(component);

        // TODO - if component has children, flatten the tree & push each Creature & Item separately.
        // And dont push Companies or Squads in any case.

        this.setInfoPane();
        this.refreshOverview();
    }

    setCompanies (companies) {
        this.companies = companies;
        this.companies.map(c => c.nameSquads());
        this.selectedComponent = this.companies[0];
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

        cmizer.companies.map(company => company.sanityCheck());

    }
}

module.exports = Customizer;

Customizer.run();
