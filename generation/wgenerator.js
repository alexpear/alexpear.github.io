'use strict';

// Generator that outputs procedurally generated trees of WNodes (Waffle nodes).
// These trees represent games states, game elements, narrative elements, and similar concepts.

const fs = require('fs');

// TODO perhaps restructure so that WGenerator doesn't import any Battle20 files.
// Eg, perhaps CreatureTemplate should not be Battle20-specific?
const CreatureTemplate = require('../battle20/creaturetemplate.js');
const Util = require('../util/util.js');
const WNode = require('../wnode/wnode.js');

class WGenerator {
    // Constructor param will be either a birddecisions-format string or a filename.
    constructor (rawString, codexPath) {
        if (! typeof (rawString === 'string') || ! rawString.length) {
            return;
        }

        // Later the this.rawString field might not be necessary.
        this.rawString = rawString.trim();
        this.codexPath = codexPath;
        this.aliasTables = {};
        this.childTables = {};
        // Later, make this a pointer to a Glossary instance.
        // usage: glossary.getTemplate('naga');
        this.glossary = {};

        // TODO: Add support for ignorable comments in codex files
        const tableRaws = this.rawString.split('*');

        tableRaws.forEach(
            tableRaw => {
                tableRaw = tableRaw.trim();

                if (! tableRaw.length) {
                    return;
                }

                if (ChildrenTable.isAppropriateFor(tableRaw)) {
                    return this.addChildTable(tableRaw);
                }

                // Later, this could be neater and not involve a string literal.
                if (tableRaw.startsWith('template ')) {
                    return this.addTemplate(tableRaw);
                }

                // Default case.
                // Includes '* output'
                return this.addAliasTable(tableRaw);
            }
        );

        // Check that the output alias table exists
        if (! this.aliasTables.output) {
            throw new Error(`WGenerator constructor: output table not found. Object.keys(this.aliasTables).length is ${ Object.keys(this.aliasTables).length }`);
        }
    }

    addChildTable (tableRaw) {
        const childTable = new ChildrenTable(tableRaw);
        // TODO replace terminology: key -> templateName
        const key = childTable.templateName;

        if (key in this.childTables) {
            // Later perhaps also mention which file this is, or paste the content of the file
            throw new Error(`children table key '${ key }' appears twice`);
        }

        return this.childTables[key] = childTable;
    }

    addAliasTable (tableRaw) {
        const aliasTable = new AliasTable(tableRaw, this);
        const key = aliasTable.templateName;

        if (key in this.aliasTables) {
            throw new Error(`alias table key '${ key }' appears twice`);
        }

        return this.aliasTables[key] = aliasTable;
    }

    addTemplate (tableRaw) {
        const templateObj = parseTemplate(tableRaw);
        const key = templateObj.templateName;

        if (key in this.glossary) {
            throw new Error(`template key '${ key }' appears twice`);
        }

        return this.glossary[key] = templateObj;
    }

    // Returns WNode[]
    getOutputs (key) {
        return this.resolveString(key || '{output}');
    }

    resolveCommas (inputString) {
        return inputString.trim()
            .split(',')
            .reduce(
                (stringsSoFar, s) =>
                    stringsSoFar.concat(
                        this.maybeResolveAlias(s)
                    ),
                []
            );
    }

    // TODO: Maybe interpret '{halo/unsc/vehicle}' as referring to a different codex module.
    // Detect this by looking for the '/' char.
    // Perhaps during the 'loading' (addAliasTable() etc), slash-strings can be detected. The corresponding codex modules can be tracked down and also loaded as tables.
    // The pointers to that table may have to be standardized as absolute paths in-memory (unsc/vehicle/hardPoint -> halo/unsc/vehicle/hardPoint).
    // I think if the 'reaching into' syntax is absent, it will be workable but will require many short modules (ie, lots of exporting).
    // A more desirable way to split up unsc files might be: item, individual, squad, vehicle, group, ship, fleet.
    resolveString (inputString) {
        return this.resolveCommas(inputString)
            .map(str => new WNode(str))
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
                // Note that resolveString() always returns an array.
                const children = this.resolveString(childString);
                node.components = node.components.concat(children);
                children.forEach(
                    child => {
                        child.parent = node;
                    }
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

            // Slashes indicate pointers to external WGenerators.
            const table = Util.contains(alias, '/') ?
                WGenerator.getAliasTable(alias) :
                this.aliasTables[alias];

            if (! table) {
                throw new Error(`WGenerator.maybeResolveAlias(): Could not find alias table: ${ str }`);
            }

            const output = table.getOutput();

            return this.resolveCommas(output);
        }
        else {
            return [str];
        }
    }

    static exampleRaw () {
        const patrolRaw = require('../codices/halo/unsc/patrol.js');
        return patrolRaw;
    }

    // TODO: Consider a syntax like 'sunlight/warbands/warrior/squadLeader' for reaching into a table within a file.
    // That may need to check whether the last keyword is a alias or not.
    // I guess i should also consider a syntax wherein you can just mention a alias _without_ the surrounding brackets.

