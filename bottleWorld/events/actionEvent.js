'use strict';

const BEvent = require('../bEvent.js');
const Coord = require('../../util/coord.js');
const Util = require('../../util/util.js');

module.exports = class ActionEvent extends BEvent {
    // protagonist is a input param of type Thing|string. It will be used to populate the appropriate field of BEvent.
    constructor (protagonist, target, coord, actionId) {
        super(
            BEvent.TYPES.Action,
            protagonist,
            target,
            coord
        );

        this.actionId = actionId;
    }

    resolve (worldState) {
        // const protagonist = worldState.fromId(this.protagonistId);

        // // Later could relax the requirement that protagonist.template be populated, if that seems unnecessary.
        // if (
        //     ! protagonist.actions ||
        //     protagonist.actions().length === 0 ||
        //     ! protagonist.template
        // ) {
        //     throw new Error(`ActionReadyEvent found a strange protagonist (type ${protagonist.constructor.name}) in WorldState.things. { id: ${protagonist.id}, actions(): ${protagonist.actions ? protagonist.actions() : 'undefined'}, template: ${protagonist.template}, templateName: ${protagonist.templateName} }`);
        // }

        // const actions = protagonist.actions();

        // const action = actions.find(
        //     a => a.id === this.actionId
        // ) || actions[0];

        // const actionEvent = new ActionEvent();
    }
};
