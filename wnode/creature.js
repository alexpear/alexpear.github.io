'use strict';

const Thing = require('./thing.js');

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

/*
Desire: Creature and Group should be more easily interchangeable.
Should share more funcs, perhaps.
*/

// Later i may decide to move this class into the bottleWorld/ dir, if it doesnt feel generic enough for the wnode/ dir.
module.exports = class Creature extends Thing {
    constructor (template, coord, alignment) {
        throw new Error(`Let's use Group of quantity 1 instead of Creature for a little while. template param was ${template.name || template}`);

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

    chooseTarget (worldState, actionTemplate) {
        // Later, actionTemplate can inform whether some targets are a bad idea for that action.

        const nonAllies = worldState.nodesWithout(
            {
                alignment: this.alignment
            }
        );

        return Util.randomOf(nonAllies);
    }

    static example () {
        return Creature.humanExample();
    }

    static humanExample () {
        const human = new Creature('human', undefined, 'LG');

        human.sp = 10;
        human.size = 2;

        return human;
    }
};
