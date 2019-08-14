'use strict';

const Yaml = require('js-yaml');

const StorageModes = require('./storageModes.js');
const Util = require('../util/util.js');

// Waffle Node
// WAFFLE is a game engine related to the novel 'You' by Austen Grossman.
// A person, creature, component, or thing is represented here
// by a WNode or a tree of WNodes.

class WNode {
    constructor (templateName) {
        // Later: Safety checks, logging
        this.id = Util.newId();

        if (templateName) {
            this.templateName = templateName;
        }

        this.components = [];

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
            `<WNode with no template>`;

        if (this.displayName) {
            return `${this.displayName} (${tName})`;
        }
        else {
            return tName;
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
}

module.exports = WNode;
