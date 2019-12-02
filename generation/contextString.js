'use strict';

const Util = require('../util/util.js');
const WGenerator = require('./wgenerator.js');

// Intermediate representation used during parsing and generation. Represents a name (of a template or of a alias) with a codex path for context.
// Alternate names: CodexString, PathName, PathString, ContextName, ContextString
class ContextString {
    // Example:
    // {
    //     name: 'civilian',
    //     codexPath: 'halo/unsc/individual'
    // }
    constructor (name, absolutePath) {
        if (Util.contains(name, '/')) {
            // NOTE: We currently do not support the name param being a relative path.
            const findings = WGenerator.findGenAndTable(name);
            this.name = findings.name;
            this.path = findings.gen.codexPath;
        }
        else {
            this.name = name;
            // LATER: guarantee that this is always a absolute path.
            this.path = absolutePath;
        }
    }

    toString () {
        return `{name:${this.name}, path:${this.path}}`;
    }
}

module.exports = ContextString;
