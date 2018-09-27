'use strict';

const Yaml = require('js-yaml');

const Util = require('./Util.js');

// Waffle Node
// WAFFLE is a game engine related to the novel 'You' by Austen Grossman.
// A person, creature, component, or thing is represented here
// by a WNode or a tree of WNodes.

let WNode = module.exports = class WNode {
    constructor(templateName) {
        // Later: Safety checks, logging
        this.id = Util.newId();

        if (templateName) {
            this.templateName = templateName;
        }

        this.components = [];
    }

    add(...nodes) {
        this.components = this.components.concat(nodes);
        return this;
    }

    deepCopy() {
        let clone = new WNode();
        Object.assign(clone, this);
        clone.id = Util.newId();

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
        outString += furtherLine(this.templateName);

        const SKIP_PROPS = [
            'name',
            'templateName',
            'id',
            'components'
        ];

        for (let prop in this) {
            if (! prop || Util.contains(SKIP_PROPS, prop)) {
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
