'use strict';

const _ = require('lodash');
const commaNumber = require('comma-number');
const moment = require('moment');

// TODO: import util funcs from util.js in the warband repo
// TODO: Maybe make this file generic, usable by most of my projects.
// Can split out Battle20 specific stuff into another utils file.
const util = module.exports;

util.DEFAULTS = {
    ROWCOUNT: 12,
    COLCOUNT: 12
};

util.colors = {
    black: '1;37;40m',
    red: '1;37;41m',
    green: '1;30;42m',
    yellow: '1;37;43m',
    blue: '1;37;44m',
    purple: '1;37;45m',
    cyan: '1;30;46m',
    grey: '1;30;47m'
};

util.NODE_TYPES = {
    region: 'region',
    location: 'location'  // deprecated
};

// TODO: Specify all this as a class with static member funcs, not this silly function assignment syntax.
util.exists = (x) => {
    return x !== undefined &&
        x !== null &&
        x !== '' &&
        ! util.isNaN(x);
};

util.legit = (x) =>
    util.exists(x) &&
    x !== [] &&
    x !== {};

// TODO reconsider this weird function syntax. Maybe declare a class of functions, then assign the field props to it?
util.default = function (input, defaultValue) {
    if (input === undefined) {
        return defaultValue;
    } else {
        return input;
    }
};

util.contains = function (array, fugitive) {
    return array.indexOf(fugitive) >= 0;
};

util.includes = util.contains;

util.hasOverlap = function (arrayA, arrayB) {
    for (let i = 0; i < arrayA.length; i++) {
        if (util.contains(arrayB, arrayA[i])) {
            return true;
        }
    }

    return false;
};

// Returns number
// Default 0
util.sum = function (array) {
    return util.array(array).reduce(
        (sumSoFar, element) => {
            const n = Number(element) || 0;
            return sumSoFar + n;
        },
        0
    );
};

// Average
util.mean = (array) => {
    array = util.array(array);
    const sum = util.sum(array);
    return sum / array.length;
};

util.randomIntBetween = function (minInclusive, maxExclusive) {
    if (! util.exists(minInclusive) || ! util.exists(maxExclusive)) {
        console.log('error: util.randomIntBetween() called with missing parameters.');
        return -1;
    } else if (maxExclusive <= minInclusive) {
        console.log('error: util.randomIntBetween() called with max <= min.');
        return -1;
    }

    return Math.floor( Math.random() * (maxExclusive - minInclusive) + minInclusive );
};

util.randomUpTo = function (maxInclusive) {
    return util.randomIntBetween(0, maxInclusive + 1);
};

util.randomBelow = function (maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
};

util.randomOf = function (array) {
    return array[
        util.randomBelow(array.length)
    ];
};
util.sample = util.sampleFrom = util.randomOf; // alias

util.randomFromObj = function (obj) {
    const key = util.randomOf(Object.keys(obj));
    return obj[key];
};

// decimalPlaces param is optional and lodash defaults it to 0.
util.randomRange = function (minInclusive, maxExclusive, decimalPlaces) {
    if (maxExclusive < minInclusive) {
        const temp = minInclusive;
        minInclusive = maxExclusive;
        maxExclusive = temp;
    }

    const unrounded = (Math.random() * (maxExclusive - minInclusive))
        + minInclusive;

    return _.round(unrounded, decimalPlaces);
};

// util.round = function (x, decimalPlaces) {
//     return 
// };

// Returns string
util.newId = function () {
    // Later research the most performant way to run this.
    const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ID_LENGTH = 50;

    let id = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        const index = Math.floor( Math.random() * ALPHABET.length );
        id += ALPHABET[index];
    }

    return id;
};

// Returns string
util.shortId = function (id) {
    return id ?
        `${id.slice(0, 3)}` :
        '';
};

// Input string[]
// Returns string summarizing redundancies
util.arraySummary = (a) => {
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
            s => `${s} x${util.abbrvNumber(dict[s])}`
        );

    return archetypes.join(', ');
};

util.repeat = function (str, n) {
    let outStr = '';
    for (let i = 0; i < n; i++) {
        outStr += str;
    }

    return outStr;
};

util.formatProp = function (object, propName) {
    const value = object[propName];
    if (! util.legit(value)) {
        return '';
    }

    // Later handle special and modification objects better.
    return `${ propName }: ${ util.formatExpression(value) }`;
};

util.formatExpression = function (input) {
    const type = typeof input;
    if (util.isArray(input)) {
        return input.map(
            x => util.formatExpression(x)
        )
        .join(', ');
    }
    if (type === 'object') {
        return util.formatObj(input);
    }

    return input;
}

