// Represents a soccer match.

const Event = require('./soccerEvent.js');
const SoccerTime = require('./soccerTime.js');

class Match {
    // input: (string, string)
    constructor (home, visitor, date) {
        this.home = home;
        this.visitor = visitor;
        this.date = date;

        this.events = [];
        this.homeGoals = 0;
        this.visitorGoals = 0;
        this.winner = undefined;
        this.latestKnownTime = new SoccerTime();
    }

    update () {

    }

    isOver () {
        return this.latestKnownTime.isOver();
    }

    endedInDraw () {
        return ! this.winner && this.isOver();
    }
}

module.exports = Match;
