'use strict';

const _ = require('lodash');
const commaNumber = require('comma-number');
const moment = require('moment');

// TODO: import Util funcs from util.js in the warband repo
class Util {
    static colored (str, colorName) {
        return (Util.COLORS[colorName] || Util.COLORS.purple) +
            str +
            Util.COLORS.balance;
    }

    static customColored (str, foreground, background) {
        const FMAP = {
            black: 30,
            red: 31,
            green: 32,
            yellow: 33,
            blue: 34,
            magenta: 35,
            cyan: 36,
            white: 37,
            brightGrey: 90,
            brightRed: 91,
            brightGreen: 92,
            brightYellow: 93,
            brightBlue: 94,
            brightMagenta: 95,
            brightCyan: 96,
            brightWhite: 97,
        };

        const BMAP = {
            black: 40,
            red: 41,
            green: 42,
            yellow: 44,
            blue: 44,
            magenta: 45,
            cyan: 46,
            white: 47,
            brightGrey: 100,
            brightRed: 101,
            brightGreen: 102,
            brightYellow: 103,
            brightBlue: 104,
            brightMagenta: 105,
            brightCyan: 106,
            brightWhite: 107,
        };

        const fcode = FMAP[foreground] || FMAP.blue;
        const bcode = BMAP[background] || BMAP.grey;

        return '\x1b[1;' + fcode + ';' + bcode + 'm' + str + '\x1b[0m';
    }

    static randomPastel () {
        const min = 0x70;

        let hexCode = '#';

        for (let i = 0; i < 3; i++) {
            const decimal = Util.randomIntBetween(min, 0x100);
            hexCode += decimal.toString(16);
        }

        return hexCode;
    }

    static colorDiff (hex1, hex2) {
        // later standardize inputs to strings
        let diff = 0;

        for (let i = 0; i < 6; i += 2) {
            const str1 = hex1.slice(i, i + 2);
            const color1 = Util.hexStringToNumber(str1); // later implement func https://stackoverflow.com/questions/52261494/hex-to-string-string-to-hex-conversion-in-nodejs

            const str2 = hex2.slice(i, i + 2);
            const color2 = Util.hexStringToNumber(str2);

            diff += Math.abs(color1 - color2);
        }

        // Max value is 256 * 3 = 768
        return diff;
    }

    static exists (x) {
        return x !== undefined &&
            x !== null &&
            x !== '' &&
            ! Util.isNaN(x);
    }

    static legit (x) {
        return Util.exists(x) &&
            // it's not []
            ! (Util.isArray(x) && x.length === 0) &&
            // it's not {}
            ! (typeof x === 'object' && Object.keys(x).length === 0);
    }

    // Logs information about unknown values.
    static analyze (mysterious) {
        Util.logDebug(
            Util.analyzeHelper(mysterious)
        );
    }

    static analyzeHelper (mysterious) {
        const summary = { typeof: typeof mysterious };

        if (Util.isPrimitive(mysterious)) {
            summary.value = mysterious;
            summary.analysis = `Stopped because this value is primitive.`;
            return summary;
        }

        // BTW: This conditional is probably redundant after the conditional above.
        if (! Util.exists(mysterious)) {
            summary.analysis = `Stopped because this value does not exist.`;
            return summary;
        }

        summary.length = mysterious?.length;

        if (summary.length > 99) {
            summary.analysis = `Stopped because .length is very long. Recursing into [0] only.`;
            summary.fieldZero = Util.analyzeHelper(mysterious[0]);
            return summary;
        }

        summary.propsArray = Object.getOwnPropertyNames(mysterious);

        summary.propsOfProps = {};

        summary.propsArray.map(
            // prop => summary.propsOfProps[prop] = Object.getOwnPropertyNames(mysterious[prop])
            prop => summary.propsOfProps[prop] = Util.analyzeHelper(mysterious[prop])
        );

        return summary;
    }

    static default (input, defaultValue) {
        if (input === undefined) {
            return defaultValue;
        } else {
            return input;
        }
    }

    // Safely dig deep into a nested obj.
    // Example: Util.access(pageObj, 'revision.text.$text');
    static access (obj, dotSeparatedFields) {
        if (dotSeparatedFields[0] === '.') {
            dotSeparatedFields = dotSeparatedFields.slice(1);
        }

        const fieldNames = dotSeparatedFields.split('.');

        for (let name of fieldNames) {
            if (! obj) {
                return undefined;
            }

            obj = obj[name];
        }

        return obj;
    }

