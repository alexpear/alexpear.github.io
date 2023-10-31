'use strict';

// const Creature = require('./creature.js');
// const Squad = require('./squad.js');
// const Action = require('./action.js');

const Util = require('../../util/util.js');

class Event {
    constructor (type, details) {
        this.timestamp = new Date();
        this.type = type;
        this.details = details || {};

        this.log();
    }

    log () {
        Util.log(this.toJson());
    }

    toJson () {
        const safeObj = {
            timestamp: this.timestamp.getUTCMilliseconds(),
            type: this.type,
            details: this.details
        };

        safeObj.details = Util.valuesAsIDs(safeObj.details);

        return safeObj;
    }

    static encounterStart () {
        const e = new Event(Event.TYPE.EncounterStart);

        e.t = 0;

        return e;
    }

    static attack (attackingCreature, target, weaponTemplate) { //, attackOutcome, shieldsTo, statusChanges) {
        return new Event(
            Event.TYPE.Attack,
            {
                subject: attackingCreature,
                target,
                weaponTemplate,
            }
        );
    }

    static hit (victim, weaponTemplate) {
        return new Event(
            Event.TYPE.Hit,
            {
                victim,
                shieldsTo: victim.shields,
                status: Util.clone(victim.status),
                // LATER could also include an ATTACK_OUTCOME value here, if useful. Alternately, just calc what happened while replaying.
                weaponTemplate: weaponTemplate,
            }
        );
    }

    static update (creature) {
        return new Event(
            Event.TYPE.Update,
            {
                shieldsTo: creature.shields,
                status: Util.clone(victim.status),
                cooldownEnds: creature.cooldownEnds,
            }
        );
    }
}

Event.TYPE = {
    EncounterStart: 'Encounter Start',
    Attack: 'Attack',
    Hit: 'Hit',
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
