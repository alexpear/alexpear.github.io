'use strict';

const Yaml = require('js-yaml');

const Util = require('./Util.js');

// Waffle Node
// WAFFLE is a game engine related to the novel 'You' by Austen Grossman.
// A person, creature, component, or thing is represented here
// by a WNode or a tree of WNodes.

let WNode = module.exports = class WNode {
    constructor(name) {
        // Later: Safety checks, logging
        this.id = Util.newId();

        if (name) {
            this.name = name;
        }

        this.components = [];
    }

    // TODO Also try a version of this func with a arbitrary number of params.
    add(node2) {
        this.components.push(node2);
        return this;
    }

    deepCopy() {
        let clone = new WNode();
        Object.assign(clone, this);

        clone.components = this.components.map(component => component.deepCopy());
        return clone;
    }

    toString () {
        return JSON.stringify(this, undefined, '    ');
    }

    // Format that looks like informal YAML but with props above components.
    toPrettyString (indent) {
        indent = Util.default(indent, 0);

        let outString = furtherLine(Util.formatProp(this, 'name'));
        outString += furtherLine(Util.formatProp(this, 'templateName'));

        const SPECIAL_PROPS = [
            'name',
            'templateName',
            'components'
        ];

        for (let prop in this) {
            if (! prop || Util.contains(SPECIAL_PROPS, prop)) {
                continue;
            }

            outString += furtherLine(Util.formatProp(this, prop));
        }

        if (this.components.length === 0) {
            outString += furtherLine('components: []');
        }
        else {
            outString += furtherLine('components:');
            for (let component of this.components) {
                outString += component.toPrettyString(indent + 2);
                outString += '\n';
            }

            // outString += furtherLine(']');
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
};
