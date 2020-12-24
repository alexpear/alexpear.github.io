'use strict';

const NodeTemplate = require('./nodeTemplate.js');
const TAG = require('../codices/tags.js');
const Util = require('../util/util.js');

const _ = require('lodash');

class ActionTemplate extends NodeTemplate {
    constructor (name, range, hit, damage, shotsPerSecond) {
        super(name);

        this.id = Util.newId();
        this.tags = [];
        this.range = range || 1;
        this.hit = hit || 0;
        this.damage = damage || 0;
        this.shotsPerSecond = shotsPerSecond || 1;
    }

    // Later make a superclass version of this func.
    deepCopy () {
        const copy = Object.assign(new ActionTemplate(), this);

        copy.tags = Util.arrayCopy(this.tags);

        return copy;
    }

    modifiedBy (modifications) {
        const combinedTemplate = new ActionTemplate();

        combinedTemplate.range = this.range + (modifications.range || 0);
        combinedTemplate.hit = this.hit + (modifications.hit || 0);
        combinedTemplate.damage = this.damage + (modifications.damage || 0);
        combinedTemplate.tags = Util.union(this.tags, modifications.tags);

        return combinedTemplate;
    }

    isAttack () {
        return this.damage > 0;
    }

    isRanged () {
        return this.range > 1;
    }

    secondsUntilNextAction () {
        if (
            ! Util.exists(this.shotsPerSecond) ||
            this.shotsPerSecond <= 1
        ) {
            return 1;
        }

        // Yes, this is approximate. It's okay for now that a rate of 0.9 is treated the same as 0.5.
        return Math.ceil(
            1 / this.shotsPerSecond
        );
    }

    progressBarSummary () {
        const lines = [
            `Name: ${this.name} (${Util.shortId(this.id)}) (${this.points()} points)`,
            `Shots: ${this.propAsProgressBar('shotsPerSecond')}`,
            `Range: ${this.propAsProgressBar('range')}`,
            `Hit:   ${this.propAsProgressBar('hit')}`,
            `Dmg:   ${this.propAsProgressBar('damage')}`
        ];

        return lines.join('\n');
    }

    propAsProgressBar (propName) {
        const BAR_MAX = 200;

        const barLength = this.propOverBenchmark(propName) * BAR_MAX;

        const displayedLength = Util.constrain(barLength, 1, BAR_MAX);

        const bar = '█'.repeat(displayedLength);

        const fixedLengthValue = this[propName].toFixed(1)
            .padStart(7, ' ');

        const output = `${fixedLengthValue} ${bar}`;

        return barLength <= BAR_MAX ?
            output :
            output + '...';
    }

    // Returning 1 would mean the prop's value is equal to the benchmark.
    propOverBenchmark (propName) {
        const MAXIMA = {
            shotsPerSecond: 5,
            range: 200,
            hit: 10,
            damage: 200
        };

        return this[propName] / MAXIMA[propName];
    }

    // Returns numerical estimate of the overall efficacy of the action.
    points () {
        const aspects = [
            this.propOverBenchmark('range'),
            this.propOverBenchmark('hit'),
            this.propOverBenchmark('shotsPerSecond'),
            this.propOverBenchmark('damage')
        ]
        .map(
            n => n * 10
        );

        return Math.ceil(
            Util.sum(aspects)
            // Multiply everything together.
            // aspects.reduce(
            //     (product, a) => product * a,
            //     1
            // )
        );
    }

    static example () {
        return ActionTemplate.gunExample();
    }

    static dwarfExample () {
        const template = new ActionTemplate('throwingAxe');

        template.range = 10;
        template.hit = 4;
        template.damage = 1;

        // Dwarven throwing axe
        template.tags = [
            TAG.Dwarf,
            TAG.Blade,
            TAG.Projectile
        ];

        return template;
    }

    static gunExample () {
        const template = new ActionTemplate('dmr');

        // Later maybe rename to a more generic phrase like 'rate'.
        // Can be less than 1:
        template.shotsPerSecond = 3;

        // Range is in meters. It is okay to round it heavily.
        template.range = 300;
        template.hit = 5;
        template.damage = 40;

        // UNSC designated mark rifle
        template.tags = [
            TAG.Bullet,
            TAG.Firearm
        ];

        return template;
    }

    // Returns a ActionTemplate with totally randomized traits.
    static random () {
        // name, range, hit, damage, shotsPerSecond
        const template = new ActionTemplate(
            'randomizedAction',
            Math.ceil(Math.random() * 100),
            Math.ceil(Math.random() * 5),
            Math.ceil(Math.random() * 100),
            _.round(Math.random() * 3, 1)
        );

        return template;
    }

    static run () {
        // Util.logDebug(`Top of ActionTemplate.run(), unique id: ${Util.newId()}.`);

        // const rando = ActionTemplate.random();
        // const summary = rando.progressBarSummary();
        // Util.log(summary);
    }
};

module.exports = ActionTemplate;

ActionTemplate.run();
