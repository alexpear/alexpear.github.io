'use strict';

//

const Util = require('../../util/util.js');

class Action {
    constructor (type, subject, target) {
        this.type = type;
        this.subject = subject;
        this.target = target;
    }

    isFree () {
        return [Action.TYPE.GrabItem].includes(this.type);
    }

    toJson () {
        return {
            type: this.type,
            subject: this.subject.id,
            target: this.target.id ?
                this.target.id :
                this.target.toString(),
            // LATER include name of which kind of special action, if relevant
        }
    }

    toString() {
        // LATER implement a pretty text summary here
        return Util.stringify(this.toJson());
    }

    static move (subject, coord) {
        return new Action(Action.TYPE.Move, subject, coord);
    }

    static attack (subject, target) {
        return new Action(Action.TYPE.Attack, subject, target);
    }
}

// LATER vaguely contemplating instead using Event to represent planned actions. Downside: Semantically it's a plan, not a event.
Action.TYPE = {
    Move: 'Move',
    TakeCover: 'Take Cover',
    Attack: 'Attack',
    Objective: 'Secure Objective',
    FirstAid: 'First Aid',
    GrabItem: 'Grab Item',
    Special: 'Special',
};

module.exports = Action;