    static contains (array, fugitive) {
        return array.includes(fugitive);
    }

    static hasOverlap (arrayA, arrayB) {
        if (! arrayA || ! arrayB) {
            return false;
        }

        for (let i = 0; i < arrayA.length; i++) {
            if (Util.contains(arrayB, arrayA[i])) {
                return true;
            }
        }

        return false;
    }

    static flatten (arrayOfArrays) {
        let flat = arrayOfArrays[0];

        for (let i = 1; i < arrayOfArrays.length; i++) {
            flat = flat.concat(arrayOfArrays[i]);
        }

        return flat;
    }

    // Returns number
    // Default 0
    static sum (array) {
        return Util.array(array).reduce(
            (sumSoFar, element) => {
                const n = Number(element) || 0;
                return sumSoFar + n;
            },
            0
        );
    }

    // Average
    // LATER could support multiple param usage: Util.mean(3, 5, 7)
    static mean (array) {
        array = Util.array(array);
        if (array.length === 0) { return 0; }

        const sum = Util.sum(array);
        return sum / array.length;
    }

    // More robust variant of Math.min()
    static min (...args) {
        if (args.length === 1 && Util.isArray(args[0])) {
            return Math.min(...args[0]);
        }

        return Math.min(...args);
    }

    // More robust variant of Math.max()
    static max (...args) {
        if (args.length === 1 && Util.isArray(args[0])) {
            return Math.max(...args[0]);
        }

        return Math.max(...args);
    }

    static commonest (array) {
        const dict = {};

        for (let value of array) {
            if (dict[value]) {
                dict[value] += 1;
            }
            else {
                dict[value] = 1;
            }
        }

        let mostAppearances = 0;
        let winner;

        for (let value in dict) {
            if (dict[value] > mostAppearances) {
                mostAppearances = dict[value];
                winner = value;
            }
        }

        return winner;
    }

    static median (array) {
        array = Util.array(array);
        if (array.length === 0) { return 0; }
        array = Util.arrayCopy(array);
        array.sort();

        const midpoint = Math.floor(array.length / 2);

        if (array.length % 2 === 0) {
            return Util.mean([
                array[midpoint],
                array[midpoint + 1],
            ]);
        }
        else {
            return array[midpoint];
        }
    }

    // Modifies the array.
    static shuffle (array) {
        for (let i = 0; i <= array.length - 2; i++) {
            const untouchedCount = array.length - 1 - i;

            const swapWith = i + Math.ceil(Math.random() * untouchedCount);

            const temp = array[i];
            array[i] = array[swapWith];
            array[swapWith] = temp;
        }

        return array;
    }

    static testShuffle () {
        for (let repeat = 0; repeat <= 999; repeat++) {
            const len = Math.floor(Math.random() * 100);

            const array = [...Array(len)]
                .map(
                    x => Math.random()
                );

            const backup = Array.from(array);

            const shuffled = Util.shuffle(array);

            let good = true;

            if (backup.length !== shuffled.length) {
                good = false;
            }

            let identical = true;

            for (let i = 0; i < shuffled.length; i++) {
                if (backup[i] !== shuffled[i]) {
                    identical = false;
                    break;
                }
            }

            if (identical && backup.length >= 3) {
                good = false;
            }

            if (! good) {
                Util.error({
                    repeat,
                    array,
                    backup,
                    shuffled,
                    identical,
                    len,
                    arrayLength: array.length,
                    backupLength: backup.length,
                    shuffledLength: shuffled.length,
                });
            }
        }
    }

    static constrain (n, minInclusive, maxInclusive) {
        if (n <= minInclusive) {
            return minInclusive;
        }
        if (n >= maxInclusive) {
            return maxInclusive;
        }

        return n;
    }

    // Less permissive than constrain()
    static constrainOrError (n, min = 0, max = 1, leeway = 0.01) {
        if (n >= min && n <= max) {
            return n;
        }

        if (n >= min - leeway && n < min) {
            return min;
        }

        if (n <= max + leeway) {
            return max;
        }

        Util.error({
            n,
            min,
            max,
            leeway,
            message: `Util.constrainOrError() - n is too far out of bounds`,
        });
    }

