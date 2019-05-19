'use strict';

// Hashmap ({}) of sets of Events
// The hashmap is indexed by timestamps in number format.

const WorldState = require('./worldState.js');

module.exports = class Timeline {
    constructor () {
        this.timestamps = {};
        this.now = 0;
        this.currentWorldState = new WorldState(this);
    }

    // returns Event[]
    getEventsAt (time) {
        return this.timestamps[time] || [];
    }

    addEvent (event, time) {
        const existingEvents = this.timestamps[time];
        if (existingEvents) {
            existingEvents.push(event);
        }
        else {
            this.timestamps[time] = [event];
        }
    }

    computeNextInstant () {
        this.now += 1;

        const events = this.getEventsAt(this.now);

        events.forEach(event => {
            this.currentWorldState.resolveEvent(event);
        });
    }
};
