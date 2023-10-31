'use strict';

//

class Action {
    constructor (type, subject, target) {
        this.type = type;
        this.subject = subject;
        this.target = target;
    }

    static move (subject, coord) {
        return new Action(Action.TYPE.Move, subject, coord);
    }

    static attack (subject, target) {
        return new Action(Action.TYPE.Attack, subject, coord);
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
