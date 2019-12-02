'use strict';

// Generator that outputs procedurally generated trees of WNodes (Waffle nodes).
// These trees represent games states, game elements, narrative elements, and similar concepts.

const fs = require('fs');

// LATER perhaps restructure so that WGenerator doesn't import any Battle20 files.
// Eg, perhaps CreatureTemplate should not be Battle20-specific?
const AliasTable = require('./aliasTable.js');
const ChildTable = require('./childTable.js');
const Creature = require('../wnode/creature.js');
const CreatureTemplate = require('../battle20/creaturetemplate.js');
const StorageModes = require('../wnode/storageModes.js');
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
        // usage will be: glossary.getTemplate('naga');
        // Currently, glossary is indexed by templateNames and contains CreatureTemplates.
        this.glossary = {};

        // TODO: Add support for ignorable comments in codex files
        const tableRaws = this.rawString.split('*');

        tableRaws.forEach(
            tableRaw => {
                tableRaw = tableRaw.trim();

                if (! tableRaw.length) {
                    return;
                }

                if (ChildTable.isAppropriateFor(tableRaw)) {
                    return this.addChildTable(tableRaw);
                }

                // Later, this could be neater and not involve a string literal. 'template ' could be a const.
                if (tableRaw.startsWith('template ')) {
                    this.addTemplate(tableRaw);
                    return;
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

    toJson () {
        return {
            codexPath: this.codexPath,
            rawString: this.rawString,
            aliasTables: Util.dictToJson(this.aliasTables),
            childTables: Util.dictToJson(this.childTables),
            glossary: Util.dictToJson(this.glossary)
        };
    }

    addChildTable (tableRaw) {
        const childTable = new ChildTable(tableRaw, this);
        // TODO replace terminology: key -> templateName
        const key = childTable.templateName;

        if (key in this.childTables) {
            // Later perhaps also mention which file this is, or paste the content of the file
            throw new Error(`children table key '${ key }' appears twice`);
        }

        // Later make this case insensitive
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
        const templateObj = CreatureTemplate.fromRaw(tableRaw);
        const key = templateObj.name;

        if (key in this.glossary) {
            throw new Error(`template key '${ key }' appears twice`);
        }

        this.glossary[key] = templateObj;

        templateObj.actions.forEach(
            actionTemplate => {
                WGenerator.ids[actionTemplate.id] = actionTemplate;
            }
        );

        Util.logDebug(`In WGenerator.addTemplate(), at the bottom. Just added ${key}, which had ${templateObj.actions.length} actions. actions[0].id is ${templateObj.actions[0] && templateObj.actions[0].id}`);
    }

    // Returns WNode[]
    getOutputs (key) {
        const nodes = this.resolveString(key || '{output}');

        nodes.forEach(
            n => n.tidy()
        );

        return nodes;
    }

    // Returns ContextString[]
    resolveCommas (inputString) {
        // Util.log(`Top of resolveCommas(), inputString is '${inputString}'`, 'debug');

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

    // Returns WNode[]
    resolveString (inputString) {
        const nodes = this.resolveCommas(inputString)
            .map(contextString => this.makeSubtree(contextString));

        WNode.sortSubtrees(nodes);
        return nodes;
    }

    // Returns WNode[]
    // Returned nodes have .storageMode === Partial and lack children of their own.
    // Non-recursive variant of resolveString(), used for fractal tree browsing.
    resolveStringOnly (inputString) {
        const nodes = this.resolveCommas(inputString)
            .map(contextString => this.makePartialNode(contextString));

        // TODO figure out whether sortSubtrees() needs modification when they are not trees
        WNode.sortSubtrees(nodes);
        return nodes;
    }

    // LATER maybe rename ContextString local vars to contextString or contextStr, for reading clarity.
    // Returns a WNode
    makeSubtree (cString) {
        return cString.path === this.codexPath ?
            this.makeLocalSubtree(cString) :
            WGenerator.makeExternalSubtree(cString);
    }

    // Returns a WNode
    makeLocalSubtree (cString) {
        const gen = WGenerator.generators[cString.path];
        const template = gen.glossary[cString.name];

        const node = gen.makeNode(template, cString.name);

        // Util.log(`Middle of makeLocalSubtree(${cString}). Expression node.templateName is ${node.templateName}`, 'debug');

        // this.applyTemplate(node, template);
        return this.maybeAddChildren(node);
    }

    // Returns undefined
    applyTemplate (node, template) {
        if (! template) {
            return;
        }

        for (let prop in template) {
            // Later there might be some properties that shouldn't be overwritten.
            node[prop] = template[prop];
        }
    }

    makeNode (template, templateName) {
        // if (template && template.name === 'marinePrivate' || templateName === 'marinePrivate') {
            // Util.logDebug(`In WGenerator.makeNode(), input involved marinePrivate. template.isCreature() returns ${template && template.isCreature()}`);
        // }

        if (! template) {
            return new WNode(templateName);
        }

        if (template.isCreature()) {
            return new Creature(template);
        }

        if (template.isThing()) {
            return new Thing(template);
        }

        // Fallback case
        return new WNode(template);
    }

    // Might modify node.components
    // Returns a WNode
    maybeAddChildren (node) {
        // Later make this case insensitive
        const table = this.childTables[node.templateName];

        if (table) {
            return this.addChildren(node, table);
        }
        else {
            return node;
        }
    }

    // Modifies node.components
    // Returns the modified WNode
    // For fractal generation, we want a variant of this where each call to resolveString() returns WNodes of status Partial, each with no children of their own.
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

    // Non recursive variant of maybeAddChildren(), for fractal browsing mode.
    // Might modify node.components
    // The child nodes will be status Partial.
    // This function adds no grandchildren.
    // Returns a WNode
    maybeAddChildrenOnly (node) {
        // Later make this case insensitive
        const table = this.childTables[node.templateName];

        if (table) {
            return this.addChildrenOnly(node, table);
        }
        else {
            node.storageMode = StorageModes.Complete;
            return node;
        }
    }

    // Modifies node.components
    // Returns the modified WNode
    addChildrenOnly (node, table) {
        table.children.forEach(
            childString => {
                // Note that resolveStringOnly() always returns an array.
                const children = this.resolveStringOnly(childString);
                node.components = node.components.concat(children);
                children.forEach(
                    child => {
                        child.parent = node;
                        child.storageMode = StorageModes.Partial;
                    }
                );
            }
        );

        node.storageMode = StorageModes.Complete;
        return node;
    }

    // Returns ContextString[]
    // No side effects.
    // Note that this involves randomness.
    maybeResolveAlias (str) {
        str = str.trim();

        // Util.log(`Top of maybeResolveAlias( '${str}' )`, 'debug');

        if (str[0] === '{') {
            if (str[str.length - 1] !== '}') {
                throw new Error(`WGenerator.maybeResolveAlias(): Error parsing a string: ${ str }`);
            }

            // TODO: Somewhere, possibly here, {}s are being prioritized before commas.
            // AKA the bug is interpreting {foo}, {bar} as one alias with the name 'foo}, {bar'
            const alias = str.slice(1, str.length - 1)
                .trim();

            // Slashes indicate pointers to external WGenerators.
            // Any slashpaths here will already have been made absolute during AliasTable setup.
            // Should we convert alias to a ContextString here?
            return Util.contains(alias, '/') ?
                WGenerator.resolveExternalAlias(alias) :
                this.resolveLocalAlias(alias);

            // TODO: resolveExternalAlias returns string[], without reference to which codex it is from. The originating codex must be checked because its ChildTables may be relevant.
            // One option would be for these funcs to return ContextString objs
        }
        else if (str === 'nothing') {
            return [];
        }
        else {
            const cString = this.contextString(str);
            return [cString];
        }
    }

    // Returns ContextString[]
    resolveLocalAlias (tableName) {
        // Later make this case insensitive
        const table = this.aliasTables[tableName];

        if (! table) {
            throw new Error(`Could not find local alias table: ${ tableName }`);
        }

        return table.getOutputAndResolveIt();
    }

    // Converts a more arbitrary string into a ContextString object.
    contextString (stringWithoutCommas) {
        if (Util.contains(stringWithoutCommas, '/')) {
            const path = this.makePathAbsolute(stringWithoutCommas);
            const findings = WGenerator.findGenAndTable(path);

            return new ContextString(
                findings.name,
                findings.gen.codexPath
            );
        }

        return new ContextString(
            stringWithoutCommas,
            this.codexPath
        );
    }

    // Returns a string
    makeSomePathsAbsolute (slashStr) {
        return slashStr.split(',')
            .map(
                p => {
                    const path = p.trim();
                    return this.makePathAbsolute(path);
                }
            )
            .join(',');
    }

    // Returns a string
    makePathAbsolute (relativePathStr) {
        if (relativePathStr.startsWith('{')) {
            return this.getAbsoluteAlias(relativePathStr);
        }

        // Referring to a external template name.
        return this.getAbsolutePath(relativePathStr);
    }

    // Returns a string
    getAbsoluteAlias (relativePathAlias) {
        // One duplicate comparison. I dont think this will slow performance appreciably.
        if (relativePathAlias.startsWith('{')) {
            relativePathAlias = relativePathAlias.slice(1);
        }
        if (relativePathAlias.endsWith('}')) {
            relativePathAlias = relativePathAlias.slice(0, relativePathAlias.length - 1);
        }

        const absolutePath = this.getAbsolutePath(relativePathAlias);
        return `{${absolutePath}}`;
    }

    // Returns a string
    // Later i could return ContextString instead of a absolute path.
    getAbsolutePath (relativePathStr) {
        const relativePath = relativePathStr.trim()
            .split('/');

        // Later: codexPath is sometimes not initialized.
        let curPath = this.codexPath.split('/');

        // Later, could detect if a path is absolute by checking whether its first term is on a whitelist of settings.
        // const CONTEXTS = ['40k', 'darktapestry', 'dnd', 'downstairs', 'halo', 'parahumans', 'scifi', 'sunlight', 'wizardingworld', 'yearsofadventure'];
        while (curPath.length >= 0) {
            // Util.log(`In ChildTable.getAbsolutePath( '${relativePathStr}' ) loop. curPath is ${curPath}. curPath.length is ${curPath.length}. curPath[0] is ${curPath[0]}.`, 'debug');

            // TODO I may want to interpret the last term as a possible alias table name, but not as a childTable or glossary name.
            const genPath = WGenerator.interpretRelativePath(relativePath, curPath);

            if (genPath) {
                return genPath;
            }

            // do/while would be neater but whatever.
            if (curPath.length === 0) {
                break;
            }

            curPath.pop();
        }

        throw new Error(`Could not find codex path ${ relativePathStr }`);
    }

    static exampleRaw () {
        const patrolRaw = require('../codices/halo/unsc/patrol.js');
        return patrolRaw;
    }

    static exampleGenerator () {
        return WGenerator.generators['halo/presence'];
    }

    // Example input: 'sunlight/warbands/warrior'
    static fromCodex (codexPath) {
        // Warning: dynamic require() calls are incompatible with browserify.
        const codexRaw = require(`${ WGenerator.codicesDir() }/${ codexPath }.js`);

        return new WGenerator(codexRaw, codexPath);
    }

    static fromFile (path) {
        const fileString = fs.readFileSync(path, 'utf8');
        return new WGenerator(fileString, codexPath);
    }

    static codicesDir () {
        return `${ __dirname }/../codices`;
    }

    static loadCodices () {
        // For now, this is hard coded to one fictional setting.
        WGenerator.loadHaloCodices();
        WGenerator.loadSunlightCodices();
    }

    static loadHaloCodices () {
        // Util.log(`Top of loadHaloCodices(), WGenerator.generators is ${WGenerator.generators}.`, 'debug');

        if (! WGenerator.generators) {
            WGenerator.generators = {};
        }
        else if (Util.exists( WGenerator.generators['halo/unsc/item'] )) {
            // WGenerator.generators already looks loaded.
            return;
        }

        // This awkward repeated-string-literal style is because browserify can only see require statements with string literals in them. Make this more beautiful later.
        // GOTCHA: It's important to load the files describing small components first.
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
            require('../codices/halo/unsc/company'),
            'halo/unsc/company'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/battalion'),
            'halo/unsc/battalion'
        );
        // WGenerator.addGenerator(
        //     require('../codices/halo/unsc/vehicle'),
        //     'halo/unsc/vehicle'
        // );
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
        WGenerator.addGenerator(
            require('../codices/halo/cov/item'),
            'halo/cov/item'
        );
        WGenerator.addGenerator(
            require('../codices/halo/cov/individual'),
            'halo/cov/individual'
        );
        WGenerator.addGenerator(
            require('../codices/halo/cov/squad'),
            'halo/cov/squad'
        );
        WGenerator.addGenerator(
            require('../codices/halo/cov/force'),
            'halo/cov/force'
        );
        WGenerator.addGenerator(
            require('../codices/halo/forerunner/item'),
            'halo/forerunner/item'
        );
        WGenerator.addGenerator(
            require('../codices/halo/forerunner/individual'),
            'halo/forerunner/individual'
        );
        WGenerator.addGenerator(
            require('../codices/halo/forerunner/squad'),
            'halo/forerunner/squad'
        );
        WGenerator.addGenerator(
            require('../codices/halo/forerunner/company'),
            'halo/forerunner/company'
        );
        WGenerator.addGenerator(
            require('../codices/halo/flood/individual'),
            'halo/flood/individual'
        );
        WGenerator.addGenerator(
            require('../codices/halo/flood/squad'),
            'halo/flood/squad'
        );
        WGenerator.addGenerator(
            require('../codices/halo/presence'),
            'halo/presence'
        );
    }

    static loadSunlightCodices () {
        if (! WGenerator.generators) {
            WGenerator.generators = {};
        }
        else if (Util.exists( WGenerator.generators['sunlight/warband/item'] )) {
            // WGenerator.generators already looks loaded.
            return;
        }

        // This awkward repeated-string-literal style is because browserify can only see require statements with string literals in them. Make this more beautiful later.
        WGenerator.addGenerator(
            require('../codices/sunlight/warband/item'),
            'sunlight/warband/item'
        );
        WGenerator.addGenerator(
            require('../codices/sunlight/warband/player'),
            'sunlight/warband/player'
        );
    }

    static addGenerator (moduleContents, codexPath) {
        // Util.log(`BEACON RHYE Top of addGenerator( contents present? ${!!moduleContents}, ${codexPath} ).`, 'debug');

        const gen = new WGenerator(moduleContents, codexPath);

        WGenerator.generators[codexPath] = gen;
    }

    // The path parameters are arrays of strings.
    // Returns a absolute path version of the relative path (as a string) if it finds one
    // Otherwise it returns undefined.
    static interpretRelativePath (relativePath, contextPath) {
        // console.log(`Top of WGenerator.interpretRelativePath([${relativePath}], [${contextPath}])`);

        // The last term of relativePath might refer to a file.
        const filePath = WGenerator.interpretRelativePathAsFile(relativePath, contextPath);

        if (filePath) {
            return filePath;
        }

        // Or the last term might refer to a name within a context path.
        return WGenerator.interpretRelativePathAsName(relativePath, contextPath);
    }

    // Path parameters are arrays of strings
    // Returns string or undefined
    static interpretRelativePathAsFile (relativePath, contextPath) {
        // concat() has no side effects.
        const fullPath = contextPath.concat(relativePath);
        const fullPathStr = fullPath.join('/');
        if (WGenerator.generators[fullPathStr]) {
            return fullPathStr;
        }

        return;
    }

    // Path parameters are arrays of strings
    // Returns string or undefined
    static interpretRelativePathAsName (relativePath, contextPath) {
        if (relativePath.length < 2) {
            return;
        }

        const nameIndex = relativePath.length - 1;

        // Omit the name
        // Note: concat() and slice() have no side effects.
        const genPath = contextPath.concat(relativePath.slice(0, nameIndex));
        const genPathStr = genPath.join('/');
        const gen = WGenerator.generators[genPathStr];

        // Util.log(
        //     `In WGenerator.interpretRelativePathAsName( ${relativePath}, ${contextPath} ) before the if. genPath is ${genPath}. genPathStr is ${genPathStr}. gen is ${gen}.`,
        //     'debug'
        // );

        if (gen) {
            const goalName = relativePath[nameIndex];
            return genPathStr + '/' + goalName;
        }

        return;
    }

    // The 'absolutePath' param might be the path to a codex or to a name within that codex.
    static findGenAndTable (absolutePath) {
        // First check if this refers to whole codex file instead of a table within it.
        let gen = WGenerator.generators[absolutePath];

        if (gen) {
            return {
                gen: gen,
                name: 'output'
            };
        }

        // Otherwise interpret the last term of absolutePath as the name of a table.
        // Later, functionize this string-splitting logic.
        const terms = absolutePath.split('/');
        const tableIndex = terms.length - 1;
        const genPath = terms.slice(0, tableIndex)
            .join('/');
        const tableName = terms[tableIndex];

        gen = WGenerator.generators[genPath];

        if (gen) {
            return {
                gen: gen,
                name: tableName
            };
        }

        throw new Error(`Could not find a WGenerator for this absolutePath: ${ absolutePath }`);
    }

    // Returns ContextString[]
    static resolveExternalAlias (absolutePath) {
        const findings = WGenerator.findGenAndTable(absolutePath);
        // Later, check if this throwing is redundant.
        if (! findings || ! findings.gen || ! findings.name) {
            throw new Error(`Did not find gen and/or name for absolutePath: ${absolutePath}`);
        }

        return findings.gen.resolveLocalAlias(findings.name);
    }

    // Returns a WNode
    // References the appropriate WGenerator's ChildTables, templates, etc
    // The path was already made absolute during table construction (both AliasTable and ChildTable rows).
    static makeExternalSubtree (cString) {
        const gen = WGenerator.generators[cString.path];
        return gen.makeLocalSubtree(cString);
    }

    static run () {
        WGenerator.loadCodices();

        const codexPaths = Object.keys(WGenerator.generators || []).join('\n');
        console.log(`Loaded the following WGenerator codices:\n${ codexPaths }\n`);

        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('wgenerator.js')) {
            // The following logic is for command-line use only.
            return;
        }

        let output;

        if (process.argv.length > 2) {
            if (! process.argv[2].includes('/')) {
                console.log(`Usage: node wgenerator.js <codexPath>`);
                return;
            }
            else {
                // Later we can add support for references inside codex files, such as halo/forerunner/individual/knight.
                // This is supported in parsing but not in the CLI yet.
                // The alg will be:
                    // Check if the input path is a codex (ie, !!WGenerator.generators[process.argv[2]])
                    // If so, call its .getOutputs() func
                    // Else look at the input path minus the final term
                    // then call wgen.getOutputs(finalTerm)
                    // or wrap it in brackets if its a alias: `{${finalTerm}}`
                const wgen = WGenerator.fromCodex(process.argv[2]);
                output = wgen.getOutputs();
            }
        }
        else {
            output = [];
        }

        WGenerator.debugPrint(output);
    }

    static debugPrint (output) {
        Util.array(output).forEach(
            node => {
                console.log(node.toPrettyString());

                // Util.log(`There are ${node.components.length} components. The first one is ${node.components[0] && node.components[0].templateName}.`, 'debug');
            }
        );
    }

    static test () {
        console.log(`WGenerator.test(): \n\n`);

        const wgen = WGenerator.fromCodex('battle20/halo/unsc/group');

        return wgen.getOutputs();
    }
}

// Universal dict for codex-related objects keyed by ID. Used for ActionTemplates so far.
WGenerator.ids = {};


// TODO move to its own file
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

...

Parsing external pointers
localThing
{localThing}
halo/unsc/item/externalThing
{halo/unsc/item/externalThing}




*/
