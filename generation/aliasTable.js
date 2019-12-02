'use strict';

const Util = require('../util/util.js');

class AliasTable {
    constructor (rawString, generator) {
        // The parent pointer is used when resolving slash path aliases.
        this.generator = generator;
        this.outputs = [];

        const lines = rawString.trim()
            .split('\n')
            .map(line => line.trim());

        // Later we could complain if the first line's name contains whitespace.
        this.templateName = AliasTable.withoutTheStarter(lines[0]);

        for (let li = 1; li < lines.length; li++) {
            // Later probably functionize this part.
            const line = lines[li];

            // Util.log(`in AliasTable() constructor, parsing line '${line}'`, 'debug');

            if (line === '') {
                continue;
            }

            const parts = line.split(/\s/);

            // Later i want to also support some sort of simple no-weights format, like Perchance does.
            if (parts.length <= 1) {
                throw new Error(`AliasTable could not parse line: ${parts.join(' ')}`);
            }

            const weightStr = parts[0];
            const weight = parseInt(weightStr);

            if (weight === 0) {
                continue;
            }
            else if (typeof weight !== 'number') {
                throw new Error(`AliasTable could not parse weight: ${ weightStr }`);
            }

            // Everything after the weight prefix.
            let alias = line.slice(weightStr.length)
                .trim();

            // During WGenerator construction, Interpret keys with slashes as external pointers.
            if (Util.contains(alias, '/')) {
                // Note that 'alias' could be a comma-separated set of names
                // {halo/unsc/item/dualWieldable}, {halo/unsc/item/dualWieldable}
                alias = this.generator.makeSomePathsAbsolute(alias);
            }

            // Replicated outputs. We assume memory is plentiful but time is scarce.
            for (let wi = 0; wi < weight; wi++) {
                this.outputs.push(alias);
            }
        }
    }

    // Returns string
    getOutput () {
        return Util.randomOf(this.outputs);
    }

    // Returns ContextString[]
    getOutputAndResolveIt () {
        const outputStr = this.getOutput();

        return this.generator.resolveCommas(outputStr);
    }

    toJson () {
        return {
            generatorPath: this.generator.codexPath,
            templateName: this.templateName,
            outputs: this.outputs
        };
    }

    // TODO this logic is needed by ChildTable too. Move it to WGenerator (ie parent).

    static isAppropriateFor (tableString) {
        const t = tableString.trim()
            .toLowerCase();

        if (
            AliasTable.STARTERS.some(
                starter => t.startsWith(starter)
            )
        ) {
            return true;
        }

        return t.startsWith('output');
    }

    // Returns a string
    static withoutTheStarter (rawString) {
        const s = rawString.trim();
        const sLow = s.toLowerCase();

        for (let starter of AliasTable.STARTERS) {
            if (sLow.startsWith(starter)) {
                return s.slice(starter.length)
                    .trim();
            }
        }

        return s;
    }
}

AliasTable.STARTERS = [
    'alias'
];

module.exports = AliasTable;
