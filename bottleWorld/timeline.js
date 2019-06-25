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
        // Util.log(typeof WorldState, `debug`);
        // Util.log(Object.keys(WorldState), `debug`);
        // Util.log(WorldState, `debug`);

        this.timestamps = {};
        // Later fix a weird bug where new WorldState() throws 'WorldState is not a constructor'.
        this.currentWorldState = worldState || new WorldState(this, 0);
    }

    // returns number
    now () {
        // Util.log(`Top of Timeline.now()`, `debug`);

        // Util.log(typeof this.currentWorldState, `debug`);
        // Util.log(Object.keys(this.currentWorldState), `debug`);
        // Util.log(typeof this.currentWorldState.now, `debug`);
        // Util.log(this.currentWorldState.now, `debug`);

        return this.currentWorldState.now();
    }

    // returns BEvent[]
    getEventsAt (time) {
        return this.timestamps[time] || [];
    }

    addEvent (bEvent, time) {
        time = Util.exists(time) ? time : this.now();

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

        const events = this.getEventsAt(this.now() - 1);

        // Util.log(`Timeline.computeNextInstant(). events.length is ${events.length}.`, `debug`);

        events.forEach(event => {
            this.currentWorldState.resolveEvent(event);
        });
    }

    toDebugString () {
        let lines = [];

        for (let t = 0; t <= this.now(); t++) {
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
