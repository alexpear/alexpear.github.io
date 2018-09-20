'use strict';

// Generator that outputs procedurally generated trees of WNodes (Waffle nodes).
// These trees represent games states, game elements, narrative elements, and similar concepts.

const WNode = require('./wnode.js');

class WGenerator {
    // Constructor param will be either a birddecisions-format string or a filename.
    constructor(todo) {
        this.rawString = '';
        this.childTables = {};
        this.aliasTables = {};
    }

    getOutput() {

        return new WNode('todo');
    }

    parse(str) {
        const elements = str.trim()
            .split(',')
            .map(s => s.trim())
            .map(s => this.resolveAlias(s));
        
        
    }

    maybeAddChildren(node) {

    }

    addChildren(node, table) {
        const children = table.children.reduce(
            (chidrenSoFar, entry) => {
                // Note that resolveAlias always returns an array.
                const newChildren = this.resolveAlias(entry)
                    .map(templateName => new WNode(templateName));

                return childrenSoFar.concat(newChildren);
            },
            []
        );





    }

    resolveAlias(str) {
        str = str.trim();

        if (str[0] === '{') {
            if (str[str.length - 1] !== '}') {
                throw new Error(`WGenerator.resolveAlias(): Error parsing a str: ${ str }`);
            }

            const alias = str.slice(1, str.length - 1);
            const table = this.aliasTables[alias];

            if (! table) {
                throw new Error(`WGenerator.resolveAlias(): Could not find alias table: ${ str }`);
            }

            const output = table.getOutput();
            return output.split(',')
                .map(s => s.trim())
                .map(s => this.resolveAlias(s));
                // TODO also reduce() to flatten the arrays.
        }
        else {
            return [str];
        }
    }

    static exampleTree() {
        /*
        pelican
          pilot
            magnum
          warthog
            marine
              magnum
            marine
              magnum
            marine
              magnum
        */
        const pelican = new WNode('pelican');
        const pilot = new WNode('pilot');
        const warthog = new WNode('warthog');
        const marine = new WNode('marine');
        const magnum = new WNode('magnum');

        marine.add(
            magnum.deepCopy()
        );

        pelican.add(
            pilot.add(
                magnum.deepCopy()
            )
        )
        .add(
            warthog.add(
                marine.deepCopy()
            )
            .add(
                marine.deepCopy()
            )
            .add(
                marine.deepCopy()
            )
        );

        return pelican;
    }

    static test() {
        const pelican = WGenerator.exampleTree();
        console.log(`WGenerator.test(): \n\n${ pelican.toPrettyString()}`);
    }
}

class AliasTable {
    constructor(rawString) {
        this.outputs = [];

        const lines = rawString.trim().split('\n');
        for (let li = 1; li < lines.length; li++) {
            const line = lines[li];
            if (line === '') {
                continue;
            }

            const parts = line.split();

            if (parts.length <= 1) {
                throw new Error(`AliasTable could not parse line: ${parts.join(' ')}`);
            }

            const weightStr = parts[0];
            const alias = line.slice(weightStr.length).trim(); // Everything after the weight prefix.
            const weight = parseInt(weightStr);

            if (typeof weight !== 'number') {
                throw new Error(`AliasTable could not parse weight: ${ weightStr }`);
            }

            for (let wi = 0; wi < weight; wi++) {
                this.outputs.push(alias);
            }
        }
    }

    getOutput() {
        return Util.randomOf(this.outputs);
    }
}

class ChildrenTable {
    constructor(rawString) {
        this.children = rawString.trim()
            .split('\n')
            .map(child => child.trim());
    }
}


// Run
WGenerator.test();




/*
{output}
v
parse
v
resolveAlias('output')
v
{leaders}, {troops}
v
parse
v
resolveAlias('leaders') and resolveAlias('troops')
v
'officer' and 'officer' and 'regular'
v
new WNode('officer') etc
v
maybeAddChildren(node)
v
addChildren(node, node.templateName)

So maybe strings go to parse(), which ultimately resolves to WNode[]
And calls maybeAddChildren on those.




*/
