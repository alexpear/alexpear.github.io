'use strict';

// Hashmap ({}) of sets of Events
// The hashmap is indexed by timestamps in number format.

const BEvent = require('./bEvent.js');
const Util = require('../util/util.js');
const WorldState = require('./worldState.js');

module.exports = class Timeline {
    constructor (worldState) {
        this.timestamps = {};
        // TODO move the now counter to currentWorldState instead.
        this.now = 0;
        this.currentWorldState = worldState || new WorldState(this);
    }

    // returns BEvent[]
    getEventsAt (time) {
        return this.timestamps[time] || [];
    }

    addEvent (bEvent, time) {
        time = Util.exists(time) ? time : this.now;

        const existingEvents = this.timestamps[time];
        if (existingEvents) {
            existingEvents.push(bEvent);
        }
        else {
            this.timestamps[time] = [bEvent];
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
                    .map(e => e.eventType)
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
        Util.log(this.toDebugString(), 'debug');
    }

    static example () {
        const timeline = new Timeline();
        timeline.addEvent(BEvent.arrival());

        return timeline;
    }

    static test () {
        const timeline = Timeline.example();

        timeline.debugPrint();
    }
};
