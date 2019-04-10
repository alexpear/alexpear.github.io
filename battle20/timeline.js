'use strict';

// Hashmap ({}) of sets of Events
// The hashmap is indexed by timestamps in number format.

class Timeline {
    constructor () {
        this.timestamps = {};
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
}

