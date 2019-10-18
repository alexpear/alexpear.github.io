'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

// BEvent stands for Bottle World Event
const BEvent = module.exports = class BEvent {
    constructor (eventType, protagonist, target, coord, templateName) {

        // type string
        this.eventType = eventType;

        // type string
        this.protagonistId = (protagonist && protagonist.id) || protagonist;

        // type string
        this.targetId = (target && target.id) || target;

        // type Coord
        this.coord = coord;

        // type string
        this.templateName = templateName;

        // type object
        this.props = {};

        // type BEvent[]
        this.outcomes = [];  // Array of other BEvent
    }

    // NOTE In 2019 July i decided to have BEvents point to ids of Things rather than to Things in-memory.
    // The alternative, if id lookups cause too much slowdown, would be to have BEvents point to full Things in-memory and go back to using BEvent.serializable() to convert to id-based non-circular-ref versions for persistence.

    // TODO (ToW 2019 Oct 17) i desire to reverse this decision. The way i see it now (2019 Oct) i can either translate between string and object once, upon persisting and loading, or i can do it many times (whenever i interact with a BEvent in-memory). But reversing it is not a priority right this minute.

    // TODO probably make subclasses of BEvent for Arrival, Explosion, etc.
    // Each could probably even have a .resolve() member func.

    // static departure (protagonist) {
    //     return new BEvent(BEvent.TYPES.Departure, protagonist);
    // }

    // // Might later revise this. Maybe some actions can be performed with a parameter.
    // static action (protagonist, target, coord, actionType) {
    //     const event = new BEvent(BEvent.TYPES.Action, protagonist, target, coord);
    //     event.actionType = actionType;
    //     return event;
    //     // Outcome information is to be stored in a separate Update event.
    // }

    // // Builds a chain of BEvent of length up to 3
    // // Does not work for splash damage or other attacks with complex effects.
    // static simpleAttack (protagonist, target, actionType, damage, targetDead) {
    //     const actionEvent = new BEvent(BEvent.TYPES.Action, protagonist, target);

    //     const damageProps = {
    //         hp: -1 * damage,
    //         relative: true
    //     };

    //     const damageEvent = BEvent.update(target, damageProps)
    //     actionEvent.outcomes.push(damageEvent);

    //     if (targetDead) {
    //         actionEvent.outcomes.push(
    //             BEvent.death(target)
    //         );
    //     }

    //     return actionEvent;
    // }

    // static death (protagonist) {
    //     return new BEvent(BEvent.TYPES.Death, protagonist);
    // }

    // static newTarget (protagonist, target) {
    //     return new BEvent(BEvent.TYPES.NewTarget, protagonist, target);
    // }

    // static newDestination (protagonist, coord) {
    //     return new BEvent(BEvent.TYPES.NewDestination, protagonist, undefined, coord);
    // }

    // static update (protagonist, props) {
    //     const event = new BEvent(BEvent.TYPES.Update, protagonist);

    //     event.props = props;

    //     return event;
    // }

    // static explosion (coord, radius, damage) {
    //     const event = new BEvent(BEvent.TYPES.Explosion, undefined, undefined, coord);

    //     event.props.radius = radius;
    //     event.props.damage = damage;

    //     return event;
    // }

    // static effect (coord, props) {
    //     const event = new BEvent(BEvent.TYPES.Effect, undefined, undefined, coord);

    //     event.props = props;

    //     return event;
    // }

    // // The runEvery parameter stores the duration (number, probably seconds) between instances of this recurring event.
    // static universalUpdate (runEvery, updateType, specialProps) {
    //     const event = new BEvent(BEvent.TYPES.UniversalUpdate);

    //     Object.assign(event.props, specialProps);
    //     event.props.runEvery = runEvery;
    //     event.props.updateType = updateType;

    //     return event;
    // }
};


// TODO write the other subclass files

BEvent.TYPES = Util.makeEnum([
    'Arrival',
    'Departure',
    'Action',
    'Death',
    'NewTarget',
    'NewDestination',
    'ActionReady',
    'Update',
    'Explosion',
    'Effect',
    'UniversalUpdate'
]);