    static randomIntBetween (minInclusive, maxExclusive) {
        if (! Util.exists(minInclusive) || ! Util.exists(maxExclusive)) {
            console.log('error: Util.randomIntBetween() called with missing parameters.');
            throw new Error(`max ${maxExclusive}, min ${minInclusive}`);
        }
        else if (maxExclusive <= minInclusive) {
            console.log('error: Util.randomIntBetween() called with max <= min.');
            throw new Error(`max ${maxExclusive}, min ${minInclusive}`);
        }

        return Math.floor( Math.random() * (maxExclusive - minInclusive) + minInclusive );
    }

    // Returns value in range [0, input]
    static randomUpTo (maxInclusive) {
        return maxInclusive >= 0 ?
            Util.randomIntBetween(0, maxInclusive + 1) :
            maxInclusive;
    }

    static randomBelow (maxExclusive) {
        return Math.floor(Math.random() * maxExclusive);
    }

    static randomOf (array) {
        return array[
            Util.randomBelow(array.length)
        ];
    }

    static randomFromObj (obj) {
        const key = Util.randomOf(Object.keys(obj));
        return obj[key];
    }

    // Param: obj, whose values are also objects.
    // Side effect: writes to .name prop of child objs.
    static randomWithName (obj) {
        const name = _.sample(Object.keys(obj));

        const entry = obj[name];
        entry.name = name;
        return entry;
    }

    // decimalPlaces param is optional and lodash defaults it to 0.
    static randomRange (minInclusive, maxExclusive, decimalPlaces) {
        if (maxExclusive < minInclusive) {
            const temp = minInclusive;
            minInclusive = maxExclusive;
            maxExclusive = temp;
        }

        const unrounded = (Math.random() * (maxExclusive - minInclusive))
            + minInclusive;

        // TODO Bug? If random() gives 0.99, can it round up to maxExclusive?

        return _.round(unrounded, decimalPlaces);
    }

    // Often we want to fill a bag with tokens of different kinds and draw one.
    // More likely outcomes get more tokens and are thus more likely to happen.
    // But all outcomes are possible.
    // Example bag describing St George at a disadvantage:
    // {
    //     stGeorge: 7,
    //     dragon: 12
    // }
    static randomBagDraw (bag) {
        const total = Util.sum(
            Object.values(bag)
        );

        let drawn = Math.random() * total;

        let name;
        for (name in bag) {
            drawn -= bag[name];

            if (drawn < 0) {
                return name;
            }
        }

        return name;
    }

    static randomLetter () {
        return Util.randomOf(`ABCDEFGHIJKLMNOPQRSTUVWXYZ`);
    }

    static roll2d6 () {
        return Util.roll1d6() + Util.roll1d6();
    }

    static roll1d6 () {
        return Util.rollDie(6);
    }

    static rollDie (sides) {
        return Math.ceil(Math.random() * sides);
    }

    // x dice with y sides each
    static rollXdY (x, y) {
        let total = 0;

        for (let i = 0; i < x; i++) {
            total += Util.rollDie(y);
        }

        return total;
    }

    static testRoll1d6 () {
        const results = [];

        for (let i = 0; i < 5000; i++) {
            results.push(
                Util.roll1d6()
            );
        }

        console.log();

        Util.logDebug(
            Util.arraySummary(results)
        );
    }

    // seed: nonnegative integer
    static simpleHash (seed) {
        // seed + 1 because 0 => 0 would be too regular.
        const divided = (seed + 1) / Math.PI;
        return divided - Math.floor(divided);
    }

    // Returns string
    static newId (idLength) {
        // Later research the most performant way to run this.
        // Later could remove similar characters like 1i0O, maybe 5S
        const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let id = '';
        for (let i = 0; i < (idLength || 50); i++) {
            const index = Math.floor(
                Math.random() * ALPHABET.length
            );
            id += ALPHABET[index];
        }

        return id;
    }

    // Similar to newId()
    static uuid () {
        return crypto.randomUUID();
    }

    // Returns string
    static shortId (id) {
        return id ?
            `${id.slice(0, 3).toUpperCase()}` :
            '';
    }

    // Input 2d array of strings or stringables
    // Output string formatted like a spreadsheet, suitable for printing
    static toChartString (grid) {
        let maxLengths = new Array(grid[0].length).fill(1);

        for (let r = 0; r < grid.length; r++) {

            for (let c = 0; c < grid[4].length; c++) {
                const len = String(grid[r][c]).length;

                if (maxLengths[c] < len) {
                    maxLengths[c] = len;
                }
            }
        }

        return grid.map(
            row => row.map(
                (cell, c) => String(cell).padEnd(maxLengths[c])
            )
            .join(' ')
        )
        .join('\n');
    }

