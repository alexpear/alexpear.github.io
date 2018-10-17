'use strict';

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
        x !== NaN &&
        x !== '';
};

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

util.randomIntBetween = function (minInclusive, maxExclusive) {
    if (!minInclusive || !maxExclusive) {
        console.log('error: util.randomIntBetween() called with missing parameters.');
        return -1;
    } else if (maxExclusive <= minInclusive) {
        console.log('error: util.randomIntBetween() called with max <= min.');
        return -1;
    }

    return Math.floor( Math.random() * (maxExclusive - minInclusive) + minInclusive );
};

util.randomUpTo = function (maxInclusive) {
    return util.randomIntBetween(0, maxInclusive - 1);
};

util.randomOf = function (array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};

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

util.repeat = function (str, n) {
    let outStr = '';
    for (let i = 0; i < n; i++) {
        outStr += str;
    }

    return outStr;
};

util.formatProp = function (object, propName) {
    if (! object[propName]) {
        return '';
    }

    // Later handle special and modification objects better.
    return `${ propName }: ${ object[propName] }`;
};

util.capitalized = (s) => {
    if (! util.exists(s)) {
        return '';
    }
    else if (s.length === 1) {
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
        .map(sub = util.capitalized(sub))
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
            wordStarts.push(i);

            const firstLetter = wordStarts[wordStarts.length - 2];
            const word = s.slice(firstLetter, i);
            words.push(word);
        }
    }

    const lastCapital = wordStarts[wordStarts.length - 1];
    const lastWord = s.slice(lastCapital);
    words.push(lastWord);

    return words.map(w => util.capitalized(w))
        .join(' ');
};

util.isNumber = function (x) {
    return typeof x === 'number';
};

util.isString = function (x) {
    return typeof x === 'string';
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
}

util.isCapitalized = (s) => {
    return /[A-Z]/.test(s);
};

util.stringify = function (x) {
    return JSON.stringify(
        x,
        undefined,
        '    '
    );
};

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

util.makeEnum = (vals) => {
    const dict = {};
    for (let val of vals) {
        dict[val] = util.uncapitalized(val);
    }

    return dict;
};


