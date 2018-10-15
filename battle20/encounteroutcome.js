'use strict';

// Part of a Replay
// Maybe name it EncounterSummary
// Basically stores what happened in a dungeon or on a battlefield.
class EncounterOutcome {

    static example () {
        const outcome = new EncounterOutcome();

        // Keys are ids of Groups
        // The numbers are absolute (overwriting) not relative (summing)
        outcome.changes = {
            ncfh387h2fd2843dh: {
                totalHp: 13
            },
            f892hc8714cnf2m3o: {
                buff: 2,
                totalHp: 3
            },
            qc97hgmco8hmg111i: {
                totalHp: 200
            },
            u3145195yu0134tu3: {}  // Some participants were unchanged.
        };

        // Also something about items stolen or picked up, or dropped.

        return outcome;
    }
}