    // grid is of type string[][]
    static textGrid (grid, width, height) {
        // These currently need to be set to the dimensions shown in the top of the terminal window.
        Util.SCREEN_WIDTH = width || 181;
        Util.SCREEN_HEIGHT = height || 46;

        const colCount = grid[0].length;
        const rightExcess = (Util.SCREEN_WIDTH - 1) % colCount;

        const HORIZ_WALL = '-'.repeat(Util.SCREEN_WIDTH - rightExcess);
        let lines = [HORIZ_WALL];

        for (let r = 0; r < grid.length; r++) {
            const lineSets = [];

            for (let c = 0; c < grid[0].length; c++) {
                lineSets.push(
                    Util.boxAsLines(grid, r, c)
                );

                // Util.logDebug(`Util.textGrid(), lineSets is ${Util.stringify(lineSets)}`);
            }

            const rowLines = Util.stitchBoxRow(lineSets);
            rowLines.push(HORIZ_WALL);

            lines = lines.concat(rowLines);
        }

        return lines.join('\n');
    }

    static boxAsLines (grid, row, column) {
        const boxHeight = Math.floor(
            (Util.SCREEN_HEIGHT - grid.length - 1) / grid.length
        );

        const topRow = grid[0];

        const boxWidth = Math.floor(
            (Util.SCREEN_WIDTH - topRow.length - 1) / topRow.length
        );

        const boxLines = grid[row][column].split('\n');
        const outLines = [];

        // Util.logDebug('lines[0].length is ' + lines[0].length + ', and boxWidth is ' + boxWidth);

        for (let i = 0; i < boxHeight - 1; i++) {
            outLines.push(
                Util.padSides(boxLines[i], boxWidth)
            );
        }

        if (boxLines[boxHeight - 1]) {
            outLines.push(
                Util.padSides('...', boxWidth)
            );
        }

        // Util.logDebug(`Util.boxAsLines(), current box contains: ${grid[row][column]}. boxLines is ${JSON.stringify(boxLines, undefined, '    ')},\n  outLines is ${JSON.stringify(outLines, undefined, '    ')}`)

        return outLines;
    }

    static stitchBoxRow (lineSets) {
        const WALL = '|';
        const lines = [];

        for (let r = 0; r < lineSets[0].length; r++) {
            let line = WALL;

            for (let i = 0; i < lineSets.length; i++) {
                line += lineSets[i][r] + WALL;

                // Util.logDebug(`Util.stitchBoxRow(), lineSets[i][r] is ${lineSets[i][r]}`)
            }

            lines.push(line);
        }

        return lines;
    }

    // Input string[]
    // Returns string summarizing redundancies, like a histogram.
    static arraySummary (a) {
        const dict = {};

        a.forEach(
            s => {
                if (dict[s]) {
                    dict[s]++;
                }
                else {
                    dict[s] = 1;
                }
            }
        );

        const archetypes = Object.keys(dict)
            .map(
                s => `${s} x${Util.abbrvNumber(dict[s])}`
            );

        return archetypes.join(', ');
    }

    static repeat (str, n) {
        let outStr = '';
        for (let i = 0; i < n; i++) {
            outStr += str;
        }

        return outStr;
    }

    static formatProp (object, propName) {
        const value = object[propName];
        if (! Util.legit(value)) {
            return '';
        }

        // Later handle special and modification objects better.
        return `${ propName }: ${ Util.formatExpression(value) }`;
    }

    static formatExpression (input) {
        const type = typeof input;
        if (Util.isArray(input)) {
            return input.map(
                x => Util.formatExpression(x)
            )
            .join(', ');
        }
        if (type === 'object') {
            return Util.formatObj(input);
        }

        return input;
    }

    static formatObj (obj) {
        // if (typeof obj !== 'object') {
        //     return obj;
        // }

        const pairs = Object.keys(obj)
            .map(
                key => `${key}: ${obj[key]}`
            )
            .join(', ');
        return `{${pairs}}`;
    }

    static containsVowels (s) {
        const chars = s.toUpperCase()
            .split('');

        for (let char of chars) {
            if (Util.contains('AEIOUY', char)) {
                return true;
            }
        }

        return false;
    }

