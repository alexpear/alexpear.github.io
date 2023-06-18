'use strict';

const TextGen = require('./textGen.js');
const Util = require('../../util/util.js');

// In the Terra Ignota novels, the Humanistas hive legislature is controlled by representatives who each have voting power proprotional to the number of votes they received from the populace in the last election.

class Humanistas extends TextGen {
    constructor () {
        super();

        // type number[]
        this.representatives = [];

        this.init4();

        this.representatives.sort(
            (a, b) => b - a
        );
    }

    // Legacy alg. Works alright but rarely produces 30+ members.
    init () {
        while (this.totalVotes() < Humanistas.POPULATION) {
            this.addRep();
        }

        this.finalize();
    }

    init2 () {
        while (this.totalVotes() < Humanistas.POPULATION) {
            this.addRep2();
        }

        this.representatives = this.representatives.filter(
            rep => rep >= Humanistas.POPULATION / 100 
        );
    }

    // Algorithm 3
    init3 () {
        const topTierProportion = Math.random();
        // const topTierHeadcount = 

    }

    // Algorithm 4
    init4 () {
        const seats = Math.ceil( 
            400 * Math.pow( Math.random(), 2) 
        );

        const weights = [];
        for (let i = 0; i < seats; i++) {
            weights.push(
                1 / Math.random()
            );
        }

        // Normalize
        const weightSum = Util.sum(weights);
        for (let i = 0; i < seats; i++) {
            this.representatives.push(
                weights[i] / weightSum * Humanistas.POPULATION
            );
        }

        // Util.logDebug({
        //     reps: this.representatives,
        //     weightSum,
        //     weights,
        // });
    }

    totalVotes () {
        return Util.sum(this.representatives);
    }

    addRep () {
        const max = Humanistas.mostVotesTheyCouldGet();
        const votes = Math.ceil(Math.random() * max);

        this.representatives.push(votes);
    }

    // Algorithm 2 - always produces around 9 members, low variety
    addRep2 () {
        const votesLeft = Humanistas.POPULATION - this.totalVotes();

        const options = [];
        for (let i = 0; i < 4; i++) {
            const votes = Math.max(
                Math.ceil(Math.random() * votesLeft),
                1000
            );

            options.push(votes);
        }

        this.representatives.push(
            Math.min(...options)
        );
    }

    finalize () {
        this.representatives.sort(
            (a, b) => a - b
        );
        this.representatives.reverse();

        let sum = 0;
        for (let i = 0; i < this.representatives.length; i++) {
            sum += this.representatives[i];

            if (sum >= Humanistas.POPULATION) {
                // Exclude any less-popular representatives from the parliament.
                this.representatives = this.representatives.slice(0, i + 1);
                break;
            }
        }
    }

    summary () {
        const lines = this.representatives.map(
            rep => {
                const name = 'Representative';
                const votes = Util.abbrvNumber(rep);
                const percent = rep / this.totalVotes() * 100;
                const nicePercent = percent.toFixed(0);

                return `${name} with ${votes} votes (${nicePercent}%)`;
            }
        );

        const bodyText = lines.join('\n');

        return `The current Humanist Parliament consists of ${this.representatives.length} representatives:\n${bodyText}`;        
    }

    debugSummary () {
        for (let i = 0; i < this.representatives.length; i++) {
            console.log(this.representatives[i]);
        }

        Util.logDebug(`End of debugSummary() call.`)
    }

    static mostVotesTheyCouldGet () {
        const maxExponent = Math.log10(Humanistas.POPULATION);
        const minExponent = 3;

        const exponent = Math.random() * (maxExponent - minExponent) + minExponent;

        return Math.ceil(Math.pow(10, exponent));
    }

    static testMostVotesTheyCouldGet () {
        for (let n = 0; n < 100; n++) {
            Util.logDebug(Util.abbrvNumber(
                Humanistas.mostVotesTheyCouldGet()
            ));
        }
    }

    static funcTest () {
        const outputs = [];

        for (let i = 0; i < 10000; i++) {
            outputs.push(
                Math.ceil( 400 * Math.pow( Math.random(), 10) )
            );
        }

        //                 Math.ceil( 1000 * Math.pow( Math.random(), 2) ) has mean 333
                        // Math.ceil( 1000 * Math.pow( Math.random(), 3) ) has mean 250
                        // Math.ceil( 1000 * Math.pow( Math.random(), 4) ) has mean 200
                        // Math.ceil( 400 * Math.pow( Math.random(), 10) ) has mean 36

        const mean = outputs.reduce(
            (sumSoFar, output) => sumSoFar + output,
            0
        ) / outputs.length;

        console.log(mean);
    }

    output () {
        return new Humanistas().summary();
    }

    static test () {
        // Util.log(Humanistas.testMostVotesTheyCouldGet());

        Humanistas.funcTest();

        const gov = new Humanistas();

        Util.log(gov.summary());
    }
}

Humanistas.POPULATION = 1e9;

module.exports = Humanistas;

Humanistas.test();
