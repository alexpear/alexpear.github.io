'use strict';

const Yaml = require('js-yaml');

const StorageModes = require('./storageModes.js');
const Util = require('../util/util.js');

// Waffle Node
// WAFFLE is a game engine related to the novel 'You' by Austen Grossman.
// A person, creature, component, or thing is represented here by a WNode or a tree of WNodes.

class WNode {
    constructor (template) {
        // Later: Safety checks, logging
        this.id = Util.newId();

        if (template) {
            // Util.logDebug(`In WNode constructor. typeof template is ${typeof template}. template.name is ${template.name}`);

            if (template.name) {
                this.templateName = template.name;
                this.template = template;
            }
            else if (Util.isString(template)) {
                this.templateName = template;
            }
            else {
                throw new Error(`Cant instantiate WNode with unknown input of type ${typeof template}.`);
            }
        }

        this.components = [];

        // Partial means that dynamic 'fractal' storage could append components to this when its zoomed in on. IE, not guaranteed to be a leaf.
        this.storageMode = StorageModes.Partial;
        this.lastVisited = Date.now();
    }

    add (...nodes) {
        nodes.forEach(node => {
            node.parent = this;
        });
        this.components = this.components.concat(nodes);
        return this;
    }

    deepCopy () {
        const clone = new WNode();
        Object.assign(clone, this);
        clone.id = Util.newId();

        clone.components = this.components.map(component => component.deepCopy());
        return clone;
    }

    // Object with all the node's properties except components, id, templateName, functions, etc.
    traits () {

    }

    // String for displaying the traits
    prettyTraits () {
        const traits = this.traits();

        return ``;
    }

    // Later, it may be performant to reference this.template[propStr], instead of storing those props on every WNode instance of the template.
    traitSum (propStr) {
        return (this[propStr] || 0) +
            Util.sum(
                this.components.map(
                    c => c.traitSum(propStr)
                )
            );
    }

    traitMax (propStr) {
        const localTrait = this[propStr] || 0;
        const max = this.components.reduce(
            (soFar, component) => Math.max(soFar, component.traitMax(propStr)),
            localTrait
        );

        return max || localTrait;
    }

    traitMin (propStr) {
        const localTrait = this[propStr];
        const min = this.components.reduce(
            (soFar, component) => Math.min(soFar, component.traitMin(propStr)),
            localTrait || Infinity
        );

        return min === Infinity ?
            localTrait :
            min;
    }

    headCount () {
        const sum = this.traitSum('individuals');

        // Util.log(`In headCount(). this.templateName is ${this.templateName}. sum is ${sum}. this.individuals is ${this.individuals}.`, 'debug');

        return sum;
    }

    getWeight () {
        return this.traitSum('weight');
    }

    maxSize () {
        return this.traitMax('size');
    }

    minSize () {
        return this.traitMin('size');
    }

    getSpeed () {
        return this.traitMin('speed');
    }

    getStealth () {
        return this.traitMin('stealth');
    }

    toSimpleString () {
        const tName = this.templateName ?
            Util.fromCamelCase(this.templateName) :
            `<WNode with no templateName>`;

        const active = this.active ?
            'Up' :
            'KO';

        if (this.displayName) {
            return `${this.displayName} (${tName})`;
        }
        else {
            return `${tName} (${this.shortId()}, ${active}, ${this.alignment})`;
        }
    }

    // Format that looks like informal YAML but with props above components.
    toPrettyString (indent) {
        indent = Util.default(indent, 0);

        let outString = furtherLine(Util.formatProp(this, 'name'));
        outString += furtherLine(this.templateName);

        const SKIP_PROPS = [
            'name',
            'templateName',
            'id',
            'parent',
            'components'
        ];

        for (let prop in this) {
            if (! prop || Util.contains(SKIP_PROPS, prop)) {
                continue;
            }

            // outString += furtherLine('  ' + Util.formatProp(this, prop));
        }

        const headCount = this.headCount();
        if (headCount) {
            outString += furtherLine(`  ${Util.commaNumber(headCount)} personnel`);
        }

        const weight = this.getWeight();
        if (weight) {
            outString += furtherLine(`  ${Util.commaNumber(weight)} kg`);
        }

        const speed = this.getSpeed();
        if (speed) {
            // outString += furtherLine(`  Mobility Rating: ${speed}`);
        }

        const stealth = this.getStealth();
        if (stealth) {
            // outString += furtherLine(`  Stealth Rating: ${stealth}`);
        }

        if (this.components.length > 0) {
            outString += furtherLine('  w/');
            for (let component of this.components) {
                outString += component.toPrettyString(indent + 4);
            }
        }

        return outString;

        function furtherLine (text/*, indent*/) {
            return text ?
                Util.repeat(' ', indent) + text + '\n' :
                '';
        }
    }

