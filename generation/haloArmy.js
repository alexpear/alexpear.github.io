'use strict';

const WGenerator = require('./wgenerator.js');

const Util = require('../util/util.js');

const WNode = require('../wnode/wnode.js');

// Later could make a variant of this which is not Halo-based. A generic size-based generator. Could probably specify the size lists in the codices/ dir somehow, eg '* childrenof armyList'.
class HaloArmy extends WNode {
    constructor (faction, totalSize, maxIndividualSize) {
        super();

        this.faction = faction || 'unsc';
        const codex = HaloArmy.FACTION[this.faction];
        totalSize = totalSize || 35;
        maxIndividualSize = maxIndividualSize || totalSize;

        // Format as follows:
        // mantis: 1
        // marine: 12
        this.roster = {};

        let candidateName;
        while (this.remainingSize(totalSize) >= 1) {
            candidateName = Util.randomOf(Object.keys(codex));

            const candidateSize = codex[candidateName];
            if (candidateSize > maxIndividualSize) {
                continue;
            }

            const maxCopies = Math.floor(this.remainingSize(totalSize) / codex[candidateName]);

            // Sometimes fill partially, sometimes fill fully.
            const zeal = Math.min(
                Math.random() + 0.3,
                1
            );

            const copies = Math.ceil(zeal * maxCopies);

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
            this.roster[name] = quantity;
        }
    }

    pretty () {
        return Object.keys(this.roster)
            .map(
                name => `${Util.fromCamelCase(name)} x${this.roster[name]}`
            )
            .join('\n');
    }

    prettyPrint () {
        Util.log(this.pretty());
    }

    static randomLocation () {
        return Util.randomOf(
            Object.keys(HaloArmy.LOCATION)
        );
    }

    static init () {
        HaloArmy.FACTION = {
            unsc: {
                // topdown sizes (meters)
                // crew: 1,
                marine: 1,
                odst: 1,
                spartan: 1.5,
                mongoose: 3.5,
                gungoose: 3.5,
                mantis: 4,
                chaingunWarthog: 6,
                transportWarthog: 6,
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
                // orbitalDefensePlatform: 1337, // Doesnt mix and match with ground forces.
                phoenixClassVessel: 2500,
                infinity: 5700
            },
            cov: {
                grunt: 1,
                specOpsGrunt: 1,
                jackal: 1,
                drone: 1,
                elite: 2,
                stealthElite: 2,
                brute: 2,
                hunter: 3,
                ghost: 4,
                shadeTurret: 4,
                chopper: 6,
                banshee: 7,
                revenant: 7,
                spectre: 7,
                prowler: 7,
                sniperPlatform: 8,
                wraith: 9,
                locust: 12,
                phantom: 33,
                scarab: 49,
                lich: 103,
                kraken: 200,
                harvester: 278,
                lightCruiser: 300,
            },

        };

        HaloArmy.LOCATION = {
            guardian: 75,
            lockout: 80,
            hangEmHigh: 100,
            battleCreek: 100,
            boardingAction: 132,
            complex: 200,
            sandtrap: 250,
            sidewinder: 300,
            spire: 300,
            relic: 320,
            temple: 400,
            skirmishAtDarkstar: 400,
            deathIsland: 405,
            bloodGulch: 460,
            gephyrophobia: 490,
            raidOnApex7: 500,
            battleOfNoctus: 500,
            infinity: 675,
            marchOnStormbreak: 738,
            attackOnSanctum: 820,
            forgeWorld: 1450
        };
    }

    static test () {
        const location = HaloArmy.randomLocation();
        const armySize = HaloArmy.LOCATION[location] / 4;
        const armyA = new HaloArmy('cov', armySize);
        const armyB = new HaloArmy('unsc', armySize);

        Util.log(`\nDefenders of ${Util.fromCamelCase(location)}:\n\n${armyA.pretty()} \n\nThose trying to capture it:\n\n${armyB.pretty()}`);
    }
}

module.exports = HaloArmy;

HaloArmy.init();
HaloArmy.test();
