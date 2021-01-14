'use strict';

const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

const WNode = require('../wnode/wnode.js');

// Later could make a variant of this which is not Halo-based. A generic size-based generator. Could probably specify the size lists in the codices/ dir somehow, eg '* childrenof armyList'.
class HaloArmy extends WNode {
    constructor (faction, totalSize) {
        super();

        this.faction = faction || 'unsc';
        const codex = HaloArmy.FACTION[this.faction];

        // Format as follows:
        // mantis: 1
        // marine: 12
        this.roster = {};

        let candidateName;
        while (this.remainingSize(totalSize) >= 1) {
            candidateName = Util.randomOf(Object.keys(codex));

            const copies = Math.floor(this.remainingSize(totalSize) / codex[candidateName]);
            //   MRB2: instead of filling 100% of remainingSize, instead fill Math.min(Math.random() + 0.3, 1) of it. Aka 30%-100% of it.

            if (copies >= 1) {
                this.add(candidateName, copies);
            }
        }
    }

    currentTotalSize () {
        const subtotals = Object.keys(this.roster)
            .map(type => this.roster[type] * HaloArmy.FACTION[this.faction][type]);

        return Util.sum(subtotals);
    }

    remainingSize (total) {
        return total - this.currentTotalSize();
    }

    add (name, quantity) {
        if (this.roster[name]) {
            this.roster[name] += quantity;
        }
        else {
            this.roster[name] = roomFor;
        }
    }

    static init () {
        HaloArmy.FACTION = {
            unsc: {
                // topdown sizes (meters)
                crew: 1,
                marine: 1,
                odst: 1,
                spartan: 1.5,
                mongoose: 3.5,
                mantis: 4,
                warthog: 6,
                wasp: 9,
                hornet: 10,
                falcon: 10,
                scorpion: 10,
                megaMantis: 18,
                elephant: 25,
                pelican: 31,
                tacticalMac: 33,
                mammoth: 68,
                frigate: 500,
                marathonClassCruiser: 1170,
                orbitalDefensePlatform: 1337,
                phoenixClassVessel: 2500,
                infinity: 5700
            },
            cov: {

            },

        }
    }

    static test () {


    }
}

module.exports = HaloArmy;

HaloArmy.init();
HaloArmy.test();
