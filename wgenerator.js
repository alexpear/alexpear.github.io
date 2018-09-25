'use strict';

// Generator that outputs procedurally generated trees of WNodes (Waffle nodes).
// These trees represent games states, game elements, narrative elements, and similar concepts.

const Util = require('./Util.js');
const WNode = require('./wnode.js');

class WGenerator {
    // Constructor param will be either a birddecisions-format string or a filename.
    constructor (rawString) {
        // Later the this.rawString field might not be necessary.
        this.rawString = rawString.trim();
        this.childTables = {};
        this.aliasTables = {};

        // TODO: Add support for ignoring comments.
        const tableRaws = this.rawString.split('*');

        tableRaws.forEach(
            tableRaw => {
                tableRaw = tableRaw.trim();

                if (! tableRaw.length) {
                    return;
                }

                if (ChildrenTable.isAppropriateFor(tableRaw)) {
                    const childTable = new ChildrenTable(tableRaw);
                    const key = childTable.key;

                    if (this.childTables[key]) {
                        throw new Error(`WGenerator constructor: table key ${ key } appears twice`);
                    }

                    this.childTables[key] = childTable;
                    return;
                }

                const aliasTable = new AliasTable(tableRaw);
                const key = aliasTable.key;

                if (this.aliasTables[key]) {
                    throw new Error(`WGenerator constructor: table key ${ key } appears twice`);
                }

                this.aliasTables[key] = aliasTable;
            }
        );

        // Check that the output alias table exists
        if (! this.aliasTables['output']) {
            throw new Error(`WGenerator constructor: output table not found. Object.keys(this.aliasTables).length is ${ Object.keys(this.aliasTables).length }`);
        }
    }

    getOutput () {
        return this.parse('{output}');
    }

    // Alternate name resolveString(), because it is random.
    parse (inputString) {
        const strings = inputString.trim()
            .split(',')
            .reduce(
                (stringsSoFar, s) =>
                    stringsSoFar.concat(
                        this.maybeResolveAlias(s)
                    ),
                []
            );

        return strings.map(str => new WNode(str))
            .map(n => this.maybeAddChildren(n));
    }

    // Might modify node.children
    // Returns a WNode
    maybeAddChildren (node) {
        const table = this.childTables[node.templateName];

        if (table) {
            return this.addChildren(node, table);
        }
        else {
            return node;
        }
    }

    // Modifies node.children
    // Returns the modified WNode
    addChildren (node, table) {
        table.children.forEach(
            childString => {
                // Note that parse() always returns an array.
                node.components = node.components.concat(
                    this.parse(childString)
                );
            }
        );

        return node;
    }

    // Returns string[]
    // No side effects.
    maybeResolveAlias (str) {
        str = str.trim();

        if (str[0] === '{') {
            if (str[str.length - 1] !== '}') {
                throw new Error(`WGenerator.maybeResolveAlias(): Error parsing a string: ${ str }`);
            }

            const alias = str.slice(1, str.length - 1)
                .trim();

            const table = this.aliasTables[alias];

            if (! table) {
                throw new Error(`WGenerator.maybeResolveAlias(): Could not find alias table: ${ str }`);
            }

            const output = table.getOutput();

            // TODO or should this return this.parse(output)? Seems weird to have 2 funcs handle comma splitting.
            return output.split(',')
                .reduce(
                    (templatesSoFar, s) => templatesSoFar.concat(
                        this.maybeResolveAlias(s)
                    ),
                    []
                );
        }
        else {
            return [str];
        }
    }

    // TODO i'm also interested in reading from local .txt files.
    static exampleRaw () {
        return `
            * output
            5 {vehicleCrew}, warthog

            * vehicleCrew
            5 marine, marine, marine
            2 marine, marine

            * children of marine
            flakArmor
            {weapon}

            * weapon
            5 smg
            5 battleRifle
            5 assaultRifle
            1 shotgun`;
    }

