'use strict';

const Util = require('../util/util.js');

// This object represents a set of personality, attitude, or general traits.
// Each trait is its own axis, with value -1, 1, or neither.
// This is inspired by the D&D alignment chart, but has arbitrary axes.
class TraitGrid {
    constructor (adjectiveString) {
        if (! adjectiveString) {
            return this;  // Blank case
        }

        adjectiveString = TraitGrid.recognizeAbbreviation(adjectiveString);

        this.initTo(adjectiveString);
    }

    static recognizeAbbreviation (input) {
        const ABBRVS = {
            LG: 'lawful good',
            LN: 'lawful',
            LE: 'lawful evil',
            NG: 'good',
            NN: '',
            NE: 'evil',
            CG: 'chaotic good',
            CN: 'chaotic',
            CE: 'chaotic evil'
        };
        // LATER also make this able to detect other abbreviations like CR for Chaotic Radiant, if useful.

        const meaning = ABBRVS[input];

        return meaning === undefined ?
            input :
            meaning;
    }

    initTo (adjectiveString) {
        const adjectives = adjectiveString.toLowerCase().split('\s');

        adjectives.forEach(adj => {
            const info = TraitGrid.adjectiveToAxis[adj];

            this[info.axis] = info.value;
        });
    }

    toString() {
        return TraitGrid.AXES.map(
            axisWords => this.formatTrait(Util.toCamelCase(axisWords))
        )
        .filter(
            t => !!t
        )
        .join(' ');
    }

    formatTrait (axisName) {
        const propValue = this[axisName];

        const adjective = TraitGrid.axisToAdjective[axisName][propValue] || '';

        // if (adjective) {
        //     Util.logDebug(`In formatTrait(), for ${axisName}, which has value ${propValue}. Going to return: ${adjective}`);
        // }

        return adjective;
    }

    static random (axisCount) {
        // LATER: Only consider a random n axes, controled by axisCount param.
        const outputs = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        const grid = new TraitGrid();

        Object.keys(TraitGrid.axisToAdjective).forEach(axis => {
            const value = TraitGrid.randomValue(
                TraitGrid.axisToAdjective[axis].extremeness
            );

            // Util.logDebug(`value is ${value}, axis is ${axis}`);

            if (value) {
                grid[axis] = value;
            }
        });

        // Util.logDebug(`bottom of random(), about to return the following obj: ${JSON.stringify(grid)}`);

        return grid;
    }

    static randomValue (extremeness) {
        // Later: could support a no-param usage of this func if desired. Currently skipping that for a tiny performance bump.
        const isExtreme = Math.random() < extremeness;

        return isExtreme ?
            Util.randomOf([-1, 1]) :
            0;
    }

    static initStaticProps () {
        // To temporarily disable a axis, just comment it out here.
        TraitGrid.AXES = [
            'plain attractive',
            'short tall',
            'young elder 0.5',
            'keen passionate',
            'lawful chaotic',
            // 'evil good',
            // 'chthonic sidereal',
            // 'dark radiant',
            // 'cool warm',
            'standoffish amiable',
            'steady energetic',
            'introverted extroverted',
            'married single',
            'timid brave',
            // 'downbeat upbeat',
            'cynical optimistic',
            'male female 0.8',
            // 'masculine effeminate',
            'reformist loyal',
            'lowborn highborn',
        ];

        // Glossary used in translating storage format (-1/1) to a adjective string
        TraitGrid.axisToAdjective = {};

        // Glossary used during calls to constructor, eg new TraitGrid('lawful radiant')
        TraitGrid.adjectiveToAxis = {};

        TraitGrid.AXES.forEach(axisWords => {
            const poles = axisWords.trim().split(/\s/);
            const axisCamel = Util.toCamelCase(axisWords);

            if (axisCamel.length + poles.length - 1 !== axisWords.length ||
                axisCamel.indexOf(' ') >= 0) {
                throw new Error(`${axisWords} -> ${axisCamel}`);
            }

            TraitGrid.axisToAdjective[axisCamel] = {
                '-1': poles[0],
                '1': poles[1],
                extremeness: poles[3] || TraitGrid.DEFAULT_EXTREMENESS
            };

            TraitGrid.adjectiveToAxis[poles[0]] = {
                axis: axisCamel,
                value: -1
            };

            TraitGrid.adjectiveToAxis[poles[1]] = {
                axis: axisCamel,
                value: 1
            };
        });
    }

    static test () {
        console.log(`TraitGrid test starting.`);

        // Util.logDebug(`TraitGrid.axisToAdjective is ${JSON.stringify(TraitGrid.axisToAdjective, undefined, '    ')}`);
        // Util.logDebug(`TraitGrid.adjectiveToAxis is ${JSON.stringify(TraitGrid.adjectiveToAxis, undefined, '    ')}`);

        for (let i = 0; i < 36; i++) {
            const grid = TraitGrid.random();

            // console.log(JSON.stringify(grid));
            console.log(grid.toString() + ' human officer');
            // console.log();
        }

        console.log(`TraitGrid test complete.`);
    }
}

TraitGrid.DEFAULT_EXTREMENESS = 0.2;

module.exports = TraitGrid;

TraitGrid.initStaticProps();
// TraitGrid.test();
