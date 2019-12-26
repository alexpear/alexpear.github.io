'use strict';

const Coord = require('../util/coord.js');
const Util = require('../util/util.js');

// BEvent stands for Bottle World Event
const BEvent = module.exports = class BEvent {
    constructor (eventType, protagonist, target, coord, templateName, time) {

        // type string
        this.eventType = eventType;

        // type WNode
        this.protagonist = protagonist;

        // type WNode
        this.target = target;

        // type Coord
        this.coord = coord;

        // type string
        this.templateName = templateName;

        // type number
        this.t = time;

        // type object
        this.props = {};

        // type BEvent[]
        this.outcomes = [];  // Array of other BEvent

        // type boolean
        this.happened = true;

        // type string
        this.id = Util.newId();
    }

    prettyString () {

    }

    verboseString () {

    }

    addOutcome (event, worldState, time) {
        if (! Util.exists(time)) {
            time = this.t;
        }

        this.outcomes.push(event);

        worldState.timeline.addEvent(
            event,
            time
        );
    }

    // This func replaces pointers with id strings, for serialization / storage.
    // LATER, could save memory by not persisting BEvents that will be obvious to the reconstructor, such as ActionEvent, because that one involves no random rolls. It's predictable.
    // Could also LATER look into whether it saves storage to omit BEvents where .happened is false. Or to limit those to just id, type, and happened: false. That would cut out the protagonist and actionId ids, which saves a little space.
    // Could also omit the t (tick) number from every BEvent persisted. But that only saves this may characters: "t":96, which isnt a ton.
    toJson () {
        const serialized = {};

        Object.keys(this).forEach(
            key => {
                const originalValue = this[key];

                // Dont persist blanks
                if (
                    ! Util.exists(originalValue) ||
                    Util.isArray(originalValue) && originalValue.length === 0 ||
                    typeof originalValue === 'object' && Object.keys(originalValue).length === 0
                ) {
                    return;
                }

                if (key === 'outcomes') {
                    serialized[key] = originalValue.map(
                        outcome => outcome.id
                    );

                    return;
                }

                if (key === 'coord') {
                    // The coord might be stored nowhere else except in this event, so must be persisted fully.
                    serialized[key] = originalValue;
                    return;
                }

                serialized[key] = originalValue ?
                    (originalValue.id || Util.toJson(originalValue)) :
                    originalValue;
            }
        );

        return serialized;
    }

    // Helps debug circular reference
    testSerialization () {
        const json = this.toJson();

        try {
            JSON.stringify(json);
        } catch (e) {
            const keys = Object.keys(json);

            Util.log(`In BEvent.testSerialization(), constructor.name is ${this.constructor.name}.`);

            keys.forEach(
                key => {
                    Util.log(`key: ${key}`);

                    JSON.stringify(json[key]);
                }
            );

        }
    }

    // static departure (protagonist) {
    //     return new BEvent(BEvent.TYPES.Departure, protagonist);
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
    'Projectile',
    'Explosion',
    'Effect',
    'UniversalUpdate'
]);
