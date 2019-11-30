'use strict';

// Hashmap ({}) of sets of Events
// The hashmap is indexed by timestamps in number format.
// Parent of WorldState. A WorldState only describes a single instant.

const BEvent = require('./bEvent.js');
const Util = require('../util/util.js');
const WorldState = require('./worldState.js');

const SECONDS_PER_TICK = 1;

module.exports = class Timeline {
    constructor (worldState) {
        this.timestamps = {};
        // Later fix a weird bug where new WorldState() throws 'WorldState is not a constructor'.
        this.currentWorldState = worldState || new WorldState(this, 0);
    }

    // returns number
    now () {
        return this.currentWorldState.now();
    }

    // returns BEvent[]
    getEventsAt (time) {
        return this.timestamps[time] || [];
    }

    addEvent (bEvent, time) {
        time = Util.exists(time) ? time : this.now();

        // Util.logDebug(`In Timeline.addEvent(${bEvent.eventType}, ${time}), near the top.`);

        bEvent.t = time;

        const existingEvents = this.timestamps[time];
        if (existingEvents) {
            existingEvents.push(bEvent);
        }
        else {
            this.timestamps[time] = [bEvent];
        }
    }

    computeNextInstant () {
        this.currentWorldState.t += SECONDS_PER_TICK;

        // Later it would be delightful if this func would check the real-world timestamp on when the tick number was last logged out, and only log iff that was a little while ago. (And then update the timestamp.)
        Util.logDebug(`Starting to compute second #${this.currentWorldState.t}...`);

        const events = this.getEventsAt(this.now() - 1);

        let i = 0;
        while (events[i]) {
            // Note that resolveEvent() sometimes pushes new BEvents onto the current second's events array.
            this.currentWorldState.resolveEvent(events[i]);

            i++;
        }

        // this.worldState.moveEverything(); // TODO implement this func, which moves all moving Things towards their destinations.
    }

    toDebugString () {
        let lines = [];

        for (let t = 0; t <= this.now(); t++) {
            if (this.timestamps[t]) {
                // We do indeed include events where e.happened = false, for the sake of Timeline internal debugging.
                const events = this.getEventsAt(t)
                    .map(e => Util.capitalized(e.eventType));

                const eventsSummary = Util.arraySummary(events);

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
        Util.log('\n' + this.toDebugString(), 'debug');
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