    // Example input: 'sunlight/warbands/warrior'
    static fromCodex (codexPath) {
        // Later, ignore leading slashes and trailing file extensions.
        const codexString = require(`${ WGenerator.codicesDir() }/${ codexPath }.js`);

        return new WGenerator(codexString);
    }

    static fromFile (path) {
        const fileString = fs.readFileSync(path, 'utf8');
        return new WGenerator(fileString);
    }

    static codicesDir () {
        return `${ __dirname }/../codices`;
    }

    static loadCodices () {
        // For now, this is hard coded to one fictional setting.
        WGenerator.loadHaloCodices();
    }

    static loadHaloCodices () {
        if (! WGenerator.generators) {
            WGenerator.generators = {};
        }
        else if (Util.exists( WGenerator.generators['halo/unsc/item'] )) {
            // WGenerator.generators already looks loaded.
            return;
        }

        // This awkward repeated-string-literal style is browserify can only see require statements with string literals in them. Make this more beautiful later.
        WGenerator.addGenerator(
            require('../codices/halo/unsc/item'),
            'halo/unsc/item'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/individual'),
            'halo/unsc/individual'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/squad'),
            'halo/unsc/squad'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/vehicle'),
            'halo/unsc/vehicle'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/ship'),
            'halo/unsc/ship'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/fleet'),
            'halo/unsc/fleet'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/patrol'),
            'halo/unsc/patrol'
        );
    }

    static addGenerator (moduleContents, codexPath) {
        const gen = new WGenerator(moduleContents, codexPath);

        WGenerator.generators[codexPath] = gen;
    }

    // The path parameters are arrays of strings.
    // Returns a absolute path version of the relative path (as a string) if it finds one
    // Otherwise it returns undefined.
    static interpretRelativePath (relativePath, contextPath) {
        // The last term of relativePath might refer to a file.
        const filePath = WGenerator.interpretRelativePathAsFile(relativePath, contextPath);

        if (filePath) {
            return filePath;
        }

        // Or the last term might refer to a table within a file.
        return WGenerator.interpretRelativePathAsTable(relativePath, contextPath);
    }

    // Path parameters are arrays of strings
    // Returns string or undefined
    static interpretRelativePathAsFile (relativePath, contextPath) {
        if (contextPath[contextPath.length - 1] !== relativePath[0]) {
            return;
        }

        // concat() and slice() have no side effects.
        const fullPath = contextPath.concat(relativePath.slice(1));
        const fullPathStr = fullPath.join('/');
        if (WGenerator.generators[fullPathStr]) {
            return fullPathStr;
        }

        return;
    }

    // Path parameters are arrays of strings
    // Returns string or undefined
    static interpretRelativePathAsTable (relativePath, contextPath) {
        if (
            contextPath[contextPath.length - 1] !== relativePath[0] ||
            relativePath.length < 2
        ) {
            return;
        }

        // Omit the table
        const tableIndex = relativePath.length - 1;
        const genPath = contextPath.concat(relativePath.slice(1, tableIndex));
        const genPathStr = genPath.join('/');
        const gen = WGenerator.generators[genPathStr];

        if (gen) {
            const goalTable = relativePath[tableIndex];

            // TODO unsure whether i want a alias-only function or what.
            if (
                gen.aliasTables[goalTable] ||
                gen.childTables[goalTable] ||
                gen.glossary[goalTable]
            ) {
                return genPathStr + '/' + goalTable;
            }
        }

        return;
    }

    static getAliasTable (absolutePath) {
        // First check if this refers to whole WGenerator instead of just a AliasTable
        let gen = WGenerator.generators[absolutePath];

        if (gen) {
            return gen.aliasTables.output;
        }

        // Otherwise interpret the last term of absolutePath as the name of a AliasTable
        const terms = absolutePath.split('/');
        const tableIndex = terms.length - 1;
        const genPath = terms.slice(0, tableIndex)
            .join('/');
        const tableName = terms[tableIndex];
        gen = WGenerator.generators[genPath];

        if (gen) {
            return gen.aliasTables[tableName];
        }

        throw new Error(`External AliasTable not found: ${ absolutePath }`);
    }

    static run () {
        WGenerator.loadCodices();

        const codexPaths = Object.keys(WGenerator.generators || []).join('\n');
        console.log(`Loaded the following WGenerator codices:\n${ codexPaths }`);

        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('wgenerator.js')) {
            // The following logic is for command-line use only.
            return;
        }

        let output;

        if (process.argv.length > 2) {
            const wgen = WGenerator.fromCodex(process.argv[2]);
            output = wgen.getOutputs();
        }
        else {
            output = [];
        }