    static capitalized (s) {
        if (! Util.exists(s)) {
            return '';
        }
        else if (s.length === 1) {
            return s.toUpperCase();
        }
        // Controversially, interpret no-vowel strings as acronyms
        else if (! Util.containsVowels(s)) {
            return s.toUpperCase();
        }

        return s[0].toUpperCase() +
            s.slice(1);
            // s.slice(1).toLowerCase();
    }

    static uncapitalized (s) {
        if (! Util.exists(s)) {
            return '';
        }
        else if (s.length === 1) {
            return s.toLowerCase();
        }

        return s[0].toLowerCase() +
            s.slice(1);
    }

    static capitalizedAllWords (s) {
        if (! Util.exists(s)) {
            return '';
        }

        const words = s.split(' ');

        return words.map(
            w => Util.capitalized(w)
        ).join(' ');
    }

    static toCamelCase (s) {
        if (! Util.exists(s)) {
            return '';
        }

        const words = s.split(/\s/);
        const tail = words.slice(1)
            .map(sub => Util.capitalized(sub))
            .join('');

        return words[0].toLowerCase() +
            tail;
    }

    // input: 'dolphinWithWings'
    // returns: 'Dolphin With Wings'
    static fromCamelCase (s) {
        if (! Util.exists(s)) {
            return '';
        }
        else if (s.length === 1) {
            return s.toUpperCase();
        }

        const wordStarts = [0];
        const words = [];

        for (let i = 1; i < s.length; i++) {
            // Util.logDebug(`fromCamelCase(), s is ${s}, i is ${i}, s[i] is ${s[i]}`)

            if (Util.isCapitalized(s[i])) {
                if (Util.isCapitalized(s[i-1])) {
                    // Detect acronym words and leave them uppercase.
                    // eg: openHTMLFile
                    const followedByLowercase = (i < s.length - 1) &&
                        ! Util.isCapitalized(s[i+1]);
                    if (! followedByLowercase) {
                        continue;
                    }
                }

                wordStarts.push(i);

                const firstLetter = wordStarts[wordStarts.length - 2];
                const word = s.slice(firstLetter, i);
                words.push(word);
            }

            // Also want to consider a digit after a nondigit, or vice versa, to be a word start.
            else if (Util.alphanumericTransition(s, i)) {
                wordStarts.push(i);

                const firstLetter = wordStarts[wordStarts.length - 2];
                const word = s.slice(firstLetter, i);
                words.push(word);
            }
        }

        const lastCapital = wordStarts[wordStarts.length - 1];
        const lastWord = s.slice(lastCapital);
        words.push(lastWord);

        return words.map(
            // Do not change acronyms
            w => Util.isAllCaps(w) ?
                w :
                Util.capitalized(w)
        )
        .join(' ');
    }

    // center-aligns string in spaces, to a specified total length.
    // ('foo', 7) => '  foo  '
    static padSides (string, length) {
        // Later could detect if 'string' is a nonstring and convert it.
        string = string || '';
        length = Math.floor(length);

        const leftover = length - string.length;

        if (leftover <= 0) {
            return string.slice(0, length);
        }

        const padAmount = leftover / 2;
        const left = ' '.repeat(
            Math.floor(padAmount)
        );

        const right = ' '.repeat(
            Math.ceil(padAmount)
        );

        // return left + string + right;
        return (left + string).padEnd(length);
    }

    static testPadSides () {
        for (let l = 1; l < 10; l++) {

            for (let sl = 0; sl < 3; sl++) {
                const input = ' 👁 e'.repeat(sl);
                const output = Util.padSides(input, l);

                const summary = `padSides(${input}, ${l}) => \n'${output}'`;
                console.log(summary);

                if (output.length !== l) {
                    throw new Error(summary);
                }
            }
        }
    }

    static alphanumericTransition (string, i2) {
        const digitStart = Util.isNumeric(
            string[i2 - 1]
        );

        const digitEnd = Util.isNumeric(
            string[i2]
        );

        return digitStart && ! digitEnd ||
            ! digitStart && digitEnd;
    }

