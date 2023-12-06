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
            children: this.children.map(child => child.toJson?.() || child?.constructor?.name || typeof child),
        };
    }

    // NOTE - use .toJson() instead if the output will be passed into another .stringify() call.
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

    parentType () {
        return this.parent.type?.();
    }

    childType () {
        const classes = Component.classes();

        for (let i = 0; i < classes.length; i++) {
            if (classes[i] === this.type()) {
                return classes[i + 1];
            }
        }
    }

    sanityCheck() {
        if (this.children.length === 0) {
            if (['Company', 'Squad'].includes(this.type())) {
                Util.error({
                    message: `Empty company or squad`,
                    json: this.toJson(),
                    type: this.type(),
                    context: `ScifiWarband - Component.js .sanityCheck()`,
                });
            }
        }

        for (let child of this.children) {
            if (! child || ! child instanceof Component) {
                Util.error({
                    message: `Child is not a Component`,
                    json: this.toJson(),
                    child: child,
                    type: this.type(),
                    context: `ScifiWarband - Component.js .sanityCheck()`,
                });
            }

            if (child.type() !== this.childType()) {
                Util.error({
                    message: `Child is wrong Component type`,
                    json: this.toJson(),
                    child: child.toJson(),
                    type: this.type(),
                    childType: child.type(),
                    expectedChildType: this.childType(),
                    context: `ScifiWarband - Component.js .sanityCheck()`,
                });
            }

            if (child.parent !== this) {
                Util.error({
                    message: `Wrong parent pointer`,
                    pointer: child?.parent?.toJson?.(),
                    json: this.toJson(),
                    child: child.toJson(),
                    type: this.type(),
                    context: `ScifiWarband - Component.js .sanityCheck()`,
                });
            }

            child.sanityCheck();
        }
    }

    static classes () {
        return ['Company', 'Squad', 'Creature', 'Item', 'Mod'];
    }
}

module.exports = Component;
