'use strict';

// Hashmap ({}) of sets of Events
// The hashmap is indexed by timestamps in number format.
// Parent of WorldState. A WorldState only describes a single instant.

const BEvent = require('./bEvent.js');
const MoveAllEvent = require('./events/moveAllEvent.js');
const Util = require('../util/util.js');
const WorldState = require('./worldState.js');

const SECONDS_PER_TICK = 1;

module.exports = class Timeline {
    constructor (worldState) {
        this.timestamps = {};
        // Later fix a weird bug where new WorldState() throws 'WorldState is not a constructor'.
        this.currentWorldState = worldState || new WorldState(this, 0);

        // Util.logDebug(`Timeline constructor, this.currentWorldState is ${this.currentWorldState}`);

        this.addEvent(
            new MoveAllEvent()
        );
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
        Util.logDebug(`Second #${this.currentWorldState.t} had ${this.getEventsAt(this.currentWorldState.t).length} events in it: ${this.summaryOfInstant(this.currentWorldState.t)}`);

        this.currentWorldState.t += SECONDS_PER_TICK;

        // Later it would be delightful if this func would check the real-world timestamp on when the tick number was last logged out, and only log iff that was a little while ago. (And then update the timestamp.)
        // In other words, don't crowd the logs.
        Util.logDebug(`Starting to compute second #${this.currentWorldState.t}...`);

        const events = this.getEventsAt(this.now() - 1);

        let i = 0;
        while (events[i]) {
            // Note that resolveEvent() sometimes pushes new BEvents onto the current second's events array.
            this.currentWorldState.resolveEvent(events[i]);

            i++;
        }

        // Util.logDebug(`worldstate constructor is named ${this.currentWorldState && this.currentWorldState.constructor.name}`)

        this.currentWorldState.actorTurns();
    }

    printInRealTime () {
        // TODO step thru each tick once per second.
        // If WorldState is RingWorldState, then the printing style should be RingWorld specific somehow. 
        // Probably we'll obtain a RingWorldState for the current instant, then call worldState.summarizeRecentChanges() on it.
        // Maybe that func will print a sector map at the end too. Or every 60 seconds, etc.
    }

    toJson () {
        const serializedEvents = {};

        Object.keys(this.timestamps).forEach(
            t => {
                serializedEvents[t] = this.timestamps[t].map(
                    event => event.toJson()
                );
            }
        );

        return {
            timestamps: serializedEvents,
            currentWorldState: this.currentWorldState.toJson()
        };
    }

    // Helps debug circular reference
    testSerialization () {
        Object.keys(this.timestamps).forEach(
            t => {
                this.timestamps[t].forEach(
                    event => event.testSerialization()
                );
            }
        );
    }

    summaryOfInstant (t) {
        // We do indeed include events where e.happened = false, for the sake of Timeline internal debugging.
        const events = this.getEventsAt(t)
            .map(e => Util.capitalized(e.eventType));

        return Util.arraySummary(events);
    }

    toDebugString () {
        let lines = [];

        for (let t = 0; t <= this.now(); t++) {
            if (this.timestamps[t]) {
                const eventsSummary = this.summaryOfInstant(t);

                if (
                    lines.length > 0 &&
                    lines[lines.length - 1].endsWith(`: ${eventsSummary}`)
                ) {
                    // Avoid cluttering the output with repetitive lines.
                    if(this.getEventsAt(t + 1).length === 0) {
                        // When done with a series of omissions, add this note:
                        lines.push('...some rows omitted for brevity...');
                    }

                    continue;
                }

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