util.formatObj = function (obj) {
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

util.containsVowels = (s) => {
    const chars = s.toUpperCase()
        .split('');

    for (let char of chars) {
        if (util.contains('AEIOUY', char)) {
            return true;
        }
    }

    return false;
};

util.capitalized = (s) => {
    if (! util.exists(s)) {
        return '';
    }
    else if (s.length === 1) {
        return s.toUpperCase();
    }
    // Controversially, interpret no-vowel strings as acronyms
    else if (! util.containsVowels(s)) {
        return s.toUpperCase();
    }

    return s[0].toUpperCase() +
        s.slice(1);
        // s.slice(1).toLowerCase();
};

util.uncapitalized = (s) => {
    if (! util.exists(s)) {
        return '';
    }
    else if (s.length === 1) {
        return s.toLowerCase();
    }

    return s[0].toLowerCase() +
        s.slice(1);
};

util.toCamelCase = (s) => {
    if (! util.exists(s)) {
        return '';
    }

    const words = s.split(/\s/);
    const tail = words.slice(1)
        .map(sub => util.capitalized(sub))
        .join('');

    return words[0].toLowerCase() +
        tail;
};

// input: 'dolphinWithWings'
// returns: 'Dolphin With Wings'
util.fromCamelCase = (s) => {
    if (! util.exists(s)) {
        return '';
    }
    else if (s.length === 1) {
        return s.toUpperCase();
    }

    const wordStarts = [0];
    const words = [];

    for (let i = 1; i < s.length; i++) {
        if (util.isCapitalized(s[i])) {
            if (util.isCapitalized(s[i-1])) {
                // Detect acronym words and leave them uppercase.
                // eg: openHTMLFile
                const followedByLowercase = (i < s.length - 1) &&
                    ! util.isCapitalized(s[i+1]);
                if (! followedByLowercase) {
                    continue;
                }
            }

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
        w => util.isAllCaps(w) ?
            w :
            util.capitalized(w)
    )
    .join(' ');
};

util.testCamelCase = () => {
    const tests = [
        ['Hector Breaker Of Horses', 'hectorBreakerOfHorses'],
        ['Cellar Door', 'cellarDoor'],
        ['C Deck', 'cDeck'],
        ['Awakening', 'awakening']
    ];

    tests.forEach(t => {
        const camelized = util.toCamelCase(t[0]);
        const uncamelized = util.fromCamelCase(t[1]);

        if (camelized !== t[1]) {
            throw new Error(camelized);
        }
        if (uncamelized !== t[0]) {
            throw new Error(uncamelized);
        }
    });
};

// Note that typeof NaN is also 'number',
// but it is still despicable.
util.isNumber = function (x) {
    return typeof x === 'number' &&
        ! util.isNaN(x);
};

util.isString = function (x) {
    return typeof x === 'string';
};

util.isNaN = function (x) {
    return Number.isNaN(x);
};

util.isObject = function (x) {
    return typeof x === 'object' &&
        x !== null;
};

util.isFunction = function (x) {
    return typeof x === 'function';
};

util.isArray = function (x) {
    // Later make this more sophisticated, or use a library.
    return x &&
        typeof x.length === 'number' &&
        ! util.isString(x) &&
        x.length >= 0 &&
        (x.length === 0 || x[0] !== undefined);
};

util.array = (x) => {
    return util.isArray(x) ? x : [x];
};

util.unique = (array) => {
    return Array.from(new Set(array));
};

util.union = (a1, a2) => {
    return util.unique(
        (a1 || []).concat(a2 || [])
    );
};

// Returns a shallow copy of a array.
util.arrayCopy = (a) => {
    return a.map(x => x);
};

util.commaNumber = (n) =>
    commaNumber(n);

util.abbrvNumber = (n) => {
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
            + 'tn';
    }

    return n >= 0 ?
        output :
        `-${output}`;
};

// Returns string
util.prettyDistance = (meters) => {
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
        const klicks = util.commaNumber(
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
        const au = util.commaNumber(
            _.round(meters / AU)
        );

        return `${au} AU`;
    } else if (meters < LIGHT_YEAR * 3) {
        const ly = _.round(meters / LIGHT_YEAR, 1);

        return `${ly} lightyears`;
    }
    else {
        const ly = util.commaNumber(
            _.round(meters / LIGHT_YEAR)
        );

        return `${ly} lightyears`;
    }
};

util.testPrettyDistance = () => {
    for (let n = 0.197842357; n < 94607304725808000000; n = 2 * n) {
        console.log(util.prettyDistance(n));
    }
};

util.prettyMeters = (meters) => {
    return `${util.commaNumber(meters)}m`;
};

util.prettyTime = (seconds) => {
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
};

util.asBar = (n) => {
    let bar = '';

    for (let i = 0; i < n; i++) {
        bar = bar + 'X';
    }

    return bar;
};

// Returns the input number rounded up or down to 1 sigfig.
util.sigfigRound = (n, sigfigs) => {
    sigfigs = sigfigs || 1;

    const log = Math.log10(Math.abs(n));

    return _.round(
        n,
        sigfigs - (1 + Math.floor(log))
    );
};

util.testSigfigRound = () => {
    for (let f = 1; f < 3; f++) {
        for (let n = 1; n < 1000000; n++) {
            const output = util.sigfigRound(n, f);
            const figs = util.sigfigsOf(output);

            if (figs > f) {
                const originalFigs = util.sigfigsOf(n);
                if (originalFigs < f) {
                    continue;
                }

                // Note that this test does not check whether it gets rid of TOO MANY sigfigs. In the case of (1950, 2) this seems hard to test for. It is correct to oversimplify to 2000, which has only 1 sigfig.

                util.logError(`In testSigfigRound(), sigfigRound(${n}, ${f}) === ${output}. This has ${figs} sigfigs, but it should have ${f}.`);
                return false;
            }
        }
    }

    return true;
};

util.sigfigsOf = (n) => {
    if (! util.isNumber(n)) {
        n = parseFloat(n);
    }

    const s = n.toString();
    const parts = s.split('.');

    // Post decimal
    if (parts[1]) {
        if (parts[0] === '0') {
            // eg 0.0705 => 3
            const zeroes = util.charCountAtStart(parts[1], '0');
            return parts[1].length - zeroes;
        }
        else {
            // eg 400.01 => 5
            return parts[0].length + parts[1].length;
        }
    }
    else {
        // eg 108000 => 3
        const zeroes = util.charCountAtEnd(s, '0');
        return s.length - zeroes;
    }
};

// Call like 'await Util.sleep(6);'
util.sleep = (seconds) =>
    new Promise(
        funcWhenResolved => setTimeout(funcWhenResolved, seconds * 1000)
    );

// eg ('00705', '0') => 2
util.charCountAtStart = (str, char) => {
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== char) {
            return i;
        }
    }

    return str.length;
};

