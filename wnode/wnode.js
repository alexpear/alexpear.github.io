'use strict';

const Yaml = require('js-yaml');

const Util = require('../util/util.js');

// Waffle Node
// WAFFLE is a game engine related to the novel 'You' by Austen Grossman.
// A person, creature, component, or thing is represented here
// by a WNode or a tree of WNodes.

let WNode = module.exports = class WNode {
    constructor (templateName) {
        // Later: Safety checks, logging
        this.id = Util.newId();

        if (templateName) {
            this.templateName = templateName;
        }

        this.components = [];
    }

    add (...nodes) {
        nodes.forEach(node => {
            node.parent = this;
        });
        this.components = this.components.concat(nodes);
        return this;
    }

    deepCopy () {
        let clone = new WNode();
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
            (soFar, component) => Math.max(soFar, component[propStr] || 0),
            localTrait
        );

        return max || localTrait;
    }

    traitMin (propStr) {
        const localTrait = this[propStr];
        const min = this.components.reduce(
            (soFar, component) => Math.min(soFar, component[propStr] || Infinity),
            localTrait || Infinity
        );

        return min === Infinity ?
            localTrait :
            min;
    }

    headCount () {
        return this.traitSum('individuals');
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
        return this.templateName ?
            Util.fromCamelCase(this.templateName) :
            '(WNode with no template)';
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

            outString += furtherLine(Util.formatProp(this, prop));
        }

        const headCount = this.headCount();
        if (headCount) {
            outString += furtherLine(`${headCount} personnel`);
        }

        const weight = this.getWeight();
        if (weight) {
            outString += furtherLine(`${weight} kg`);
        }

        const speed = this.getSpeed();
        if (speed) {
            outString += furtherLine(`Mobility Rating: ${speed}`);
        }

        const stealth = this.getStealth();
        if (stealth) {
            outString += furtherLine(`Stealth Rating: ${stealth}`);
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

    toYaml () {
        return Yaml.dump(this);
    }

    encyclopediaEntry () {
        // Later.
        return `${ Util.capitalized(this.templateName) }: A creature with the following traits: ${ this.components.map(c => c.toString()).join(', ') }.`;
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
        return (a.templateName || '').localeCompare(
            b.templateName || ''
        );
    }
};
