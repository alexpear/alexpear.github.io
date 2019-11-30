'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');
const Thing = require('./thing.js');

// Later i may decide to move this class into the bottleWorld/ dir, if it doesnt feel generic enough for the wnode/ dir.
module.exports = class Creature extends Thing {
    constructor (template, coord, alignment) {
        super(template, coord);

        // Util.logDebug(`Creature constructor, after super(). template param is ${template}. this.template.actions.length is ${this.template && this.template.actions.length}`);

        // Faction or temperament
        this.alignment = alignment;

        this.lastAction = undefined;
    }

    getActions (worldState) {
        const template = this.template ||
            (worldState && worldState.glossary[this.templateName]);

        const localActions = template ?
            (template.actions || []) :
            [];

        return this.components.reduce(
            (actions, wnode) => actions.concat(
                Util.isFunction(wnode.getActions) ?
                    wnode.getActions() :
                    []
            ),
            localActions
        );
    }

    actionFromId (id) {
        return this.getActions().find(
            action => action.id === id
        );
    }

    // Recursion is necessary when base chassis traits are stored in a component WNode
    findTrait (trait) {
        if (this.template && this.template[trait]) {
            return this.template[trait];
        }

        for (let i = 0; i < this.components.length; i++) {
            const child = this.components[i];

            // We dont want the stat from a item, or a modifier stat for example. We want something applicable to creatures.
            if (child.constructor.name !== 'Creature') {
                continue;
            }

            const childTrait = this.components[i].template &&
                this.components[i].template[trait];

            if (Util.exists(childTrait)) {
                return childTrait;

                // Note that if this trait is present on multiple components, this returns a arbitrary one.
            }
        }

        return undefined;
    }

    chooseTarget (worldState, actionTemplate) {
        // Later, actionTemplate can inform whether some targets are a bad idea for that action.

        const nonAllies = worldState.thingsWithout(
            {
                alignment: this.alignment
            }
        );

        return Util.randomOf(nonAllies);
    }
};