// eg ('108000', '0') => 3
util.charCountAtEnd = (str, char) => {
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] !== char) {
            return (str.length - 1) - i;
        }
    }

    return str.length;
};

util.isCapitalized = (s) => {
    // TODO: /[A-Z]/ is more like 'contains capitals'.
    return /[A-Z]/.test(s);
};

util.isAllCaps = (s) => {
    // TODO implement this.
    return false;
};

util.stringify = function (x) {
    return JSON.stringify(
        x,
        undefined,
        '    '
    );
};

// TODO util.yaml(x)

util.log = function (input, tag) {
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
    //     util.colored(tag.toUpperCase(), tagColor) :
    //     tag;

    const dateTime = moment().format('YYYY MMM D hh:mm:ss.S');

    const info = util.isString(input) ?
        input :
        util.stringify(input);

    // Later: Red error and beacon text
    console.log(`  ${tagStr} (${ dateTime }) ${ info }\n`);
};

util.logDebug = function (input) {
    util.log(input, 'debug');
};

util.logError = function (input) {
    util.log(input, 'error');
};

util.makeEnum = (vals) => {
    const dict = {};
    for (let val of vals) {
        dict[util.capitalized(val)] = util.uncapitalized(val);
    }

    return dict;
};

util.withProp = (array, key) => {
    return array.filter(x => x[key]);
};

util.toJson = (x) => {
    return x && util.isFunction(x.toJson) ?
        x.toJson() :
        x;
}

// Useful for dicts of objects like wGenerator.aliasTables
util.dictToJson = (dict) => {
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
};

// Myers-Briggs Type Indicator (personality category)
util.mbti = () => {
    return [
        util.randomOf(['I', 'E']),
        util.randomOf(['S', 'N']),
        util.randomOf(['T', 'F']),
        util.randomOf(['P', 'J'])
    ]
    .join('');
};

util.testAll = () => {
    util.testPrettyDistance();
    util.testCamelCase();
    util.testSigfigRound();
    util.logDebug(`Done with unit tests for Util module :)`);
};

// util.testAll();
