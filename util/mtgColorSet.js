'use strict';

const MtgColor = require('./mtgColor.js');
const Util = require('./util.js');

class MtgColorSet {
    constructor (abbrvs) {
        if (! abbrvs) {
            this.colors = MtgColor.randomSet(
                Util.randomUpTo(5)
            );

            return;
        }

        this.colors = [];
        this.initFromAbbrvs(abbrvs);
    }

    initFromAbbrvs (abbrvs) {
        if (Util.isArray(abbrvs)) {
            abbrvs = MtgColorSet.abbreviate(abbrvs);
        }

        abbrvs = abbrvs.toUpperCase();

        // Later could use regex to check for invalid input.
        
        if (abbrvs === 'C') {
            // Empty set (colorless mana)
            return;
        }

        for (let char of abbrvs) {
            this.colors.push(
                MtgColor[char]
            );
        }
    }

    equals (other) {
        if (this.colors.length !== other.colors.length) {
            return false;
        }

        for (let i = 0; i < this.colors.length; i++) {
            if (this.colors[i] !== other.colors[i]) {
                return false;
            }
        }

        return true;
    }

    toString () {
        if (this.colors.length === 0) {
            return 'C';
        }

        return this.colors.map(
            c => MtgColor.ABBRVS[c]
        )
        .join('');
    }

    static abbreviate (array) {
        return array.map(
            s => MtgColor.ABBRVS[s]
        )
        .join('');
    }

    static toPrettyString (array) {
        return array.map(s => Util.capitalized(s))
            .join(' / ');
    }

    opinionOf (other) {
        if (other.colors.length === 0) {
            return 0;
        }

        let sum = 0;

        // Repeat other.colors until it is length 60 (LCD of 1 thru 5). This way W likes W (aka WWWWWWWWWWWW...) more than GWU.
        const repetitions = 60 / other.colors.length;
        let representatives = [];

        for (let i = 0; i < repetitions; i++) {
            representatives = representatives.concat(other.colors);
        }

        for (let ourColor of this.colors) {
            for (let theirColor of representatives) {
                sum += MtgColor.opinionOf(ourColor, theirColor);
            }
        }

        return sum;
    }

    static testOpinions () {
        const allSets = MtgColorSet.allSets();

        let output = '';

        for (let us of allSets) {
            const relationships = [];

            for (let them of allSets) {
                const opinion = us.opinionOf(them);
                const reciprocal = them.opinionOf(us);

                if (opinion !== reciprocal) {
                    // throw new Error(`${opinion} different from ${reciprocal} when ${us} looks at ${them}`);
                }

                const relationship = {
                    a: us.toString(),
                    b: them.toString(),
                    opinion
                };


                relationships.push(relationship);
            }

            relationships.sort(
                (x, y) => y.opinion - x.opinion
            );

            output += relationships.map(
                r => `\n${r.a} opinion of ${r.b}: ${r.opinion}`
            )
            .join('') + '\n';
        }

        Util.log(output);
        return output;
    }

    static random (size) {
        const set = new MtgColorSet();

        size = Util.exists(size) || Util.randomUpTo(5);
        set.colors = MtgColor.randomSet(size);
    }

    // Later might just move these into MtgColor class. We've been indecisive about instantiating MtgColorSet objects or just operating statically upon arrays.
    static simpleOpinionOf (aArray, bArray) {
        // Later can distinguish between ally & enemy colors.
        return MtgColorSet.overlap(aArray, bArray).length - 1;
    }

    static overlap (aArray, bArray) {
        const overlap = [];

        for (let ours of aArray) {
            if (Util.contains(bArray, ours)) {
                overlap.push(ours);
            }
        }

        return overlap;
    }

    static allSets () {
        let all = [];

        for (let n = 0; n <= 5; n++) {
            all = all.concat(MtgColorSet.allSetsOfN(n));
        }

        return all;
    }

    static allSetsOfN (size) {
        if (size === 0) {
            return [new MtgColorSet('c')];
        }

        const abbrvs = {
            w: true,
            g: true,
            r: true,
            b: true,
            u: true
        };

        for (let k = 1; k < size; k++) {
            const partials = Object.keys(abbrvs);

            for (let key of partials) {
                delete abbrvs[key];

                for (let color of 'wgrbu'.split('')) {
                    if (Util.contains(key, color)) {
                        continue;
                    }

                    const newKey = (key + color)
                        .split('')
                        .sort()
                        .join('');

                    abbrvs[newKey] = true;
                }
            }
        }

        return Object.keys(abbrvs)
            .map(
                abbrv => new MtgColorSet(abbrv)
            );
    }

    static colorIcon (name) {
        const colorMap = {
            white: 'brightWhite',
            green: 'brightGreen',
            red: 'brightRed',
            black: 'black',
            blue: 'brightBlue',
        };

        return Util.customColored('*', 'brightGrey', colorMap[name]);
    }

    static icons (array) {
        return array.map(
            name => MtgColorSet.colorIcon(name)
        )
        .join('');
    }

    static sketchColorIcons () {
        const symbol = '*';

        const viaBackgrounds =
            Util.customColored(symbol, 'brightGrey', 'brightWhite') +
            Util.customColored(symbol, 'brightGrey', 'brightGreen') +
            Util.customColored(symbol, 'brightGrey', 'brightRed') +
            Util.customColored(symbol, 'brightGrey', 'black') +
            Util.customColored(symbol, 'brightGrey', 'brightBlue');

        const viaForegrounds =
            Util.customColored('O', 'brightWhite', 'brightGrey') +
            Util.customColored('O', 'green', 'brightGrey') +
            Util.customColored('O', 'red',   'brightGrey') +
            Util.customColored('O', 'black', 'brightGrey') +
            Util.customColored('O', 'blue',  'brightGrey');

        Util.log(viaForegrounds);
        Util.log(viaBackgrounds);
    }

    static testAllSets () {
        for (let i = 0; i <= 5; i++) {
            Util.log(`sets of size ${i}`);
            const sets = MtgColorSet.allSetsOfN(i);
            const output = sets.map(
                s => s.toString()
            )
            .join('\n');

            Util.log(output);
        }
    }
};

module.exports = MtgColorSet;

// MtgColorSet.sketchColorIcons();
