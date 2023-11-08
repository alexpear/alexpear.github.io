'use strict';

// Utilities for file conversion. More useful during development & building than at final runtime.

// const Templates = require('./templates.js');
const Util = require('../../../util/util.js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Done.
const templatesToYaml = () => {
    const yamlData = yaml.dump(Templates.Halo);
    console.log(yamlData);
}

/*
Background: I like how yaml is readable for nondevs, but it'll be tricky to make it compatible with browserify. For now, i'll just have my build script copy the .yml file to a string within a .js file.
The user has to run the build script after editing. But that's true already because of browserify.
*/
const translateConfig = () => {
    const ymlString = fs.readFileSync(
        path.join(__filename, '..', '..', '..', 'data', 'config.yml'),
        'utf8'
    );

    const configJsString = 'module.exports = `' + ymlString + '`;';

    fs.writeFileSync(
        path.join(__filename, '..', '..', '..', 'data', 'config.js'),
        configJsString,
        'utf8'
    );
}


translateConfig();
