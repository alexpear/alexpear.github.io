'use strict';

const Yaml = require('js-yaml');

const Alignment = require('../../dnd/alignment.js');
const Person = require('./person.js');

const Util = require('../../util/util.js');

// YA Synopsis Generator

class Story {
    constructor (options) {
        options = options || {};

        const castSize = Util.randomIntBetween(1, 7);
        const povCount = Util.randomIntBetween(1, 4);
        this.characters = [];

        for (let i = 0; i < castSize; i++) {
            const newChar = new Person();
            if (i < povCount) {
                newChar.pov = true;
            }
            this.characters.push(newChar);
        }

        this.characters.sort(
            (a, b) => a.alignment.localeCompare(b.alignment)
        );
    }

    toString () {
        return JSON.stringify(this, undefined, '    ');
    }

    toPrettyString () {
        return '\n' + 
            this.characters.map(c => c.toPrettyString())
            .join('\n');
    }

    toJson () {

    }

    static example () {
        return new Story();
    }

    static run () {
        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('story.js') ||
            ! process.argv[2].startsWith('test')) {
            // The following logic is for command-line use only.
            return;
        }

        Story.test();
    }

    static test () {
        console.log(`Story.test(): \n`);

        const story = new Story();

        Util.logDebug(story.toPrettyString());

        // Util.logDebug(
        //     '\n' + 
        //     Yaml.dump(

        //     )
        // );

        return story;
    }
}

module.exports = Story;

// Run
Story.run();
