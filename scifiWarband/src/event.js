'use strict';

// const Creature = require('./creature.js');
// const Squad = require('./squad.js');
// const Action = require('./action.js');
// const Item = require('./Item.js');
// const Templates = require('./templates.js');

// const Event = require('./event.js');

const Util = require('../../util/util.js');

class Event {
    constructor (type, t, details) {
        this.timestamp = new Date();
        this.type = type;
        this.details = details || {};

        this.log();
    }

    log () {
        Util.logEvent(this.toJson());
    }

    toJson () {
        const safeObj = {
            timestamp: this.timestamp.getUTCMilliseconds(),
            type: this.type,
            details: this.details
        };

        safeObj.details.target = this.details.target?.id;

        return safeObj;
    }

    static encounterStart () {
        return new Event(0, Event.TYPE.EncounterStart);
    }

    static attack (t, attackingCreature, target, weaponTemplate, attackOutcome, shieldsTo, statusChanges) {
        return new Event(
            t,
            Event.TYPE.Attack,
            {
                target,
                weaponTemplate,
                attackOutcome,
                shieldsTo,
                statusChanges,
            }
        )
    }

    static update (t, creature) {
        return new Event(
            t, 
            Event.TYPE.Update,
            {
                shieldsTo: creature.shields,
                cooldownEnds: creature.cooldownEnds,
            }
        );
    }
}

Event.TYPE = {
    EncounterStart: 'Encounter Start',
    Attack: 'Attack',
    Update: 'Update',
};

Event.ATTACK_OUTCOME = {
    Miss: 'Miss',
    Cover: 'Stopped by Cover',
    Hit: 'Hit',
    // These last few are cool, but we might express these situations via the events created by takeHit() instead.
    Endured: 'Endured',
    Damage: 'Damage', // Including shield damage.
    KO: 'KO',
};

// TODO Maybe track t globally during battle calculation in Event.t
// Then dont have to pass it around so much.
// Altho tricky to store it in 2 places...

module.exports = Event;