    static testCamelCase () {
        const tests = [
            ['Hector Breaker Of Horses', 'hectorBreakerOfHorses'],
            ['Cellar Door', 'cellarDoor'],
            ['C Deck', 'cDeck'],
            ['Awakening', 'awakening']
        ];

        tests.forEach(t => {
            const camelized = Util.toCamelCase(t[0]);
            const uncamelized = Util.fromCamelCase(t[1]);

            if (camelized !== t[1]) {
                throw new Error(camelized);
            }
            if (uncamelized !== t[0]) {
                throw new Error(uncamelized);
            }
        });
    }

    // Returns true if we are executing this in a browser.
    static inBrowser () {
        return typeof window !== 'undefined' &&
            typeof window.document !== 'undefined';
    }

    // Returns string with '<'s in it.
    static htmlPassage (content) {
        return Util.asElement(content, 'p');
    }

    // Returns string with '<'s in it.
    static asElement (content, elementName) {
        // TODO make content HTML-friendly, escape etc.
        return `<${elementName}>${content}</${elementName}>`;
    }

    static htmlElement (tag, attributes, text) {
        const el = document.createElement(tag);

        if (Util.isString(attributes)) {
            el.setAttribute('class', attributes);
        }
        else if (attributes) {
            // Interpret as an options dict.
            for (let key in attributes) {
                el.setAttribute(key, attributes[key]);
            }
        }

        if (text) {
            el.innerHTML = text;
        }

        return el;
    }

    static pElement (text, className) {
        const p = document.createElement('p');

        p.innerHTML = text;

        if (className) {
            p.setAttribute('class', className);
        }

        return p;
    }

    static button (text, className, func) {
        const b = document.createElement('button');

        b.innerHTML = text;

        if (className) {
            b.setAttribute('class', className);
        }

        b.onclick = func;

        return b;
    }

