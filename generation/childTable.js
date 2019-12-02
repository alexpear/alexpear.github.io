'use strict';

const Util = require('../util/util.js');

class ChildTable {
    constructor (rawString, generator) {
        this.generator = generator;

        const lines = rawString.trim()
            .split('\n')
            .map(child => child.trim());

        this.templateName = ChildTable.withoutTheStarter(lines[0]);
        this.children = lines.slice(1)
            .map(
                line => {
                    if (Util.contains(line, '/')) {
                        // Util.log(`In ChildTable constructor. line is ${line}`, 'debug');

                        line = this.generator.makePathAbsolute(line);
                    }

                    return line;
                }
            );
    }

    toJson () {
        return {
            generatorPath: this.generator.codexPath,
            templateName: this.templateName,
            children: this.children
        };
    }

    // Returns a boolean
    static isAppropriateFor (tableString) {
        const t = tableString.trim()
            .toLowerCase();

        return ChildTable.STARTERS.some(
            starter => t.startsWith(starter)
        );
    }

    // Returns a string
    static withoutTheStarter (rawString) {
        const s = rawString.trim();
        const sLow = s.toLowerCase();

        for (let starter of ChildTable.STARTERS) {
            if (sLow.startsWith(starter)) {
                return s.slice(starter.length)
                    .trim();
            }
        }

        return s;
    }
}

ChildTable.STARTERS = [
    'children of',
    'childrenof'
    // 'childrenOf' is implied by the call to toLowerCase()
];

module.exports = ChildTable;
