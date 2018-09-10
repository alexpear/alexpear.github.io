'use strict';

// Generator that outputs procedurally generated trees of WNodes (Waffle nodes).
// These trees represent games states, game elements, narrative elements, and similar concepts.

const WNode = require('./wnode.js');

class WGenerator {
    // Constructor param will be either a birddecisions-format string or a filename.
    constructor(todo) {
        this.rawString = '';
    }

    getOutput() {

        return new WNode('todo');
    }


    static exampleTree() {
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

    static test() {
        const pelican = WGenerator.exampleTree();
        console.log(`WGenerator.test(): \n\n${ pelican.toPrettyString()}`);
    }
}


// Run
WGenerator.test();
