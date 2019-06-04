'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

// BEvent stands for Bottle World Event
const BEvent = module.exports = class BEvent {
    constructor (eventType, protagonist, target, coord) {
        this.eventType = eventType;

        // Protagonist could be: a specific Thing, or a string templateName of a CreatureTemplate (used in Arrival BEvents).
        this.protagonist = protagonist;
        this.target = target;
        this.coord = coord;
        this.props = {};
        this.outcomes = [];  // Array of other BEvent
    }

    serializable () {
        const smallVersion = Object.assign({}, this);

        // Serialize just the ids of linked objects. Gets rid of circular reference and saves space.
        smallVersion.protagonist = this.protagonist && this.protagonist.id ?
            this.protagonist.id :
            this.protagonist;
        smallVersion.target = this.target && this.target.id ?
            this.target.id :
            this.target;
        smallVersion.outcomes = this.outcomes.map(event => event.serializable());

        return smallVersion;
    }

    // TODO probably make subclasses of BEvent for Arrival, Explosion, etc.
    // Each could probably even have a .resolve() member func.

    static departure (protagonist) {
        return new BEvent(BEvent.TYPES.Departure, protagonist);
    }

    // Might later revise this. Maybe some actions can be performed with a parameter.
    static action (protagonist, target, coord, actionType) {
        const event = new BEvent(BEvent.TYPES.Action, protagonist, target, coord);
        event.actionType = actionType;
        return event;
        // Outcome information is to be stored in a separate Update event.
    }

    // Builds a chain of BEvent of length up to 3
    // Does not work for splash damage or other attacks with complex effects.
    static simpleAttack (protagonist, target, actionType, damage, targetDead) {
        const actionEvent = new BEvent(BEvent.TYPES.Action, protagonist, target);

        const damageProps = {
            hp: -1 * damage,
            relative: true
        };

        const damageEvent = BEvent.update(target, damageProps)
        actionEvent.outcomes.push(damageEvent);

        if (targetDead) {
            actionEvent.outcomes.push(
                BEvent.death(target)
            );
        }

        return actionEvent;
    }

    static death (protagonist) {
        return new BEvent(BEvent.TYPES.Death, protagonist);
    }

    static newTarget (protagonist, target) {
        return new BEvent(BEvent.TYPES.NewTarget, protagonist, target);
    }

    static newDestination (protagonist, coord) {
        return new BEvent(BEvent.TYPES.NewDestination, protagonist, undefined, coord);
    }

    static actionReady (protagonist, actionType) {
        const event = new BEvent(BEvent.TYPES.ActionReady, protagonist);

        event.actionType = actionType;

        return event;
    }

    static update (protagonist, props) {
        const event = new BEvent(BEvent.TYPES.Update, protagonist);

        event.props = props;

        return event;
    }

    static explosion (coord, radius, damage) {
        const event = new BEvent(BEvent.TYPES.Explosion, undefined, undefined, coord);

        event.props.radius = radius;
        event.props.damage = damage;

        return event;
    }

    static effect (coord, props) {
        const event = new BEvent(BEvent.TYPES.Effect, undefined, undefined, coord);

        event.props = props;

        return event;
    }

    // The runEvery parameter stores the duration (number, probably seconds) between instances of this recurring event.
    static universalUpdate (runEvery, updateType, specialProps) {
        const event = new BEvent(BEvent.TYPES.UniversalUpdate);

        Object.assign(event.props, specialProps);
        event.props.runEvery = runEvery;
        event.props.updateType = updateType;

        return event;
    }
};

// TODO separate file probably
class ArrivalEvent extends BEvent {
    constructor (protagonist, coord) {
        super(
            BEvent.TYPES.Arrival,
            protagonist,
            undefined,
            coord || new Coord()
        );
    }

    resolve (worldState) {
        const arriver = Util.isString(this.protagonist) ?
            worldState.fromTemplateName(this.protagonist) :  // Later write this func.
            this.protagonist;

        worldState.addThing(arriver, coord);
    }
}

// TODO write the other subclasses

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