        WGenerator.debugPrint(output);
    }

    static debugPrint (output) {
        output.forEach(
            node => {
                console.log(node.toPrettyString());
            }
        );
    }

    static test () {
        console.log(`WGenerator.test(): \n\n`);

        const wgen = WGenerator.fromCodex('battle20/halo/unsc/group');

        return wgen.getOutputs();
    }
}


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

            if (line === '') {
                continue;
            }

            const parts = line.split(/\s/);

            // Later i want to also support some sort of simple no-weights format.
            if (parts.length <= 1) {
                throw new Error(`AliasTable could not parse line: ${parts.join(' ')}`);
            }

            const weightStr = parts[0];

            // Everything after the weight prefix.
            const alias = line.slice(weightStr.length)
                .trim();

            // TODO During WGenerator construction, Interpret keys with slashes as external pointers.
            if (Util.contains(alias, '/')) {
                const otherGen = this.findCodex(alias);
                const absolutePath = otherGen.codexPath;
                // TODO: The alias local variable here should be set to the absolute path (including the table within the external Generator), not the relative path
                // TODO the 'new AliasTable()' call should probably be wrapped. In this external pointer scenario, i want to reference one of otherGen's existing AliasTable (or ChildTable etc later) objects, and to customize the slashy key.
                throw new Error(`Slash pointers are not yet supported: ${ alias }`);
            }

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

    // Returns string
    getOutput () {
        return Util.randomOf(this.outputs);
    }

    findCodex (requestedPath) {
        const relativePath = requestedPath.split('/');
        let curPath = this.generator.codexPath.split('/');

        while (curPath.length >= 1) {
            // TODO I want to interpret the last term as a possible alias table name, but not as a childTable or glossary name.
            const genPath = WGenerator.interpretRelativePath(relativePath, curPath);

            if (genPath) {
                // Note that this is the full generator, even if the path asked for a specific table in it.
                return WGenerator.generators[genPath];
            }

            curPath.pop();
        }

        throw new Error(`Could not find codex path ${ requestedPath }`);
    }

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


class ChildrenTable {
    constructor (rawString) {
        const lines = rawString.trim()
            .split('\n')
            .map(child => child.trim());

        this.templateName = ChildrenTable.withoutTheStarter(lines[0]);
        this.children = lines.slice(1);
    }

    static isAppropriateFor (tableString) {
        const t = tableString.trim()
            .toLowerCase();

        return ChildrenTable.STARTERS.some(
            starter => t.startsWith(starter)
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
    // 'childrenOf' is implied by the call to toLowerCase()
];


// TODO put this in class Template and template.js or something.
// This will probably become or call a constructor
// and store the first line in this.templateName
function parseTemplate (tableRaw) {
    const templateObj = new CreatureTemplate();

    tableRaw.split('\n')
        .slice(1)
        .map(
            line => {
                const parsed = parseTemplateLine(line);
                const key = parsed.key;

                if (
                    key in templateObj &&
                    ! ['tags', 'actions', 'resistance'].includes(key)
                ) {
                    throw new Error(`parseTemplate(): duplicate key '${ key }' in line '${ line }'. Full template is as follows:\n${ tableRaw }`);
                }

                templateObj[key] = parsed.value;
            }
        );

    // templateObj.key = templateKey(tableRaw);
    templateObj.templateName = templateKey(tableRaw);
    templateObj.setUpAction();

    // Later: at some point, detect whether it is a ActionTemplate or CreatureTemplate.
    // Probably mark templateObj.type, or instantiate the appropriate class, or something.

    return templateObj;
}

function parseTemplateLine (line) {
    line = line.trim();

    const colonIndex = line.indexOf(':');

    if (colonIndex < 0) {
        throw new Error(`parseTemplateLine(): No colon found in ${ line }`);
    }

    const key = line.slice(0, colonIndex)
        .trim();
    const rest = line.slice(colonIndex + 1)
        .trim();

    let value;
    if (key === 'tags') {
        value = rest.split(/\s/);
    }
    else if (key === 'resistance') {
        value = {};

        const entries = rest.split(',');

        entries.forEach(
            e => {
                const parts = e.trim()
                    .split(/\s/);
                const resistanceKey = parts[0];
                const modifier = Number(parts[1]);

                value[resistanceKey] = modifier;
            }
        );
    }
    else if (rest === 'true') {
        value = true;
    }
    else if (rest === 'false') {
        value = false;
    }
    else {
        // number case.
        const parsed = Number(rest);

        value = Util.exists(parsed) ?
            parsed :
            rest;
    }

    return {
        key: key,
        value: value
    };
}

function templateKey (tableRaw) {
    const START = 'template ';
    const startIndex = tableRaw.indexOf(START);
    const endIndex = tableRaw.indexOf('\n');

    return tableRaw.slice(startIndex + START.length, endIndex)
        .trim();
}

module.exports = WGenerator;



// Run
WGenerator.run();




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



I may eventually want to combine the file of the children and alias tables with the file of template definitions.
Didn't i call this the codex / templates split in the warbands project?
Counterargument: I may want to have a template called 'dropship'. 'dropship' may have both children (soldiers) and stats.
Is that a blocker?
No.
Entries would look like:
* children of dropship
* dropship [meaning the template's chassis, stats, variations from the chassis, whatever]
There couldn't be a alias named dropship
but maybe * dropshipSquad or something

The above plan might require tagging alias tables like:
* alias dropshipSquad





*/
