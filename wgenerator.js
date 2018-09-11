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

    }

    maybeAddChildren(node) {

    }

    addChildren(node, table) {
        for (let i = 0; i < table.children.length; i++) {
            let child = table.children[i].trim();
            while (child[0] === '{') {
                child = child.slice(1, child.length - 1);
                const children = this.aliasTables[child].getOutput();
                // TODO Deal with 1+ children here
            }
        }
      // for element in table.children // TODO
        // if not a template name, resolve its brackets using the appropriate alias table
        node.add(new WNode(foo));
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
