'use strict';

// A group of creatures in a bottle world.
// Instanced in memory.
// Individual creatures (eg dragons, hermits) will still be a Group of 1.

const Util = require('../Util.js');
const Template = require('./template.js');

class Group {
    constructor () {

    }

    // Mostly reads from this.template reference,
    // but sometimes items or status effects modify the output.
    getStats () {

    }

    static example () {
        const group = new Group();

        group.templateName = 'dwarfAxeThrower';
        group.template = getTemplate(group.templateName);

        group.quantity = 100;
        group.weakestCreatureHp = group.template.hp;
        // Alternately, could just store group.totalHp
        // and calculate quantity: group.getQuantity()
        // This would make saving group state in replay and Encounter objs simpler.

        group.location = new Location();

        return group;

        function getTemplate (templateName) {
            // This is a mock function. Later, read from the template glossary in the World or Glossary object.
            const exampleGlossary = {
                dwarfAxeThrower: Template.example()
            };

            return exampleGlossary[templateName];
        }
    }

    static test () {
        const output = Group.example();
        console.log(`Group.test()`);
        console.log(JSON.stringify(output, undefined, '    '));
        return output;
    }
}

// TODO: Move to own file.
// Location is more relevant to Bottle Worlds than to battle20, which is spaceless.
// This is a bit of a placeholder.
class Location {

}


// Run.
Group.test();


/* Notes:

const e = new Encounter();
group1.faction = 'CG';
group2.faction = 'CE';
e.add(group1);
e.add(group2);
const outcome = e.resolve()

... methodize that as:
const outcome = Encounter.between(group1, group2);


Dwarf Axe Throwers x100 (CG)
vs
Dwarf Axe Throwers x100 (CE)

Dwarf Axe Throwers x100 (CG) go first
Dwarf Axe Throwers x100 (CG) do 16 damage to Dwarf Axe Throwers x100 (CE).
Dwarf Axe Throwers x100 (CE) takes 8 casualties and there are now 92 left.

*/

// Part of a Replay
// Maybe called EncounterSummary
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
            }
        };

        // Also something about items stolen or picked up, or dropped.

        return outcome;
    }
}


