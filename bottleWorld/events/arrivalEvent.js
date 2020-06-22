'use strict';

const ActionReadyEvent = require('./actionReadyEvent.js');
const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

const ArrivalEvent = module.exports = class ArrivalEvent extends BEvent {
    constructor (templatePath, coord, alignment) {
        super(
            BEvent.TYPES.Arrival,
            undefined,
            undefined,
            // TODO make BEvent files compatible with WorldStates of both continuous and grid spatial models.
            coord || Coord.randomOnScreen(),
            templatePath
        );

        this.alignment = alignment;
    }

    resolve (worldState) {
        const arriver = this.templatePath ?
            worldState.generateNodes(this.templatePath)[0] :
            worldState.fromId(this.templatePath);

        Util.logDebug('Here is what this ArrivalEvent is creating:' + arriver.typeTreeYaml());

        arriver.alignment = this.alignment || Util.randomOf(worldState.allAlignments());

        worldState.addNode(arriver, this.coord);

        // Util.logDebug(worldState.wanderingGenerator.toJson());

        // Util.logDebug(`arriver.templateName: ${arriver.templateName}, arriver.template: ${arriver.template}, arriver.constructor.name: ${arriver.constructor.name}, typeof arriver.actions: ${typeof arriver.actions}, typeof arriver.deepCopy: ${typeof arriver.deepCopy}`);

        const actions = Util.isFunction(arriver.getActions) && arriver.getActions();

        if (! actions || actions.length === 0) {
            Util.logDebug(`In ArrivalEvent,
    worldState.constructor.name: ${worldState.constructor.name},
    arriver.templateName: ${arriver.templateName},
    arriver.template: ${arriver.template},
    arriver.constructor.name: ${arriver.constructor.name},
    typeof arriver.getActions: ${typeof arriver.getActions},
    typeof arriver.actions: ${typeof arriver.actions},
    arriver.template.actions.length: ${arriver.template && arriver.template.actions.length},
    typeof arriver.deepCopy: ${typeof arriver.deepCopy},
    arriver.components[0].templateName: ${arriver.components[0] && arriver.components[0].templateName},
    arriver.components[1].templateName: ${arriver.components[1] && arriver.components[1].templateName},
    arriver.components[1].constructor.name: ${arriver.components[1] && arriver.components[1].constructor.name},
    arriver.toJson() is the following:
    ${arriver.toJson()}`);

            // throw new Error(`Debug throwing to figure out why ArrivalEvent receives something with no actions.`);

            return;
        }

        // LATER, remove this preference for homogenous actions
        const preferredAction = actions.find(a => a.name === 'dmr');
        const chosenAction = preferredAction || actions[0];

        const actionReadyEvent = new ActionReadyEvent(arriver, chosenAction.id);

        this.addOutcome(actionReadyEvent, worldState, this.t + ArrivalEvent.ACTION_DELAY);

        // Later ignore that ACTION_DELAY placeholder in favor of information found in codex templates.
    }
};

ArrivalEvent.ACTION_DELAY = 1;
