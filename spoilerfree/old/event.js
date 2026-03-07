// Represents a event during a match, such as a goal.

const SoccerTime = require('./soccerTime.js');

class Event {
    constructor (type, time, player) {
        this.type = type;
        this.time = time;
        this.player = player;
    }

    static goal (time, player) {
        return new Event(
            Event.TYPE.Goal,
            time,
            player,
        );
    }

    static redCard (time, player) {
        return new Event(
            Event.TYPE.RedCard,
            time,
            player,
        );
    }

    toString () {
        const summary = `${this.type} at ${this.time.toString()}`;

        if (this.player) {
            return `${summary} by ${this.player}`;
        }

        return summary;
    }
}

Event.TYPE = {
    Goal: 'Goal',
    RedCard: 'Red Card',
    Other: 'Other',
};

module.exports = Event;
