'use strict';

const Util = require('../../util/util.js');

class Component {
    constructor () {
        this.id = Util.uuid();
        this.children = [];
    }

    type () {
        return this.constructor.name;
    }

    toJson () {
        return {
            id: this.id,
            children: this.children.map(child => child.toJson()),
        };
    }

    toJsonStr () {
        return Util.stringify(this.toJson());
    }

    addChild (child) {
        this.children.push(child);
        child.parent = this;
    }

    removeSelf () {
        if (! this.parent) {
            Util.error({
                context: `ScifiWarband: Component.removeSelf() called on Component with no parent.`,
                json: this.toJson(),
            });
        }

        this.parent.children = this.parent.children.filter(
            child => child !== this
        );

        this.parent = undefined;
    }

    static classes () {
        return ['Company', 'Squad', 'Creature', 'Item', 'Mod'];
    }
}

module.exports = Component;
