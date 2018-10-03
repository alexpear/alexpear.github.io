'use strict';

// A group of creatures in a bottle world.
// Instanced in memory.
// Individual creatures (eg dragons, hermits) will still be a Group of 1.

const Util = require('../Util.js');
const Template = require('./template.js');

class Group {
    constructor () {

    }

    static example () {
        const group = new Group();

        group.templateName = 'dwarfAxeThrower';
        group.template = getTemplate(group.templateName);

        group.quantity = 100;
        group.weakestCreatureHp = group.template.hp;
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