    // Returns a abbreviation of the ID.
    shortId () {
        return `${Util.shortId(this.id)}`;
    }

    getPropSummary () {
        return {
            headCount: this.headCount() || 0,
            weight: this.getWeight() || 0
        };
    }

    getPropText () {
        const props = this.getPropSummary();
        return [
            props.headCount ? `${Util.commaNumber(props.headCount)} personnel` : '',
            props.weight ? `${Util.commaNumber(props.weight)} kg` : ''
        ]
        .join('<br>');
    }

    toYaml () {
        return Yaml.dump(this);
    }

    root () {
        return this.parent ?
            this.parent.root() :
            this;
    }

    treeSize () {
        const root = this.root();
        return root.subtreeSize();
    }

    subtreeSize () {
        return this.components.reduce(
            (sizeSoFar, component) => sizeSoFar + component.subtreeSize(),
            1
        );
    }

    encyclopediaEntry () {
        // Later.
        return `${ Util.capitalized(this.templateName) }: A creature with the following traits: ${ this.components.map(c => c.toString()).join(', ') }.`;
    }

    // Modify and touch up a tree
    tidy () {
        this.updateMbti();
        // Later could add a function to combine trait-subtrees into simpler forms
        // Eg this subtree: soldier > human > female
        // could become soldier (w/ human props & gender prop)

        this.components.forEach(
            c => c.tidy()
        );
    }

    // threshold is in ms of Unix time.
    // Recursive.
    pruneIfOld (threshold) {
        if (
            this.lastVisited &&
            this.lastVisited <= threshold
        ) {
            // Remove this WNode from the components of the parent.
            this.parent.components = this.parent.components.filter(
                component => component.id !== this.id
            );

            this.parent.storageMode = StorageModes.Partial;
            return;
        }

        this.components.forEach(
            component => component.pruneIfOld()
        );
    }

    toArray (arraySoFar) {
        arraySoFar = arraySoFar || [];

        return this.components.map(
            c => c.toArray()
        )
        .reduce(
            (a, subtree) => a.concat(subtree),
            [this]
        );
    }

    // Myers-Briggs personality category
    updateMbti () {
        if (! this.displayName && this.templateName.toLowerCase() === 'mbti') {
            this.displayName = Util.mbti();
            this.description = 'Myers-Briggs personality category';
        }
    }

    static sortSubtrees (nodes) {
        nodes.sort(
            WNode.comparator
        )
        .forEach(
            node => {
                WNode.sortSubtrees(node.components);
            }
        );
    }

    static comparator (a, b) {
        // Later, learn why maxSize() sorting seems screwy with UNSC army tree (2019 March)
        // const aSize = a.maxSize();
        // const bSize = b.maxSize();
        // if (aSize > 0 || bSize > 0) {
        //     return bSize - aSize;
        // }

        const aWeight = a.getWeight();
        const bWeight = b.getWeight();

        if (aWeight > 0 || bWeight > 0) {
            return bWeight - aWeight;
        }

        return (a.templateName || '').localeCompare(
            b.templateName || ''
        );
    }

    static test () {
        // Unit test for toArray()
        const root = new WNode('root');
        const l = new WNode('l');
        const ll = new WNode('ll');
        const lr = new WNode('lr');
        const r = new WNode('r');
        const rr = new WNode('rr');
        const rrl = new WNode('rrl');
        const rrr = new WNode('rrr');
        root.components = [l, r];
        l.components = [ll, lr];
        r.components = [rr];
        rr.components = [rrl, rrr];

        const output = root.toArray();
        const expected = [root, l, ll, lr, r, rr, rrl, rrr];

        for (let i = 0; i < output.length; i++) {
            if (output[i] !== expected[i]) {
                throw new Error(`WNode.toArray() unit test failed. Output was: ${output.map(n => n.templateName).join(', ')}`);
            }
        }

        Util.log(`WNode.toArray() unit test passed :)`, 'debug');
    }
}

module.exports = WNode;
