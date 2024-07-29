'use strict';

// This file is run when building the Waffle Cards software.
// It writes cards.yml.js. Users should edit cards.yml as the source of truth.
// cards.yml.js will be a generated file that the software interacts with, & that browserify can bundle.

const Util = require('../../../../util/util.js');
const fs = require('fs');
const path = require('path');

class Parser {
    /* Background: I like how yaml is readable for nondevs, but it'll be tricky to make it compatible with browserify. For now, i'll just have my build script copy the .yml file to a string within a .js file.
    The user has to run the build script after editing. But that's true already because of browserify. */
    static run () {
        const ymlString = fs.readFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'cards.yml'),
            'utf8'
        );

        // Strip out initial comments, so the .yml.js file looks less confusing.
        const withoutComments = ymlString.split('contexts:').at(-1);

        fs.writeFileSync(
            path.join(__filename, '..', '..', '..', 'data', 'cards.yml.js'),
            'module.exports = `' + withoutComments + '`;\n',
            'utf8'
        );
    }
}

Parser.run();