    static exampleTree () {
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

    static test () {
        const raw = WGenerator.exampleRaw();
        const wgen = new WGenerator(raw);

        const output = wgen.getOutput();
        const prettyStrings = output.map(
            node => node.toPrettyString()
        );

        console.log(`WGenerator.test(): \n\n`);

        output.forEach(
            node => {
                console.log(node.toPrettyString());
            }
        );
    }
}

class AliasTable {
    constructor (rawString) {
        this.outputs = [];

        const lines = rawString.trim()
            .split('\n')
            .map(line => line.trim());

        // Later we could complain if the first line contains whitespace.
        this.key = lines[0];

        for (let li = 1; li < lines.length; li++) {
            const line = lines[li];

            if (line === '') {
                continue;
            }

            const parts = line.split(/\s/);

            if (parts.length <= 1) {
                throw new Error(`AliasTable could not parse line: ${parts.join(' ')}`);
            }

            const weightStr = parts[0];

            // Everything after the weight prefix.
            const alias = line.slice(weightStr.length)
                .trim();

            const weight = parseInt(weightStr);

            if (typeof weight !== 'number') {
                throw new Error(`AliasTable could not parse weight: ${ weightStr }`);
            }

            // Replicated outputs. We assume memory is plentiful but time is scarce.
            for (let wi = 0; wi < weight; wi++) {
                this.outputs.push(alias);
            }
        }
    }

    getOutput () {
        return Util.randomOf(this.outputs);
    }
}

class ChildrenTable {
    constructor (rawString) {
        const lines = rawString.trim()
            .split('\n')
            .map(child => child.trim());

        this.key = ChildrenTable.withoutTheStarter(lines[0]);
        this.children = lines.slice(1);
    }

    static isAppropriateFor (tableString) {
        const s = tableString.trim()
            .toLowerCase();

        return ChildrenTable.STARTERS.some(
            starter => s.startsWith(starter)
        );
    }

    static withoutTheStarter (rawString) {
        const s = rawString.trim();
        const sLow = s.toLowerCase();

        for (let starter of ChildrenTable.STARTERS) {
            if (sLow.startsWith(starter)) {
                return s.slice(starter.length)
                    .trim();
            }
        }

        return s;
    }
}

ChildrenTable.STARTERS = [
    'children of',
    'childrenof'
];


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

2018 September 20:
parse() or resolveString() takes any string and returns WNode[]
it calls resolveCommas(), resolveAlias(), new WNode(), and maybeAddChildren()
(or replace resolveAlias() with maybeResolveAlias(), whichever looks clearer.)

resolveAlias() now returns string[], which contains no aliases.

maybeAddChildren(node) looks up the strings representing children, calls parse() on them (this is recursion), and appends the nodes parse() returns to node.components as a side effect. No return value necessary, i think.

More code in black notebook.



In the longer term, would be nice if the syntax could specify the generation of a grid.
Then you could generate a fleet of spaceships and also some basic floor plans of their bridges and cargo bays.
Or island maps.
But i guess that each square is so relevant to the contents of its neighbors that this reductionist generation might not produce very good results.
Everything in each square appears at a random part of the island with uniform probability, right?
I guess you could alias the squares as ForestSquare, DesertSquare, etc ....
But still, how would you make sure the ForestSquares are adjacent to each other?
I think perhaps the grid generation is best done by another module.
That module could call WGenerator, which outputs a tree describing one square.
Similarly, WGenerator could describe a spaceship and one of the leaves can be of template frigateFloorPlan.
Outside WGenerator, frigateFloorPlan can call some grid generation program.
That grid generation program can call WGenerator on each square, with inputs like 'squareBesideWall' and 'storageSquare'.
So the final output will be a Waffle tree with grids in the middle. A tree containing grids of subtrees.
Waffle will ideally support this.
The ship node will have a grid node (representing the cargo bay) in its .components, or similar.


exampleRaw

|
v

exampleOutput:
  - marine:
    has:
      - flakArmor
      - battleRifle
  - marine:
    has:
      - flakArmor
      - smg
  - warthog



*/