    static clearHtmlChildren (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // True when input is a number or a string containing digits.
    static isNumeric (x) {
        return /[0-9]/.test(x);
    }

    // Note that typeof NaN is also 'number',
    // but it is still despicable.
    static isNumber (x) {
        return typeof x === 'number' &&
            ! Util.isNaN(x);
    }

    static isString (x) {
        return typeof x === 'string';
    }

    static isNaN (x) {
        return Number.isNaN(x);
    }

    static isObject (x) {
        return typeof x === 'object' &&
            x !== null;
    }

    static isFunction (x) {
        return typeof x === 'function';
    }

    static isArray (x) {
        // Later make this more sophisticated, or use a library.
        return x &&
            typeof x.length === 'number' &&
            ! Util.isString(x) &&
            x.length >= 0 &&
            (x.length === 0 || x[0] !== undefined);
    }

    static isPrimitive (x) {
        if (x === undefined || x === null) {
            return true;
        }

        return [
            'boolean',
            'symbol',
            'bigint',
            'number',
            'string',
        ].includes(
            typeof x
        );
    }

    static array (x) {
        return Util.isArray(x) ? x : [x];
    }

    static unique (array) {
        return Array.from(new Set(array));
    }

    static union (a1, a2) {
        return Util.unique(
            (a1 || []).concat(a2 || [])
        );
    }

    // Returns a shallow copy of a array.
    static arrayCopy (a) {
        return a.map(x => x);
    }

    static clone (obj) {
        return _.cloneDeep(obj);
    }

    static round (n, precision) {
        return _.round(n, precision);
    }

    static commaNumber (n) {
        return commaNumber(n);
    }

    static abbrvNumber (n) {
        let output = '';
        const pos = Math.abs(n);

        if (pos < 1000) {
            output = pos.toString();
        }
        else if (pos < 1e6) {
            output = _.round(pos / 1000)
                .toFixed(0)
                + 'k';
        }
        else if (pos < 1e9) {
            output = _.round(pos / 1e6)
                .toFixed(0)
                + 'mn';
        }
        else {
            output = _.round(pos / 1e9)
                .toFixed(0)
                + 'bn';
        }

        return n >= 0 ?
            output :
            `-${output}`;
    }

    // returns number
    // static digits (n) {

    // }

    // Returns string
    static prettyDistance (meters) {
        meters = Math.abs(meters);

        const AU = 149597870700;
        const LIGHT_YEAR = 9460730472580800;

        if (meters < 3) {
            const rounded = _.round(meters, 2);

            return `${rounded} m`;
        }
        else if (meters < 1000) {
            const rounded = _.round(meters);

            return `${rounded} m`;
        }
        else if (meters < 3000) {
            const klicks = _.round(meters / 1000, 1);

            return `${klicks} km`;
        }
        else if (meters < AU * 0.1) {
            const klicks = Util.commaNumber(
                _.round(meters / 1000)
            );

            return `${klicks} km`;
        }
        else if (meters < AU * 3) {
            const au = _.round(meters / AU, 1)
                .toFixed(1);

            return `${au} AU`;
        }
        else if (meters < LIGHT_YEAR * 0.1) {
            const au = Util.commaNumber(
                _.round(meters / AU)
            );

            return `${au} AU`;
        } else if (meters < LIGHT_YEAR * 3) {
            const ly = _.round(meters / LIGHT_YEAR, 1);

            return `${ly} lightyears`;
        }
        else {
            const ly = Util.commaNumber(
                _.round(meters / LIGHT_YEAR)
            );

            return `${ly} lightyears`;
        }
    }

    static testPrettyDistance () {
        for (let n = 0.197842357; n < 94607304725808000000; n = 2 * n) {
            console.log(Util.prettyDistance(n));
        }
    }

    static prettyMeters (meters) {
        return `${Util.commaNumber(meters)}m`;
    }

    static prettyTime (seconds) {
        if (seconds < 59.5) {
            const rounded = _.round(seconds);
            return `${rounded} seconds`;
        }
        else if (seconds < 90) {
            return `1 minute`;
        }
        // 3570 seconds is 59.5 minutes
        else if (seconds < 3570) {
            const minutes = _.round(seconds / 60);
            return `${minutes} minutes`;
        }
        // 5400 seconds is 1.5 hours
        else if (seconds < 5400) {
            return `1 hour`;
        }
        // 84600 seconds is 23.5 hours
        else if (seconds < 84600) {
            const hours = _.round(seconds / 3600, 1);
            return `${hours} hours`;
        }
        // 31556736 seconds is roughly 1 year
        else if (seconds < 31556736) {
            const days = _.round(seconds / 86400, 1);
            return `${days} days`;
        }
        else {
            const years = _.round(seconds / 31556736, 1);
            return `${years} years`;
        }
    }

    static asBar (n) {
        let bar = '';

        for (let i = 0; i < n; i++) {
            bar = bar + '█';
        }

        return bar;
    }

    // Returns the input number rounded up or down to 1 sigfig.
    static sigfigRound (n, sigfigs) {
        sigfigs = sigfigs || 1;

        const log = Math.log10(Math.abs(n));

        return _.round(
            n,
            sigfigs - (1 + Math.floor(log))
        );
    }

    static testSigfigRound () {
        for (let f = 1; f < 3; f++) {
            for (let n = 1; n < 1000000; n++) {
                const output = Util.sigfigRound(n, f);
                const figs = Util.sigfigsOf(output);

                if (figs > f) {
                    const originalFigs = Util.sigfigsOf(n);
                    if (originalFigs < f) {
                        continue;
                    }

                    // Note that this test does not check whether it gets rid of TOO MANY sigfigs. In the case of (1950, 2) this seems hard to test for. It is correct to oversimplify to 2000, which has only 1 sigfig.

                    Util.logError(`In testSigfigRound(), sigfigRound(${n}, ${f}) === ${output}. This has ${figs} sigfigs, but it should have ${f}.`);
                    return false;
                }
            }
        }

        return true;
    }

    static sigfigsOf (n) {
        if (! Util.isNumber(n)) {
            n = parseFloat(n);
        }

        const s = n.toString();
        const parts = s.split('.');

        // Post decimal
        if (parts[1]) {
            if (parts[0] === '0') {
                // eg 0.0705 => 3
                const zeroes = Util.charCountAtStart(parts[1], '0');
                return parts[1].length - zeroes;
            }
            else {
                // eg 400.01 => 5
                return parts[0].length + parts[1].length;
            }
        }
        else {
            // eg 108000 => 3
            const zeroes = Util.charCountAtEnd(s, '0');
            return s.length - zeroes;
        }
    }

    // Call like 'await Util.sleep(6);'
    static sleep (seconds) {
        if (! Util.exists(seconds)) {
            seconds = 1;
        }

        return new Promise(
            funcWhenResolved => setTimeout(funcWhenResolved, seconds * 1000)
        );
    }

    // eg ('00705', '0') => 2
    static charCountAtStart (str, char) {
        for (let i = 0; i < str.length; i++) {
            if (str[i] !== char) {
                return i;
            }
        }

        return str.length;
    }

    // eg ('108000', '0') => 3
    static charCountAtEnd (str, char) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (str[i] !== char) {
                return (str.length - 1) - i;
            }
        }

