'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

module.exports = class Event {
    constructor (eventType, protagonist, target, coord) {
        this.eventType = eventType;

        // WAIT: Hang on. Is protagonist a Thing or a id number?
        // It could be a Thing in memory, and a id number when serialized.
        this.protagonist = protagonist;
        this.target = target;
        this.coord = coord;
        this.props = {};
        this.outcomes = [];  // Array of other Events
    }

    serializable () {
        const smallVersion = Object.assign({}, this);

        // Serialize just the ids of linked objects. Gets rid of circular reference and saves space.
        smallVersion.protagonist = this.protagonist.id;
        smallVersion.target = this.target.id;
        smallVersion.outcomes = this.outcomes.map(event => event.serializable());
    }

    // TODO probably make subclasses of Event for Arrival, Explosion, etc.
    // Each could probably even have a .resolve() member func.
    static arrival (protagonist, coord) {
        return new Event(
            Event.TYPES.Arrival,
            protagonist,
            undefined,
            coord || new Coord()
        );
    }

    static departure (protagonist) {
        return new Event(Event.TYPES.Departure, protagonist);
    }

    // Might later revise this. Maybe some actions can be performed with a parameter.
    static action (protagonist, target, coord, actionType) {
        const event = new Event(Event.TYPES.Action, protagonist, target, coord);
        event.actionType = actionType;
        return event;
        // Outcome information is to be stored in a separate Update event.
    }

    // Builds a chain of Events of length up to 3
    // Does not work for splash damage or other attacks with complex effects.
    static simpleAttack (protagonist, target, actionType, damage, targetDead) {
        const actionEvent = new Event(Event.TYPES.Action, protagonist, target);

        const damageProps = {
            hp: -1 * damage,
            relative: true
        };

        const damageEvent = Event.update(target, damageProps)
        actionEvent.outcomes.push(damageEvent);

        if (targetDead) {
            actionEvent.outcomes.push(
                Event.death(target)
            );
        }

        return actionEvent;
    }

    static death (protagonist) {
        return new Event(Event.TYPES.Death, protagonist);
    }

    static newTarget (protagonist, target) {
        return new Event(Event.TYPES.NewTarget, protagonist, target);
    }

    static newDestination (protagonist, coord) {
        return new Event(Event.TYPES.NewDestination, protagonist, undefined, coord);
    }

    static actionReady (protagonist, actionType) {
        const event = new Event(Event.TYPES.ActionReady, protagonist);
        event.actionType = actionType;
        return event;
    }

    static update (protagonist, props) {
        const event = new Event(Event.TYPES.Update, protagonist);
        event.props = props;
        return event;
    }

    static explosion (coord, radius, damage) {
        const event = new Event(Event.TYPES.Explosion, undefined, undefined, coord);
        event.props.radius = radius;
        event.props.damage = damage;
        return event;
    }

    static effect (coord, props) {
        const event = new Event(Event.TYPES.Effect, undefined, undefined, coord);
        event.props = props;
        return event;
    }

    // The runEvery parameter stores the duration (number, probably seconds) between instances of this recurring event.
    static universalUpdate (runEvery, updateType) {
        this.runEvery = runEvery;
        this.updateType = updateType;
    }
};

Event.TYPES = Util.makeEnum([
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
