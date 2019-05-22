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

    toDebugString () {
        let lines = [];

        for (let t = 0; t <= this.now; t++) {
            if (this.timestamps[t]) {
                const eventsSummary = this.getEventsAt(t)
                    .map(e => e.type)
                    .join(', ');

                lines.push(`${t}: ${eventsSummary}`);
            }
            // If a timespan has no events, represent that whole timespan with one '...' line.
            // If t-1 also has no events, print nothing, to avoid long stacks of '...'s.
            else if (this.timestamps[t-1]) {
                lines.push('...');
            }
        }

        return lines.join('\n');
    }

    debugPrint () {
        console.log(this.toDebugString());
    }
};