        return str.length;
    }

    static isCapitalized (s) {
        return /[A-Z]/.test(s[0]);
    }

    static isAllCaps (s) {
        // TODO implement this.
        return false;
    }

    static stringify (x) {
        return JSON.stringify(
            x,
            undefined,
            '    '
        );
    }

    // LATER - desired funcs:
    // static yaml (x) {}
    // static safeToStringify (x) {}

    static log (input, tag) {
        // Later: Use chalk functions instead.
        // const TAG_COLORS = {
        //     error: 'red',
        //     warn: 'yellow',
        //     beacon: 'purple',
        //     event: 'blue',
        //     noisy: 'cyan',
        //     debug: 'green'
        // };

        tag = tag || 'event';
        const tagStr = tag.toUpperCase();
        // const tagColor = TAG_COLORS[tag.toLowerCase()] || TAG_COLORS['event'];
        // const tagStr = tagColor ?
        //     Util.colored(tag.toUpperCase(), tagColor) :
        //     tag;

        const dateTime = moment().format('YYYY MMM D hh:mm:ss.S');

        const info = Util.isString(input) ?
            input :
            Util.stringify(input);

        // Later: Red error and beacon text
        console.log(`  ${tagStr} (${ dateTime }) \n${ info }\n`);
    }

    static logDebug (input) {
        Util.log(input, 'debug');
    }

    static logWarn (input) {
        Util.log(input, 'warn');
    }

    static logError (input) {
        Util.log(input, 'error');
    }

    static error (summary) {
        throw new Error(
            Util.stringify(summary)
        );
    }

    // alias for the above.
    static throw (summary) {
        return Util.error(summary);
    }

    static makeEnum (array, allLower = false) {
        const dict = {};
        for (let val of array) {
            const key = allLower ?
                Util.uncapitalized(val) :
                Util.capitalized(val);

            dict[key] = Util.uncapitalized(val);
        }

        return dict;
    }

    static withProp (array, key) {
        return array.filter(x => x[key]);
    }

    static toJson (x) {
        return x && Util.isFunction(x.toJson) ?
            x.toJson() :
            x;
    }

    // Useful for dicts of objects like wGenerator.aliasTables
    static dictToJson (dict) {
        const serialized = {};

        Object.keys(dict)
            .forEach(
                key => {
                    const value = dict[key];

                    serialized[key] = (value && value.toJson) ?
                        value.toJson() :
                        value;
                }
            );

        return serialized;
    }

    static valuesAsIDs (obj) {
        const converted = {};

        for (let key in obj) {
            const val = obj[key];

            converted[key] = val?.id || val;
        }

        return converted;
    }

    static certainKeysOf (obj, keyArray) {
        const output = {};

        for (let key of keyArray) {
            output[key] = obj[key];
        }

        return output;
    }

    // Myers-Briggs Type Indicator (personality category)
    static mbti () {
        return [
            Util.randomOf(['I', 'E']),
            Util.randomOf(['S', 'N']),
            Util.randomOf(['T', 'F']),
            Util.randomOf(['P', 'J'])
        ]
        .join('');
    }

    static testAll () {
        Util.testPrettyDistance();
        Util.testCamelCase();
        Util.testPadSides();
        Util.testShuffle();
        Util.testSigfigRound();
        Util.testRoll1d6();
        Util.logDebug(`Done with unit tests for Util module :)`);
    }
}

// aliases
Util.includes = Util.contains;
Util.sample = Util.sampleFrom = Util.randomOf;

Util.DEFAULTS = {
    ROWCOUNT: 12,
    COLCOUNT: 12
};

Util.NODE_TYPES = {
    region: 'region',
    location: 'location'  // deprecated
};

// These are like preselected color profiles.
// The background is as described, and the foreground is black or white, whichever is most visible.
Util.COLORS = {
    red: '\x1b[1;37;41m',
    yellow: '\x1b[1;37;43m',
    green: '\x1b[1;30;42m',
    cyan: '\x1b[1;30;46m',
    blue: '\x1b[1;37;44m',
    purple: '\x1b[1;37;45m',
    grey: '\x1b[1;30;47m',
    black: '\x1b[1;37;40m',
    balance: '\x1b[0m'
};

module.exports = Util;

// Util.testAll();
